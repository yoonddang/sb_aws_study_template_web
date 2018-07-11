package com.template.web.controller;

import com.template.common.bannedword.FilterText;
import com.template.common.configuration.properties.ProjectData;
import com.template.common.model.PingModel;
import com.template.common.reststub.ping.PingStubBO;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SampleController {

	private Logger logger = LoggerFactory.getLogger(SampleController.class);

	@Autowired
	private PingStubBO pingStubBO;

	@Autowired
	ProjectData projectData;

	@RequestMapping(value = "/ping", method = RequestMethod.GET)
	public String pingDB(Model model) {
		try {

			PingModel pingModel = new PingModel();
			pingModel.setSample("sample");

			if(logger.isDebugEnabled()) {
				logger.debug(ToStringBuilder.reflectionToString(pingModel, ToStringStyle.SHORT_PREFIX_STYLE));
			}

			PingModel as = pingStubBO.ping(pingModel);

			if(logger.isDebugEnabled()) {
				logger.debug(ToStringBuilder.reflectionToString(as, ToStringStyle.SHORT_PREFIX_STYLE));
			}

		} catch (Exception e) {
			logger.error("error in login.", e);
		}
		return "login/login";
	}

	@RequestMapping(value = "/wordTest", method = RequestMethod.GET)
	public String wordTest(Model model) {
		try {

			String asdq	=	FilterText.filterText(projectData.getBannedWord(),	"유저가 입력한 데이터 넣기");

			System.out.print(asdq);
		} catch (Exception e) {
			logger.error("error in login.", e);
		}
		return "login/login";
	}

}
