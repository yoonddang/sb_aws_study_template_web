package com.template.web.configuration;

import com.template.web.servlet.TemplateErrorHandlerServlet;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ErrorConfiguration extends ServerProperties {

    @Bean
    public ServletRegistrationBean dispatcherRegistration() {

        ServletRegistrationBean registration = new ServletRegistrationBean(
                new TemplateErrorHandlerServlet(),    "/servlet/errorHandler");
        return registration;
    }

    @Override
    public void customize(ConfigurableEmbeddedServletContainer container)
    {
        super.customize(container);
        container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage(HttpStatus.NOT_IMPLEMENTED, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage(HttpStatus.SERVICE_UNAVAILABLE, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage(HttpStatus.METHOD_NOT_ALLOWED, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage(HttpStatus.BAD_REQUEST, "/servlet/errorHandler"));
        container.addErrorPages(new ErrorPage("/servlet/errorHandler"));
    }
}
