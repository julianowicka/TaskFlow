package com.taskflow.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendWelcomeEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to TaskFlow!");
            message.setText(
                "Hello " + name + ",\n\n" +
                "Welcome to TaskFlow! Your account has been successfully created.\n\n" +
                "You can now start organizing your tasks and projects.\n\n" +
                "Best regards,\n" +
                "The TaskFlow Team"
            );
            
            mailSender.send(message);
            System.out.println("Welcome email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to: " + to + " - " + e.getMessage());
        }
    }
    
    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset - TaskFlow");
            message.setText(
                "Hello " + name + ",\n\n" +
                "You requested a password reset for your TaskFlow account.\n\n" +
                "Reset token: " + resetToken + "\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The TaskFlow Team"
            );
            
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to: " + to + " - " + e.getMessage());
        }
    }
}

