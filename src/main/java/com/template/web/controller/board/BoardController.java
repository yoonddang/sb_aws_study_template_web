package com.template.web.controller.board;

import com.template.common.constants.TemplateConstants;
import com.template.common.enumType.BoardCategoryEnum;
import com.template.common.model.board.BoardVO;
import com.template.common.model.board.SearchVO;
import com.template.common.model.common.ResultInfo;
import com.template.common.model.user.TemplateUser;
import com.template.common.reststub.board.BoardStubBO;
import com.template.common.util.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.template.common.util.TemplateUtil.checkLogin;
import static com.template.common.util.TimeUtil.getNowDateToString;
import static com.template.common.util.board.utiletc.classifyCategory;

@Controller
@RequestMapping("/board")
public class BoardController {
	private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

	@Autowired
	private BoardStubBO boardStubBO;

	/**
	 * 	@RestStubMethod(value = "/getBoardList/{category}/{searchKeyword}/{searchType}", requestMethod = RequestMethod.POST)
	 * 	@RestStubMethod(value = "/getBoardOne/{boardIdx}", requestMethod = RequestMethod.POST)
	 *
	 * 	@RestStubMethod(value = "/updateBoardRead/{boardIdx}", requestMethod = RequestMethod.POST)
	 *	@RestStubMethod(value = "/deleteBoardOne/{boardIdx}", requestMethod = RequestMethod.POST)
	 *	@RestStubMethod(value = "/insertBoard", requestMethod = RequestMethod.POST)
	 *
	 *	@RestStubMethod(value = "/selectNewAlbum/{length}", requestMethod = RequestMethod.POST)
	 *	@RestStubMethod(value = "/selectSchedule/{length}", requestMethod = RequestMethod.POST)
	 */

	// 공지사항, 팬사인회등 카테고리 값을 받아오면 별도의 페이지 구성이 가능하다.
	// SearchVO (category, searchKeyword, searchType)
	@RequestMapping(value = "/list/{category}", method = RequestMethod.GET)
	public String getBoardList(@PathVariable String category, @RequestParam(defaultValue = "") String searchKeyword
			, @RequestParam(defaultValue = "") String searchType, Model model, @RequestParam(defaultValue = "10") int length) {
		logger.info("getBoardList - category : {}, searchKeyword : {}, searchType : {}", category, searchKeyword, searchType);

		SearchVO searchVO = new SearchVO();
		searchVO.setCategory(category);
		searchVO.setSearchKeyword(searchKeyword);
		searchVO.setSearchType(searchType);
		searchVO.setLength(length);
		String resultJson = boardStubBO.getBoardList(searchVO);
		ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson,  ResultInfo.class);

		// 햄버거메뉴 변경시 classifyCategory 메소드 변경 필요
		searchVO.setCategory(classifyCategory(category));

		model.addAttribute("result", resultInfo.getResultData());
		model.addAttribute("searchVO", searchVO);
		model.addAttribute("category", category);
		return "board/community/list";
	}

	// 게시판 더보기
	// SearchVO (category, searchKeyword, searchType)
	@RequestMapping(value = "/listmore/{category}", method = RequestMethod.GET, produces = "application/json; charset=utf8")
	@ResponseBody
	public String getBoardListMore(@PathVariable String category, @RequestParam(defaultValue = "") String searchKeyword
			, @RequestParam(defaultValue = "") String searchType, Model model, @RequestParam(defaultValue = "10") int length) {
		logger.info("getBoardList - category : {}, searchKeyword : {}, searchType : {}", category, searchKeyword, searchType);

		String resultJson;
		SearchVO searchVO = new SearchVO();
		searchVO.setCategory(category);
		searchVO.setSearchKeyword(searchKeyword);
		searchVO.setSearchType(searchType);
		searchVO.setLength(length);

		resultJson = boardStubBO.getBoardList(searchVO);

		ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson,  ResultInfo.class);

		return JsonUtils.toJson(resultInfo);
	}

	@RequestMapping(value = "/main/{category}", method = RequestMethod.GET)
	public String getBoardListForMain(@PathVariable String category, @RequestParam(defaultValue = "") String searchKeyword
			, @RequestParam(defaultValue = "") String searchType, Model model) {
		logger.info("getBoardListForMain - category : {}, searchKeyword : {}, searchType : {}", category, searchKeyword, searchType);

		SearchVO searchVO = new SearchVO();
		searchVO.setCategory(category);
		searchVO.setSearchKeyword(searchKeyword);
		searchVO.setSearchType(searchType);
		searchVO.setLength(10);
		String resultJson = boardStubBO.getBoardList(searchVO);
		ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson,  ResultInfo.class);

		// 햄버거메뉴 변경시 classifyCategory 메소드 변경 필요
		searchVO.setCategory(classifyCategory(category));

		model.addAttribute("result", resultInfo.getResultData());
		model.addAttribute("searchVO", searchVO);
		model.addAttribute("category", category);
		return "board/main/notice";
	}

	// 글 읽기
	@RequestMapping(value = "/one/{category}", method = RequestMethod.GET)
	public String getBoardOne(@PathVariable String category, String boardIdx, Model model, HttpServletRequest request) {
		logger.info("getBoardOne - category : {}, boardIdx : {}", category, boardIdx);
		SearchVO searchVO = new SearchVO();
		String permit = "";

		String resultJson = boardStubBO.getBoardOne(boardIdx);
		BoardVO boardVO = JsonUtils.toResultDataObject(resultJson, "boardData", BoardVO.class);

		TemplateUser userData = (TemplateUser)request.getAttribute(TemplateConstants.USER_INFO);
		if("6".equals(category)) {
			if(userData != null) {
				if(!userData.getNickname().equals(boardVO.getWriter())) {
					permit = "NoPermit";
				}
				if("관리자".equals(userData.getNickname())) {
					permit = "Permit";
				}
			} else {
				permit = "NoPermit";
			}
		}

		searchVO.setCategory(classifyCategory(category));
		boardVO.setContent(
				boardVO.getContent()
						.replaceAll("&lt;","<")
						.replaceAll("&gt",">")
						.replaceAll("\"","&quot;")
						.replaceAll("'","&#39;")
						.replaceAll("\r\n","<br>")
		);

		model.addAttribute("boardData", boardVO);
		model.addAttribute("searchVO", searchVO);
		model.addAttribute("category", category);
		model.addAttribute("permit", permit);
		return "board/community/view";
	}

	// 글 쓰기 페이지
	@RequestMapping(value = "/form/{category}", method = RequestMethod.GET)
	public String form(@PathVariable String category, String boardIdx, ModelMap modelMap, HttpServletRequest request, HttpServletResponse response, Model model) {
		logger.info("form - category : {}, boardIdx : {}", category, boardIdx);

		checkLogin(request, response, true);

		BoardVO boardVO = null;
		if (StringUtils.isNotBlank(boardIdx)) {
			String resultJson = boardStubBO.getBoardOne(boardIdx);
			boardVO = JsonUtils.toResultDataObject(resultJson, "boardData", BoardVO.class);
			boardVO.setContent(
					boardVO.getContent()
							.replaceAll("<br>","")
			);

			modelMap.addAttribute("boardData", boardVO);
		} else {
			boardVO = new BoardVO();
			boardVO.setCategory(category);
			boardVO.setBoardCategoryEnum(BoardCategoryEnum.CATEGORY2);
		}

		model.addAttribute("today", getNowDateToString());
		model.addAttribute("category", category);
		return "board/community/form";
	}

	// 글 쓰기
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = "application/json; charset=utf8")
	@ResponseBody
	public String save(BoardVO boardVO, Model model) {
		logger.info("save - title:{}", boardVO.getTitle());

		String resultJson = StringUtils.isBlank(boardVO.getBoard_idx()) ? boardStubBO.insertBoard(boardVO) : boardStubBO.updateBoard(boardVO);

		ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson, ResultInfo.class);
		return JsonUtils.toJson(resultInfo);
	}

	// 글 삭제
	@RequestMapping(value = "/delete/{category}", method = RequestMethod.GET, produces = "application/json; charset=utf8")
	@ResponseBody
	public String delete(@PathVariable String category, String boardIdx, Model model) {
		logger.info("delete - boardIdx, : {}", boardIdx);

		// TODO 작성자 = login user 인증 체크

		String resultJson = boardStubBO.deleteBoardOne(boardIdx);

		ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson, ResultInfo.class);
		return JsonUtils.toJson(resultInfo);
	}

}
