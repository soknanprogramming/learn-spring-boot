package com.example.cude.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.cude.models.Users;
import com.example.cude.servers.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController()
public class UserController {

    @Autowired
    UserService service;

    @PostMapping("/register")
    public String registerNewUser(@RequestBody Users users) {
        return service.registerUser(users);
    }

}
