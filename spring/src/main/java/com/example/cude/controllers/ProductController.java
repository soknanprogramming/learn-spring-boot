package com.example.cude.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cude.models.Product;
import com.example.cude.servers.ProductServer;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/products")
@CrossOrigin()
public class ProductController {
    @Autowired
    ProductServer server;

    @GetMapping("/")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = server.getAllProducts();

        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }

        return ResponseEntity.status(HttpStatus.OK).body(products);
    }

    @PostMapping("/")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        System.out.println("User request post method");
        System.out.println(product);
        Product newProduct = server.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable int productId) {
        Product product = server.getProductById(productId);
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable int productId, @RequestBody Product newProduct) {
        var result = server.updateProduct(productId, newProduct);
        if ( result == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        }
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        var result = server.deleteProduct(productId);
        if(!result){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }else{
            return ResponseEntity.status(HttpStatus.OK).body("Product deleted");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> getMethodName(@RequestParam String keyword) {
        var result = server.searchProducts(keyword);
        if(result.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }else{
            return ResponseEntity.status(HttpStatus.OK).body(result);
        }
    }
    
    

}
