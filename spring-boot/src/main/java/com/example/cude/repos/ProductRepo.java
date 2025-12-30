package com.example.cude.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.cude.models.Product;;;

public interface ProductRepo extends JpaRepository<Product, Integer> {
    @Query("""
            SELECT p FROM Product p 
            WHERE 
                LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR CAST(p.price AS STRING) LIKE CONCAT('%', :keyword, '%')
                OR CAST(p.quantity AS STRING) LIKE CONCAT('%', :keyword, '%')
            """)
    List<Product> searchProducts(@Param("keyword") String keyword);
}