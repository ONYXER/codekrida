package com.codekrida.backend.services;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.UnknownHostException;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    public void send(String to, String otp, String name){
        String text = buildMessage(otp,name);
        String subject = "One Time Password Verification";
        SimpleMailMessage message = new SimpleMailMessage();

               message.setFrom("computerkrida@gmail.com");
               message.setTo(to);
               message.setSubject(subject);
               message.setText(text);
               mailSender.send(message);

    }
    private String buildMessage(String otp,String name) {
        return "Dear "+name+",\n\n"
                +"Your One Time Password (OTP) is: "+otp+"\n\n"+
                "This OTP is valid for the 10 minutes. Please do not share it with anyone,\n\n"
                +"Thank you,\n"
                +"CodeKrida";
    }
}
