package com.passport.automation.config;

import com.passport.automation.entity.Role;
import com.passport.automation.entity.User;
import com.passport.automation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the default STATUS_CHANGER account on first start-up (credentials come from application.properties). */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String name;
    private final String email;
    private final String password;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           @Value("${app.seed.status-changer.name}") String name,
                           @Value("${app.seed.status-changer.email}") String email,
                           @Value("${app.seed.status-changer.password}") String password) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.name = name;
        this.email = email.toLowerCase();
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User u = new User();
        u.setFullName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole(Role.STATUS_CHANGER);
        userRepository.save(u);
        log.info("Default STATUS_CHANGER created: {}", email);
    }
}
