package com.example.cude.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.cude.dto.PostReqDTO;
import com.example.cude.dto.PostResDTO;
import com.example.cude.models.Post;
import com.example.cude.servers.PostServer;

@SpringBootTest
@AutoConfigureMockMvc
class PostControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PostServer server;

    @Test
    void getAllPostReturnsEmptyArrayWhenNoPostsExist() throws Exception {
        when(server.getPost()).thenReturn(List.of());

        mockMvc.perform(get("/api/post/").with(user("tester")))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getPostByIdReturnsNotFoundWhenMissing() throws Exception {
        when(server.getPostById(7)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/post/7").with(user("tester")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Post not found"));
    }

    @Test
    void getImageByPostIdReturnsNotFoundWhenMissing() throws Exception {
        when(server.getPostById(7)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/post/7/image").with(user("tester")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Post not found"));
    }

    @Test
    void createPostReturnsDto() throws Exception {
        Post post = new Post(3L, "Title", "Body", "img.png", "image/png", new byte[] { 1, 2 });
        PostResDTO dto = new PostResDTO();
        dto.setId(3L);
        dto.setTitle("Title");
        dto.setContent("Body");
        dto.setImageUrl("/api/post/3/image");
        when(server.createPost(org.mockito.ArgumentMatchers.any(PostReqDTO.class))).thenReturn(post);
        when(server.toDTO(post)).thenReturn(dto);

        MockMultipartFile image = new MockMultipartFile("image", "img.png", "image/png", new byte[] { 1, 2 });

        mockMvc.perform(multipart("/api/post/")
                        .file(image)
                        .param("title", "Title")
                        .param("content", "Body")
                        .with(user("tester")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.imageUrl").value("/api/post/3/image"));
    }

    @Test
    void updatePostReturnsDto() throws Exception {
        Post post = new Post(3L, "Title", "Body", "img.png", "image/png", new byte[] { 1, 2 });
        PostResDTO dto = new PostResDTO();
        dto.setId(3L);
        dto.setTitle("Title");
        dto.setContent("Body");
        dto.setImageUrl("/api/post/3/image");
        when(server.updatePost(org.mockito.ArgumentMatchers.eq(3), org.mockito.ArgumentMatchers.any(PostReqDTO.class))).thenReturn(post);
        when(server.toDTO(post)).thenReturn(dto);

        MockMultipartFile image = new MockMultipartFile("image", "img.png", "image/png", new byte[] { 1, 2 });

        mockMvc.perform(multipart("/api/post/3")
                        .file(image)
                        .param("title", "Title")
                        .param("content", "Body")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .with(user("tester")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.imageUrl").value("/api/post/3/image"));
    }

    @Test
    void deletePostReturnsNotFoundWhenMissing() throws Exception {
        when(server.deletePostById(5)).thenReturn(false);

        mockMvc.perform(delete("/api/post/5").with(user("tester")))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Post not found!"));
    }
}
