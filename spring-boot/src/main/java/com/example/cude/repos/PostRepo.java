package com.example.cude.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cude.models.Post;

public interface PostRepo extends JpaRepository<Post, Integer>{
    
}
