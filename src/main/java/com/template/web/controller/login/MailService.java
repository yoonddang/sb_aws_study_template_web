package com.template.web.controller.login;

import com.template.common.model.common.Code;
import com.template.common.model.common.ResultInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Component
@PropertySource("classpath:application.properties")
public class MailService {
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    JavaMailSender javaMailSender;

    @Value("$.template.mail.smtp.mail}")
    String from;

    public ResultInfo sendMail(String to, String subject, String content)
    {
        MimeMessagePreparator preparator = new MimeMessagePreparator()
        {
            public void prepare(MimeMessage mimeMessage) throws Exception
            {
                mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
                mimeMessage.setFrom(new InternetAddress(from));
                mimeMessage.setSubject(subject);
                mimeMessage.setText(content, "utf-8", "html");
            }
        };

        ResultInfo resultInfo = new ResultInfo();

        try {
            javaMailSender.send(preparator);
            resultInfo.setCode(Code.SUCCESS);
            logger.info("emailSend...end");
            resultInfo.setMessage("이메일을 발송하였습니다.");
            //return body;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            resultInfo.setCode(Code.FAIL);
            resultInfo.setMessage("이메일 발송에 실패하였습니다.");
            //return body;
        } finally {
            logger.info("emailSend...end2");
            return resultInfo;
        }
    }

}