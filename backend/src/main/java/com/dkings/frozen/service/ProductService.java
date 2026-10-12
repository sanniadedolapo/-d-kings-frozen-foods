package com.dkings.frozen.service;

import com.dkings.frozen.dto.ProductDto;
import com.dkings.frozen.exception.BadRequestException;
import com.dkings.frozen.exception.ResourceNotFoundException;
import com.dkings.frozen.model.Category;
import com.dkings.frozen.model.Product;
import com.dkings.frozen.repository.CategoryRepository;
import com.dkings.frozen.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductDto> getProducts(String categorySlug, String search, Boolean featured) {
        List<Product> products;

        if (featured != null && featured) {
            products = productRepository.findByFeaturedTrueAndAvailableTrue();
        } else if (categorySlug != null && !categorySlug.isBlank() && search != null && !search.isBlank()) {
            products = productRepository.searchProductsByCategory(categorySlug, search.trim());
        } else if (categorySlug != null && !categorySlug.isBlank()) {
            products = productRepository.findByCategorySlugAndAvailableTrue(categorySlug);
        } else if (search != null && !search.isBlank()) {
            products = productRepository.searchProducts(search.trim());
        } else {
            products = productRepository.findByAvailableTrue();
        }

        return products.stream().map(ProductDto::new).collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = findEntityById(id);
        return new ProductDto(product);
    }

    public Product findEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));
        } else if (dto.getCategorySlug() != null) {
            category = categoryRepository.findBySlug(dto.getCategorySlug())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + dto.getCategorySlug()));
        }

        String sku = dto.getSku();
        if (sku == null || sku.isBlank()) {
            sku = "DK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Product product = new Product(
                sku,
                dto.getName(),
                dto.getDescription(),
                dto.getUnit(),
                dto.getPrice(),
                dto.getStockQuantity(),
                dto.getEmoji() != null ? dto.getEmoji() : "🧊",
                dto.getFeatured() != null ? dto.getFeatured() : false,
                dto.getAvailable() != null ? dto.getAvailable() : true,
                category
        );
        product.setImageUrl(dto.getImageUrl());

        return new ProductDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = findEntityById(id);

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getUnit() != null) product.setUnit(dto.getUnit());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());
        if (dto.getEmoji() != null) product.setEmoji(dto.getEmoji());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getFeatured() != null) product.setFeatured(dto.getFeatured());
        if (dto.getAvailable() != null) product.setAvailable(dto.getAvailable());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        return new ProductDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findEntityById(id);
        productRepository.delete(product);
    }

    @Transactional
    public void deductStock(Product product, int quantity) {
        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName() +
                    ". Available: " + product.getStockQuantity() + ", Requested: " + quantity);
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
    }
}
