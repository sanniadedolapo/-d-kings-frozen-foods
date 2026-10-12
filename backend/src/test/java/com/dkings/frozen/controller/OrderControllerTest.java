package com.dkings.frozen.controller;

import com.dkings.frozen.model.Product;
import com.dkings.frozen.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void testCreateOrderSuccess() throws Exception {
        Product product = productRepository.findAll().get(0);

        String json = """
            {
                "customerName": "Chinelo Okonjo",
                "customerEmail": "chinelo@example.com",
                "customerPhone": "+2348012345678",
                "deliveryAddress": "Plot 5, Victoria Island",
                "deliveryCity": "Lagos",
                "notes": "Handle with ice packs",
                "paymentMethod": "WHATSAPP",
                "items": [
                    {
                        "productId": %d,
                        "quantity": 2
                    }
                ]
            }
        """.formatted(product.getId());

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value(startsWith("DK-2026-")))
                .andExpect(jsonPath("$.data.customerName").value("Chinelo Okonjo"))
                .andExpect(jsonPath("$.data.whatsappShareUrl").exists());
    }

    @Test
    void testCreateOrderValidationError() throws Exception {
        String invalidJson = """
            {
                "customerName": "",
                "customerEmail": "not-an-email",
                "items": []
            }
        """;

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
