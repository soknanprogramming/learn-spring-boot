package com.example.cude.servers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String registerUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        Users result = userRepo.save(user);
        if (result == null) {
            return "User registration failed";
        }
        return "User registered successfully";
    }

    public String verify(Users user){
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()){
            return jwtUtil.generateToken(user.getUsername());
        } else {
            return "Invalid username or password";
        }
    }

}
