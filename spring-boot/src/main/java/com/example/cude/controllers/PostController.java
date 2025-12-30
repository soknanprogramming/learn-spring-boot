package com.example.cude.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cude.dto.PostReqDTO;
import com.example.cude.dto.PostResDTO;
import com.example.cude.models.Post;
import com.example.cude.servers.PostServer;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("api/post")
@CrossOrigin()
public class PostController {

    @Autowired
    PostServer server;

    @GetMapping("/")
    public ResponseEntity<List<PostResDTO>> getAllPost(){
        List<Post> posts = server.getPost();
        if(posts.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        List<PostResDTO> postsDTO = posts.stream()
                .map(post -> server.toDTO(post))
                .toList();

        return ResponseEntity.ok(postsDTO);
    }

    @PostMapping("/")
    public ResponseEntity<?> createPost(@ModelAttribute PostReqDTO postReqDTO) {
        // System.out.println("You are request at /api/posts/");
        try {
            Post newPost = server.createPost(postReqDTO);
            PostResDTO dto = server.toDTO(newPost);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping("/{postId}/image")
    public ResponseEntity<byte[]> getImageByPostId(@PathVariable int postId) {
        Post post = server.getPostById(postId);

        byte[] imageData = post.getImage_data();
        if (imageData == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(post.getImage_type())).body(imageData);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResDTO> getPostById(@PathVariable int postId) {
        Post post = server.getPostById(postId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        PostResDTO dto = server.toDTO(post);
        return ResponseEntity.ok(dto);
    }
    
    @PutMapping("/{PostId}")
    public ResponseEntity<?> updatePost(@PathVariable int PostId, @ModelAttribute PostReqDTO postReqDTO) {
        
        Post updatedPost;
        try {
            updatedPost = server.updatePost(PostId, postReqDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating post: " + e.getMessage());
        }

        if (updatedPost == null) {
            return ResponseEntity.notFound().build();
        }

        PostResDTO dto = server.toDTO(updatedPost);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{PostId}")
    public ResponseEntity<?> deletePost(@PathVariable int PostId){
        boolean result = server.deletePostById(PostId);
        if(!result){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found!");
        } else {
            return ResponseEntity.ok("Post deleted successfully.");
        }
    }
}
