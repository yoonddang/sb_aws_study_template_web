package com.template.web.servlet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 에러 핸들링을 하기 위한 {@link HttpServlet} 추상 구현체.
 *
 * @author Web Platform Development Team
 * @version $Rev: 10622 $, $Date: 2010-06-17 14:27:29 +0900 (2010-06-17, 목) $
 */
public abstract class ErrorHandlerServlet extends HttpServlet {

	/**
	 * The log.
	 */
	protected static Log log = LogFactory.getLog(ErrorHandlerServlet.class);

	/**
	 * 발생된 Exception 정보에 대한 로그 정보를 생성한 후 forward 시킨다.
	 *
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws ServletException ServletException
	 * @throws IOException      IOException
	 */
	@Override
	public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			before(request, response);
			logError(request, response);
			RequestDispatcher dispatcher = getRequestDispatcher(request, response);
			dispatcher.forward(request, response);
		} catch (Exception e) {
			log.fatal(e, e);
		}
	}

	/**
	 * 발생된 Exception 객체를 반환한다.
	 *
	 * @param request HttpServletRequest
	 * @return Throwable
	 */
	public Throwable getThrowable(HttpServletRequest request) {
		Throwable exception = (Throwable) request.getAttribute("javax.servlet.error.exception");
		return exception;
	}

	/**
	 * 발생된 Exception 종류를 반환한다.
	 *
	 * @param request HttpServletRequest
	 * @return Class
	 */
	public Class getExceptionType(HttpServletRequest request) {
		Class exceptionType = (Class) request.getAttribute("javax.servlet.error.exception_type");
		return exceptionType;
	}

	/**
	 * 발생된 Exception 코드를 반환한다.
	 *
	 * @param request HttpServletRequest
	 * @return Integer
	 */
	public Integer getStatusCode(HttpServletRequest request) {
		Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
		return statusCode;
	}

	/**
	 * Request URI 정보를 반환한다.
	 *
	 * @param request HttpServletRequest
	 * @return String
	 */
	public String getRequestUri(HttpServletRequest request) {
		String requestUri = (String) request.getAttribute("javax.servlet.error.request_uri");
		return requestUri;
	}

	// -- extends -------------------------------------------------------------

	/**
	 * 에러 핸들링을 수행하기 전에 해야하는 작업 수행.
	 *
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse
	 */
	protected void before(HttpServletRequest request, HttpServletResponse response) {
	}

	/**
	 * Log error.
	 *
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse {@link HttpServletRequest}의 정보를 활용해서 에러 메시지를
	 *                 출력한다. 일반적으로 {@link Log}를 통해 출력한다.
	 */
	protected abstract void logError(HttpServletRequest request, HttpServletResponse response);

	/**
	 * Gets the request dispatcher.
	 *
	 * @param request  HttpServletRequest
	 * @param response HttpServletResponse
	 * @return RequestDispatcher {@link RequestDispatcher}를 반환한다.
	 */
	protected abstract RequestDispatcher getRequestDispatcher(HttpServletRequest request, HttpServletResponse response);
}