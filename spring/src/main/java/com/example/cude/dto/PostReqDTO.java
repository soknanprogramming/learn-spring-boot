package com.example.cude.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PostReqDTO {
    private Long id;
    private String title;
    private String content;
    private MultipartFile image;
}
