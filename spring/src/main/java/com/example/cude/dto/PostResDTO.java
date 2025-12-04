package com.example.cude.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PostResDTO {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
}
