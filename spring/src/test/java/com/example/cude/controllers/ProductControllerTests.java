package com.example.cude.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.example.cude.models.Product;
import com.example.cude.servers.ProductServer;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductServer server;

    @Test
    void getAllProductsReturnsEmptyArrayWhenNoProductsExist() throws Exception {
        when(server.getAllProducts()).thenReturn(List.of());

        mockMvc.perform(get("/api/products/").with(user("tester")))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getProductByIdReturnsNotFoundWhenMissing() throws Exception {
        when(server.getProductById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/99").with(user("tester")))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateProductReturnsNotFoundPayloadWhenServiceThrows() throws Exception {
        when(server.updateProduct(org.mockito.ArgumentMatchers.eq(99), org.mockito.ArgumentMatchers.any(Product.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        mockMvc.perform(put("/api/products/99")
                        .with(user("tester"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Desk",
                                  "price": 120,
                                  "quantity": 3,
                                  "description": "Office"
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found"));
    }
}
