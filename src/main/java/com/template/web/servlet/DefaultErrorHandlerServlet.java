package com.template.web.servlet;

// TODO: Auto-generated Javadoc

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 에러 핸들링을 하기 위한 {@link ErrorHandlerServlet} 추상 구현체. <br>
 * {@link ErrorHandlerServlet}의 에러 로그 출력하기 위한 메소드만 구현되어 있다.
 */
public abstract class DefaultErrorHandlerServlet extends ErrorHandlerServlet {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 9197448805710753594L;

	/** The log. */
	private static Log log = LogFactory.getLog(DefaultErrorHandlerServlet.class);

	/**
	 * Log error.
	 *
	 * @param request
	 *            HttpServletRequest
	 * @param response
	 *            HttpServletResponse {@link HttpServletRequest} 정보로부터 로그 메시지를 생성한 후
	 *            출력한다.
	 */
	@Override
	protected void logError(HttpServletRequest request, HttpServletResponse response) {

		Throwable exception = getThrowable(request);
		String requestUri = getRequestUri(request);
		Integer statusCode = getStatusCode(request);
		String queryString = request.getQueryString();

		String logMessage = statusCode + "[URI]" + requestUri + "?" + queryString + "[IP]" + request.getRemoteAddr()
				+ "[Referer]" + request.getHeader("Referer") + "[Agent]" + request.getHeader("UserController-Agent");

		if (new Integer(HttpServletResponse.SC_NOT_FOUND).equals(statusCode)) {
			log.warn(logMessage, exception);
		} else if (new Integer(HttpServletResponse.SC_BAD_REQUEST).equals(statusCode)) {
			log.warn(logMessage, exception);
		} else {
			log.error(logMessage, exception);
		}
	}
}
