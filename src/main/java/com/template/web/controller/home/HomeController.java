package com.template.web.controller.home;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);


	/**
	 * 메인 페이지 /main/index.jsp 호출
	 * @param model
	 * @return
	 */
	@RequestMapping("/")
	public String Home(Model model) {

		return "main/";
	}


}
