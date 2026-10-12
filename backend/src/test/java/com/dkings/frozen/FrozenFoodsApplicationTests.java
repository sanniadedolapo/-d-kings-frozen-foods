package com.dkings.frozen;

import com.dkings.frozen.repository.CategoryRepository;
import com.dkings.frozen.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class FrozenFoodsApplicationTests {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void contextLoads() {
        assertTrue(categoryRepository.count() > 0, "Categories should be initialized");
        assertTrue(productRepository.count() > 0, "Products should be initialized");
    }
}
