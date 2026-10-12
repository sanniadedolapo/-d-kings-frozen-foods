package com.dkings.frozen.service;

import com.dkings.frozen.dto.OrderItemRequest;
import com.dkings.frozen.dto.OrderRequest;
import com.dkings.frozen.dto.OrderResponse;
import com.dkings.frozen.dto.OrderStatusUpdateRequest;
import com.dkings.frozen.exception.BadRequestException;
import com.dkings.frozen.exception.ResourceNotFoundException;
import com.dkings.frozen.model.*;
import com.dkings.frozen.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final SecureRandom random = new SecureRandom();

    @Value("${app.store.whatsapp-number:+2348000000000}")
    private String businessWhatsApp;

    @Value("${app.store.delivery-fee:1500.00}")
    private BigDecimal configuredDeliveryFee;

    public OrderService(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("An order must contain at least one item");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerEmail(request.getCustomerEmail().trim());
        order.setCustomerPhone(request.getCustomerPhone().trim());
        order.setDeliveryAddress(request.getDeliveryAddress().trim());
        order.setDeliveryCity(request.getDeliveryCity().trim());
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.findEntityById(itemReq.getProductId());

            if (!Boolean.TRUE.equals(product.getAvailable())) {
                throw new BadRequestException("Product is currently unavailable: " + product.getName());
            }

            // Deduct stock safely
            productService.deductStock(product, itemReq.getQuantity());

            BigDecimal lineSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(lineSubtotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    product.getPrice(),
                    itemReq.getQuantity(),
                    lineSubtotal
            );
            order.addItem(orderItem);
        }

        order.setSubtotal(subtotal);
        order.setDeliveryFee(configuredDeliveryFee != null ? configuredDeliveryFee : new BigDecimal("1500.00"));
        order.setTotalAmount(order.getSubtotal().add(order.getDeliveryFee()));

        Order saved = orderRepository.save(order);
        return new OrderResponse(saved, businessWhatsApp);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return new OrderResponse(order, businessWhatsApp);
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByOrderStatusOrderByCreatedAtDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream()
                .map(o -> new OrderResponse(o, businessWhatsApp))
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(request.getOrderStatus());
        }
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        return new OrderResponse(orderRepository.save(order), businessWhatsApp);
    }

    @Transactional
    public OrderResponse verifyPayment(String orderNumber, String reference) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        order.setPaymentReference(reference);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED);

        return new OrderResponse(orderRepository.save(order), businessWhatsApp);
    }

    private String generateOrderNumber() {
        int rand = 10000 + random.nextInt(90000);
        return "DK-2026-" + rand;
    }
}
