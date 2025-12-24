package com.example.cude.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController("api")
public class Teacher {
    @PostMapping("/teachers")
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        //TODO: process POST request
        
        return null;
    }
    
    
}
