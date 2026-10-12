package com.dkings.frozen.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {

    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long processingOrders;
    private long deliveredOrders;
    private long totalProducts;
    private long lowStockProducts;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalOrders, BigDecimal totalRevenue, long pendingOrders,
                             long processingOrders, long deliveredOrders, long totalProducts,
                             long lowStockProducts) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.processingOrders = processingOrders;
        this.deliveredOrders = deliveredOrders;
        this.totalProducts = totalProducts;
        this.lowStockProducts = lowStockProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getProcessingOrders() {
        return processingOrders;
    }

    public void setProcessingOrders(long processingOrders) {
        this.processingOrders = processingOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }
}
