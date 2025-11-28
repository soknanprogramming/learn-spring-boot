package com.example.cude;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController()
@RequestMapping("/hello-world")
public class HelloWorld {
    @RequestMapping("/")
    public String Hello() {
        return "Hello World!";
    }

}
