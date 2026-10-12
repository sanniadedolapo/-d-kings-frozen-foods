package com.dkings.frozen.repository;

import com.dkings.frozen.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    List<Product> findByAvailableTrue();

    List<Product> findByFeaturedTrueAndAvailableTrue();

    List<Product> findByCategorySlugAndAvailableTrue(String slug);

    @Query("SELECT p FROM Product p WHERE p.available = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE p.available = true AND p.category.slug = :slug AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProductsByCategory(@Param("slug") String slug, @Param("query") String query);

    long countByStockQuantityLessThanEqual(int threshold);

    List<Product> findByStockQuantityLessThanEqual(int threshold);
}
