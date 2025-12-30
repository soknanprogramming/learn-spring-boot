package com.example.cude.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cude.models.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer>{
    Users findByUsername(String name);
}
