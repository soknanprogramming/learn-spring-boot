package com.example.cude.servers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.cude.models.Product;
import com.example.cude.repos.ProductRepo;

@ExtendWith(MockitoExtension.class)
class ProductServerTests {

    @Mock
    private ProductRepo repo;

    @InjectMocks
    private ProductServer server;

    @Test
    void updateProductThrowsNotFoundWhenIdDoesNotExist() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> server.updateProduct(99, new Product()));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertEquals("Product not found", ex.getReason());
    }

    @Test
    void updateProductPersistsNewValues() {
        Product existing = new Product(1L, "Old", 10, 2, "Before");
        Product incoming = new Product(null, "New", 15, 4, "After");
        when(repo.findById(1)).thenReturn(Optional.of(existing));
        when(repo.save(existing)).thenReturn(existing);

        Product updated = server.updateProduct(1, incoming);

        assertEquals("New", updated.getName());
        assertEquals(15, updated.getPrice());
        assertEquals(4, updated.getQuantity());
        assertEquals("After", updated.getDescription());
        verify(repo).save(existing);
    }
}
