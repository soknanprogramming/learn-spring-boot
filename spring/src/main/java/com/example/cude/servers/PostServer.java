package com.example.cude.servers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.cude.dto.PostReqDTO;
import com.example.cude.dto.PostResDTO;
import com.example.cude.models.Post;
import com.example.cude.repos.PostRepo;

@Service
public class PostServer {

    public PostResDTO toDTO(Post post){
        PostResDTO dto = new PostResDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImageUrl("/api/post/"+post.getId()+"/image");
        return dto;
    }

    @Autowired
    PostRepo repo;

    public List<Post> getPost(){
        return repo.findAll();
    }

    public Post createPost(PostReqDTO postReqDTO) throws IOException {
        Post post = new Post();
        post.setImage_name(postReqDTO.getImage().getOriginalFilename());
        post.setImage_type(postReqDTO.getImage().getContentType());
        post.setImage_data(postReqDTO.getImage().getBytes());
        post.setTitle(postReqDTO.getTitle());
        post.setContent(postReqDTO.getContent());
        
        return repo.save(post);
    }

    public Post getPostById(int id){
        try {
            return repo.findById(id).get();
        } catch (Exception e) {
            return null;
        }
    }

    public Post updatePost(int postId, PostReqDTO postReqDTO) throws IOException {
        Post post = repo.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        post.setTitle(postReqDTO.getTitle());
        post.setContent(postReqDTO.getContent());
        if(postReqDTO.getImage() != null){
            post.setImage_name(postReqDTO.getImage().getOriginalFilename());
            post.setImage_type(postReqDTO.getImage().getContentType());
            post.setImage_data(postReqDTO.getImage().getBytes());
        }

        return repo.save(post);
    }

    public boolean deletePostById(int postId){
        var post = repo.findById(postId);
        if(post.isEmpty()){
            return false;
        }else{
            repo.deleteById(postId);
            return true;
        }
    }

}
