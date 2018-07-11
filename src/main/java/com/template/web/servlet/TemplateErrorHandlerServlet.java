package com.template.web.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TemplateErrorHandlerServlet extends ErrorHandlerServlet {
	private static final long serialVersionUID = 6534546444217151329L;
	private static Logger logger = LoggerFactory.getLogger(TemplateErrorHandlerServlet.class);

	@Override
	protected RequestDispatcher getRequestDispatcher(HttpServletRequest request, HttpServletResponse response) {
		Throwable exception = (Throwable) request.getAttribute("javax.servlet.error.exception");
		Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");

		logger.info("check : "+"/error/" + getErrorCode(exception, statusCode) + ".jsp");
		return request.getRequestDispatcher("/error/" + getErrorCode(exception, statusCode) + ".jsp");
	}

	@Override
	protected void logError(HttpServletRequest request, HttpServletResponse response) {

		Throwable exception = (Throwable) request.getAttribute("javax.servlet.error.exception");
		String requestUri = (String) request.getAttribute("javax.servlet.error.request_uri");
		Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
		String queryString = request.getQueryString();

		String logMessage = statusCode + "[URI]" + requestUri + "?" + queryString + "[IP]" + request.getRemoteAddr()
				+ "[Referer]" + request.getHeader("Referer") + "[Agent]" + request.getHeader("UserController-Agent");

		if (new Integer(HttpServletResponse.SC_NOT_FOUND).equals(statusCode)) {
			logger.warn(logMessage, exception);
		} else if (new Integer(HttpServletResponse.SC_BAD_REQUEST).equals(statusCode)) {
			logger.warn(logMessage, exception);
		} else {
			logger.error(logMessage, exception);
		}
	}

	protected String getErrorCode(Throwable exception, Integer statusCode) {
		if (exception != null)
			return "nodisplay";
		if (statusCode == null)
			return "nodisplay";
		if (statusCode.intValue() == HttpServletResponse.SC_BAD_REQUEST)
			return "notfound";
		if (statusCode.intValue() == HttpServletResponse.SC_NOT_FOUND)
			return "notfound";
		if (statusCode.intValue() == HttpServletResponse.SC_UNAUTHORIZED)
			return "noprivilege";
		if (statusCode.intValue() == HttpServletResponse.SC_FORBIDDEN)
			return "noprivilege";
		if (statusCode.intValue() == HttpServletResponse.SC_METHOD_NOT_ALLOWED)
			return "nodisplay";
		return "nodisplay";
	}

	@Override
	protected void before(HttpServletRequest request, HttpServletResponse response) {
		Throwable exception = (Throwable) request.getAttribute("javax.servlet.error.exception");

		String requestUri = (String) request.getAttribute("javax.servlet.error.request_uri");

		if (request.getAttribute("url") != null)
			return;

		String fullPath = "http://" + request.getServerName() + ":" + request.getServerPort() + requestUri;
		request.setAttribute("url", fullPath);
	}

}