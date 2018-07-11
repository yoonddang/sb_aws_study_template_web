package com.template.web.controller.login;

import com.template.common.constants.TemplateConstants;
import com.template.common.model.user.TemplateUser;
import com.template.common.model.common.ResultInfo;
import com.template.common.reststub.login.LoginStubBO;
import com.template.common.util.Aes128Util;
import com.template.common.util.CookieUtils;
import com.template.common.util.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private LoginStubBO loginStubBO;

	@Autowired
	private MailService mailService;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String dispLoginLogin(Model model) {
		try {
			//todo 소셜 관련 데이터 클라쪽으로 넘겨줘야함.
		} catch (Exception e) {
			logger.error("error in login.", e);
		}
		return "login/login";
	}

	@RequestMapping(value = "/templateLogin", method = RequestMethod.POST, produces = "application/json; charset=utf8")
	@ResponseBody
	public String templateLogin(HttpServletRequest request, HttpServletResponse response,
							  @RequestParam(value = "userEmail" ,required =  false) String userEmail,
							  @RequestParam(value = "userPass" ,required =  false) String userPass) {

		logger.info("templateLogin {}   {} ",userEmail,userPass);

		TemplateUser userData = new TemplateUser();
		userData.setEmail(userEmail);
		userData.setPass_word(userPass);

		String json = loginStubBO.userLogin(userData);
		ResultInfo resultInfo = JsonUtils.rootDataToObject(json, ResultInfo.class);

		boolean isLogin = (boolean) resultInfo.getResultData().get("isLogin");

		if(isLogin)	{
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.HOUR,	TemplateConstants.EXPIRE_DURATION);
			// 로그인 쿠키 생성
			// 보안을 위해서 암호화 해줌.
			Aes128Util aes128Util = new Aes128Util(TemplateConstants.AES128_KEY);
			userData.setExpireDate(calendar.getTime());
			String userJson = JsonUtils.toJson(userData);
			String encrypted = aes128Util.encrypt(userJson);

			CookieUtils.setCookie(response, TemplateConstants.USER_COOKIE_NAME, encrypted, TemplateConstants.EXPIRE_DURATION, request.getServerName());
		}
		Map<String, Object> loginJson = new HashMap<>();
		loginJson.put("isLogin",	isLogin);
		loginJson.put("redirectUrl",	"redirect:/");
		loginJson.put("message", resultInfo.getMessage());
		return JsonUtils.toJson(loginJson);
	}

	@ResponseBody
	@RequestMapping(value = "/signout", method = RequestMethod.POST)
	public String templateLogOut(Model model,	HttpServletRequest request, HttpServletResponse response) {

		logger.info("templateLogOut");

		CookieUtils.setCookie(response, TemplateConstants.USER_COOKIE_NAME, "", TemplateConstants.EXPIRE_DURATION, request.getServerName());

		Map<String, String> loginJson = new HashMap<>();
		loginJson.put("isLogin",	"false");
		loginJson.put("redirectUrl",	"redirect:/");

		return JsonUtils.toJson(loginJson);
	}


}
