package com.example.cude.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.cude.dto.AuthResponse;
import com.example.cude.servers.ProductServer;
import com.example.cude.servers.UserService;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private ProductServer productServer;

    @Test
    void registerReturnsCreatedResponse() throws Exception {
        when(userService.registerUser(org.mockito.ArgumentMatchers.any())).thenReturn(new AuthResponse("User registered successfully", null));

        mockMvc.perform(post("/register")
                        .contentType("application/json")
                        .content("""
                                {
                                  "username": "alice",
                                  "password": "secret"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void loginReturnsTokenResponse() throws Exception {
        when(userService.verify(org.mockito.ArgumentMatchers.any())).thenReturn(new AuthResponse("Login successful", "jwt-token"));

        mockMvc.perform(post("/login")
                        .contentType("application/json")
                        .content("""
                                {
                                  "username": "alice",
                                  "password": "secret"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void loginReturnsUnauthorizedForBadCredentials() throws Exception {
        when(userService.verify(org.mockito.ArgumentMatchers.any())).thenThrow(new BadCredentialsException("Invalid username or password"));

        mockMvc.perform(post("/login")
                        .contentType("application/json")
                        .content("""
                                {
                                  "username": "alice",
                                  "password": "wrong"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    void protectedRouteRejectsAnonymousRequests() throws Exception {
        mockMvc.perform(get("/api/products/"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication is required to access this resource"));
    }
}
