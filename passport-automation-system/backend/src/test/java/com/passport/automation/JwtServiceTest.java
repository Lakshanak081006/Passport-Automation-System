package com.passport.automation;

import com.passport.automation.security.JwtService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwt = new JwtService("unit-test-secret-key-with-at-least-32-characters", 60_000);

    @Test
    void generatesAndParsesToken() {
        String token = jwt.generateToken("a@b.com", "APPLICANT");
        assertTrue(jwt.isValid(token));
        assertEquals("a@b.com", jwt.extractEmail(token));
        assertEquals("APPLICANT", jwt.parse(token).get("role"));
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwt.generateToken("a@b.com", "APPLICANT");
        String tampered = token.substring(0, token.length() - 4) + "XXXX";
        assertFalse(jwt.isValid(tampered));
        assertFalse(jwt.isValid("not-a-token"));
    }
}
