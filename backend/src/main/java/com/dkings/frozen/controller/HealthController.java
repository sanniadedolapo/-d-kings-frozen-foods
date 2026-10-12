package com.dkings.frozen.controller;

import com.dkings.frozen.repository.ProductRepository;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final ProductRepository productRepository;
    private final Environment environment;

    public HealthController(ProductRepository productRepository, Environment environment) {
        this.productRepository = productRepository;
        this.environment = environment;
    }

    @GetMapping
    public Map<String, Object> health() {
        long count = 0;
        boolean dbHealthy = true;
        try {
            count = productRepository.count();
        } catch (Exception e) {
            dbHealthy = false;
        }

        String[] activeProfiles = environment.getActiveProfiles();
        String profile = activeProfiles.length > 0 ? String.join(",", activeProfiles) : "default (h2)";

        return Map.of(
                "status", "UP",
                "service", "dkings-frozen-foods-api",
                "database", dbHealthy ? "CONNECTED" : "UNAVAILABLE",
                "activeProfile", profile,
                "productCatalogCount", count,
                "timestamp", Instant.now()
        );
    }
}
