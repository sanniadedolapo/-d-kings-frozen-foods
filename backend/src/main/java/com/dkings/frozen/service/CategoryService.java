package com.dkings.frozen.service;

import com.dkings.frozen.dto.CategoryDto;
import com.dkings.frozen.exception.ResourceNotFoundException;
import com.dkings.frozen.model.Category;
import com.dkings.frozen.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        String slug = dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        Category category = new Category(dto.getName(), slug, dto.getDescription(), dto.getIcon(), dto.getDisplayOrder());
        return new CategoryDto(categoryRepository.save(category));
    }
}
