package com.example.cude.servers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cude.models.Users;
import com.example.cude.repos.UserRepo;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String registerUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        Users result = userRepo.save(user);
        if (result == null) {
            return "User registration failed";
        }
        return "User registered successfully";
    }

}
