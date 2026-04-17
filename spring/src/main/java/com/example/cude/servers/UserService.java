package com.example.cude.servers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.cude.dto.AuthResponse;
import com.example.cude.models.Users;
import com.example.cude.repos.UserRepo;
import com.example.cude.utils.JwtUtil;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    BCryptPasswordEncoder encoder;

    public AuthResponse registerUser(Users user) {
        if (userRepo.findByUsername(user.getUsername()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return new AuthResponse("User registered successfully", null);
    }

    public AuthResponse verify(Users user){
        Authentication authentication;
        try {
            authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid username or password", ex);
        }
        if (authentication.isAuthenticated()){
            return new AuthResponse("Login successful", jwtUtil.generateToken(user.getUsername()));
        }
        throw new BadCredentialsException("Invalid username or password");
    }

}
