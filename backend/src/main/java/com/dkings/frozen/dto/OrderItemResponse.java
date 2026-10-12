package com.dkings.frozen.dto;

import com.dkings.frozen.model.OrderItem;
import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productEmoji;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        if (item.getProduct() != null) {
            this.productId = item.getProduct().getId();
            this.productEmoji = item.getProduct().getEmoji();
        }
        this.productName = item.getProductName();
        this.unitPrice = item.getUnitPrice();
        this.quantity = item.getQuantity();
        this.subtotal = item.getSubtotal();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductEmoji() {
        return productEmoji;
    }

    public void setProductEmoji(String productEmoji) {
        this.productEmoji = productEmoji;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
