package com.example.cude.servers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.cude.repos.ProductRepo;
import com.example.cude.models.Product;

@Service
public class ProductServer {
    @Autowired
    ProductRepo repo;

    public List<Product> getAllProducts() {
        return repo.findAll();

    }

    public Product addProduct(Product product) {
        return repo.save(product);
    }

    public Optional<Product> getProductById(int id) {
        return repo.findById(id);
    }

    public Product updateProduct(int productId, Product newProduct){
        Product product = repo.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setName(newProduct.getName());
        product.setPrice(newProduct.getPrice());
        product.setQuantity(newProduct.getQuantity());
        product.setDescription(newProduct.getDescription());
        return repo.save(product);
    }

    public boolean deleteProduct(int productId){
        var product = repo.findById(productId);
        if(product.isEmpty()){
            return false;
        }else{
            repo.deleteById(productId);
            return true;
        }
    }

    public List<Product> searchProducts(String keyword) {
        // System.out.println(keyword);
        return repo.searchProducts(keyword);
    }

}
