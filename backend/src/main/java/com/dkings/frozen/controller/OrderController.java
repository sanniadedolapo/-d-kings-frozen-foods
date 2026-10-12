package com.dkings.frozen.controller;

import com.dkings.frozen.dto.*;
import com.dkings.frozen.model.OrderStatus;
import com.dkings.frozen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse created = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", created));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByNumber(orderNumber)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders(status)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }

    @PostMapping("/{orderNumber}/verify-payment")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPayment(
            @PathVariable String orderNumber,
            @Valid @RequestBody PaymentVerifyRequest request) {
        OrderResponse updated = orderService.verifyPayment(orderNumber, request.getReference());
        return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully", updated));
    }
}
