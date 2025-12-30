package com.example.cude.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.cude.models.Users;
import com.example.cude.servers.UserService;

@RestController()
public class UserController {

    @Autowired
    UserService service;

    @PostMapping("/register")
    public String registerNewUser(@RequestBody Users users) {
        return service.registerUser(users);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users users){
        return service.verify(users);
    }

}
