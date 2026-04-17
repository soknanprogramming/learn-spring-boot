package com.example.cude.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.cude.dto.AuthResponse;
import com.example.cude.models.Users;
import com.example.cude.servers.UserService;

@RestController()
public class UserController {

    @Autowired
    UserService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerNewUser(@RequestBody Users users) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registerUser(users));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Users users){
        return ResponseEntity.ok(service.verify(users));
    }

}
