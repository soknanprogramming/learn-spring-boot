package com.example.cude.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.cude.models.Post;
import com.example.cude.servers.PostServer;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("api/post")
@CrossOrigin()
public class PostController {

    @Autowired
    PostServer server;

    @GetMapping("/")
    public ResponseEntity<List<Post>> getAllPost(){
        List<Post> posts = server.getPost();
        if(posts.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/")
    public ResponseEntity<?> createPost(
            @RequestPart("post") Post post, 
            @RequestPart("image") MultipartFile image) {
        System.out.println("You are request at /api/posts/");
        try {
            Post newPost = server.createPost(post, image);
            return ResponseEntity.ok(newPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }
    
}
