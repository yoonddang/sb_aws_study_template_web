package com.template.web.configuration;

import com.template.web.interceptor.LoginCheckInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
public class WebConfiguration extends WebMvcConfigurerAdapter {

	@Autowired
	private LoginCheckInterceptor loginCheckInterceptor;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
		registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/js/");
		registry.addResourceHandler("/css/**").addResourceLocations("/WEB-INF/css/");
		registry.addResourceHandler("/scss/**").addResourceLocations("/WEB-INF/scss/");
		registry.addResourceHandler("/font/**").addResourceLocations("/WEB-INF/css/font/");
		registry.addResourceHandler("/tui/**").addResourceLocations("/WEB-INF/css/tui/");
		//registry.addResourceHandler("/img/**").addResourceLocations("https://s3.ap-northeast-2.amazonaws.com.template.esource/");
		registry.addResourceHandler("/img/**").addResourceLocations("https://s3.ap-northeast-2.amazonaws.com.template.esource/pc/images/");
		registry.addResourceHandler("/fonts/**").addResourceLocations("https://s3.ap-northeast-2.amazonaws.com.template.esource/pc/fonts/");

		registry.addResourceHandler("/image/**").addResourceLocations("https://s3.ap-northeast-2.amazonaws.com.template.esource/");
		registry.addResourceHandler("/images/**").addResourceLocations("/WEB-INF/css/images/");
		registry.addResourceHandler("/favicon.ico").addResourceLocations("/favicon.ico");


		registry.addResourceHandler("/promo/**").addResourceLocations("https://s3.ap-northeast-2.amazonaws.com.template.esource/promotion/");
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		registry.addInterceptor(loginCheckInterceptor);
	}
}