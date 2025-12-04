package com.example.cude.servers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public Post createPost(Post post, MultipartFile image) throws IOException {
        post.setImage_name(image.getOriginalFilename());
        post.setImage_type(image.getContentType());
        post.setImage_data(image.getBytes());
        
        return repo.save(post);
    }

    public Post getPostById(int id){
        try {
            return repo.findById(id).get();
        } catch (Exception e) {
            return null;
        }
    }



}
