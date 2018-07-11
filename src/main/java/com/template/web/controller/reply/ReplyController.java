package com.template.web.controller.reply;

import com.template.common.model.board.ReplyVO;
import com.template.common.model.common.ResultInfo;
import com.template.common.reststub.reply.ReplyStubBO;
import com.template.common.util.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/reply")
public class ReplyController {
    private static final Logger logger = LoggerFactory.getLogger(ReplyController.class);

    @Autowired
    private ReplyStubBO replyStubBO;


    // 댓글리스트 호출
    @RequestMapping(value = "/getReplyList", method = RequestMethod.GET)
    public String getReplyList(String idx, @RequestParam(defaultValue = "0") String maxReorder, @RequestParam(defaultValue = "0") int length, Model model) {
        logger.info("getReplyList idx : {}, minReorder : {}", idx, maxReorder);

        String resultJson = replyStubBO.getReplyList(idx, maxReorder, length);
        ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson,  ResultInfo.class);

        model.addAttribute("result", resultInfo.getResultData());
        model.addAttribute("idx", idx);
        return "board/reply/reply";
    }

    // 대댓글리스트 호출
    @RequestMapping(value = "/getReplyListDepth", method = RequestMethod.GET)
    public String getReplyListDepth(String parentReplyIdx, @RequestParam(defaultValue = "0")String maxReorder, Model model) {
        logger.info("getReplyListDepth parentReplyIdx : {}, maxReorder : {}", parentReplyIdx, maxReorder);

        String resultJson = replyStubBO.getReplyListDepth(parentReplyIdx, maxReorder);
        ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson,  ResultInfo.class);

        model.addAttribute("result", resultInfo.getResultData());
        model.addAttribute("parentReplyIdx", parentReplyIdx);
        return "board/reply/depth";
    }

    // 댓글 입력
    @RequestMapping(value = "/insertReply", method = RequestMethod.POST, produces = "application/json; charset=utf8")
    @ResponseBody
    public String insertReply(ReplyVO replyVO, Model model) {
        logger.info("insertReply ");

        String resultJson = replyStubBO.insertReply(replyVO);

        ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson, ResultInfo.class);
        return JsonUtils.toJson(resultInfo);
    }

    // 댓글 수정
    @RequestMapping(value = "/updateReply", method = RequestMethod.POST, produces = "application/json; charset=utf8")
    @ResponseBody
    public String updateReply(ReplyVO replyVO, Model model) {
        logger.info("updateReply ");

        String resultJson = replyStubBO.updateReply(replyVO);

        ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson, ResultInfo.class);
        return JsonUtils.toJson(resultInfo);
    }

    // 댓글 삭제
    @RequestMapping(value = "/deleteReply", method = RequestMethod.GET, produces = "application/json; charset=utf8")
    @ResponseBody
    public String deleteReply(String replyIdx, String email, Model model) {
        logger.info("deleteReply replyIdx : {}, email : {}", replyIdx, email);

        String resultJson = replyStubBO.deleteReply(replyIdx, email+".");

        ResultInfo resultInfo = JsonUtils.rootDataToObject(resultJson, ResultInfo.class);
        return JsonUtils.toJson(resultInfo);
    }

}
