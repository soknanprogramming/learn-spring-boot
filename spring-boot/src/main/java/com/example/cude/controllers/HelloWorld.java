package com.example.cude.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController("")
public class HelloWorld {
    @GetMapping("/")
    public String getMethodName() {

        return "Hello World!";
    }
    
}
