package com.example.cude.servers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.cude.models.UserPrincipal;
import com.example.cude.models.Users;
import com.example.cude.repos.UserRepo;

@Service
public class MyUserDetailsService implements UserDetailsService{
    
    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userRepo.findByUsername(username);
        if(users == null){
            throw new UsernameNotFoundException("User not found");
        }

        return new UserPrincipal(users);
    }

}
