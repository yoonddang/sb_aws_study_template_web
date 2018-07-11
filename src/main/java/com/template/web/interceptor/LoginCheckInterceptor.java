package com.template.web.interceptor;

import com.template.common.constants.TemplateConstants;
import com.template.common.model.user.TemplateUser;
import com.template.common.model.common.ResultInfo;
import com.template.common.model.user.UserAuthority;
import com.template.common.reststub.login.LoginStubBO;
import com.template.common.util.Aes128Util;
import com.template.common.util.CookieUtils;
import com.template.common.util.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;


@Component
public class LoginCheckInterceptor extends HandlerInterceptorAdapter {

	private static final Logger logger = LoggerFactory.getLogger(LoginCheckInterceptor.class);

	@Autowired
	private LoginStubBO loginStubBO;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		try {
			logger.info("LoginCheckInterceptor request uri : {}",request.getRequestURI());
			String requestUri = request.getRequestURI();
			UserAuthority userAuthority = null;

			//쿠키가 없다면 로그인 안된거임!
			//TODO 로그인이 안되었을때 특정 페이지 접근 제한을 걸어야 한다.
			Cookie value = CookieUtils.getCookie(request, TemplateConstants.USER_COOKIE_NAME);
			if (value != null && value.getValue() != null && "".equals(value.getValue()) == false) {
				String cookie = value.getValue();
				Aes128Util aes128Util = new Aes128Util(TemplateConstants.AES128_KEY);
				String userJson = aes128Util.decrypt(cookie);
				TemplateUser userData = JsonUtils.toObject(userJson, TemplateUser.class);

				String json = loginStubBO.userLogin(userData);
				ResultInfo resultInfo = JsonUtils.rootDataToObject(json, ResultInfo.class);
				Map<String, Object> resultData = resultInfo.getResultData();
				//todo 관련 회원정보에 코인정보 및 등급 등의 데이터 추가 가공필요.
				TemplateUser templateUser = JsonUtils.toDataObject(JsonUtils.toJson(resultData),"templateUser" ,TemplateUser.class);

				request.setAttribute(TemplateConstants.USER_INFO, templateUser);
				request.setAttribute(TemplateConstants.IS_LOGIN, true);
				request.setAttribute(TemplateConstants.USER_AUTHORITY, userAuthority);
				request.setAttribute(TemplateConstants.CSS_MOD_DATE, TemplateConstants.CSS_JS_VERSION);
			} else {
				//userAuthority = getAuthorityByUserRole("ROLE_ANONYMOUS");
				request.setAttribute(TemplateConstants.USER_AUTHORITY, userAuthority);
				request.setAttribute(TemplateConstants.IS_LOGIN, false);
				request.setAttribute(TemplateConstants.CSS_MOD_DATE, TemplateConstants.CSS_JS_VERSION);
			}

		} catch (Exception e) {
			logger.error("ERROR preHandle in LoginCheckInterceptor", e);
		}
		return true;
	}

}

