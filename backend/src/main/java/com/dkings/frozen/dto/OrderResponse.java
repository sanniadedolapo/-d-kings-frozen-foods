package com.dkings.frozen.dto;

import com.dkings.frozen.model.Order;
import com.dkings.frozen.model.OrderStatus;
import com.dkings.frozen.model.PaymentMethod;
import com.dkings.frozen.model.PaymentStatus;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;
    private String deliveryCity;
    private String notes;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String paymentReference;
    private List<OrderItemResponse> items = new ArrayList<>();
    private Instant createdAt;
    private String whatsappShareUrl;

    public OrderResponse() {
    }

    public OrderResponse(Order order, String businessWhatsApp) {
        this.id = order.getId();
        this.orderNumber = order.getOrderNumber();
        this.customerName = order.getCustomerName();
        this.customerEmail = order.getCustomerEmail();
        this.customerPhone = order.getCustomerPhone();
        this.deliveryAddress = order.getDeliveryAddress();
        this.deliveryCity = order.getDeliveryCity();
        this.notes = order.getNotes();
        this.subtotal = order.getSubtotal();
        this.deliveryFee = order.getDeliveryFee();
        this.totalAmount = order.getTotalAmount();
        this.paymentMethod = order.getPaymentMethod();
        this.paymentStatus = order.getPaymentStatus();
        this.orderStatus = order.getOrderStatus();
        this.paymentReference = order.getPaymentReference();
        if (order.getItems() != null) {
            this.items = order.getItems().stream()
                    .map(OrderItemResponse::new)
                    .collect(Collectors.toList());
        }
        this.createdAt = order.getCreatedAt();
        this.whatsappShareUrl = generateWhatsAppUrl(order, businessWhatsApp);
    }

    private String generateWhatsAppUrl(Order order, String phone) {
        if (phone == null || phone.isBlank()) {
            phone = "2348000000000";
        }
        String cleanPhone = phone.replaceAll("[^0-9]", "");

        StringBuilder msg = new StringBuilder();
        msg.append("🧊 *D KINGS FROZEN FOODS - NEW ORDER*\n");
        msg.append("-----------------------------\n");
        msg.append("📦 *Order Number:* ").append(order.getOrderNumber()).append("\n");
        msg.append("👤 *Customer:* ").append(order.getCustomerName()).append("\n");
        msg.append("📞 *Phone:* ").append(order.getCustomerPhone()).append("\n");
        msg.append("📍 *Delivery To:* ").append(order.getDeliveryAddress()).append(", ").append(order.getDeliveryCity()).append("\n");
        if (order.getNotes() != null && !order.getNotes().isBlank()) {
            msg.append("📝 *Notes:* ").append(order.getNotes()).append("\n");
        }
        msg.append("💳 *Payment:* ").append(order.getPaymentMethod()).append(" (").append(order.getPaymentStatus()).append(")\n");
        msg.append("\n🛒 *ORDER ITEMS:*\n");
        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                msg.append("• ").append(item.getQuantity()).append("x ")
                   .append(item.getProductName())
                   .append(" - ₦").append(String.format("%,.2f", item.getSubtotal())).append("\n");
            }
        }
        msg.append("-----------------------------\n");
        msg.append("Subtotal: ₦").append(String.format("%,.2f", order.getSubtotal())).append("\n");
        msg.append("Delivery: ₦").append(String.format("%,.2f", order.getDeliveryFee())).append("\n");
        msg.append("💰 *TOTAL: ₦").append(String.format("%,.2f", order.getTotalAmount())).append("*\n");
        msg.append("\nPlease confirm my order. Thank you!");

        String encoded = URLEncoder.encode(msg.toString(), StandardCharsets.UTF_8);
        return "https://wa.me/" + cleanPhone + "?text=" + encoded;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryCity() {
        return deliveryCity;
    }

    public void setDeliveryCity(String deliveryCity) {
        this.deliveryCity = deliveryCity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getWhatsappShareUrl() {
        return whatsappShareUrl;
    }

    public void setWhatsappShareUrl(String whatsappShareUrl) {
        this.whatsappShareUrl = whatsappShareUrl;
    }
}
