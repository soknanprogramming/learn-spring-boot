package com.example.cude;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("")
public class HelloWorld {
    @GetMapping("/hello_world")
    public String helloWorld() {
        return "Hello World";
    }

}
