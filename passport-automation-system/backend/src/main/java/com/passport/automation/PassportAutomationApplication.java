package com.passport.automation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PassportAutomationApplication {
    public static void main(String[] args) {
        SpringApplication.run(PassportAutomationApplication.class, args);
    }
}
