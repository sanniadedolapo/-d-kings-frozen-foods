package com.dkings.frozen.service;

import com.dkings.frozen.dto.DashboardStatsDto;
import com.dkings.frozen.model.OrderStatus;
import com.dkings.frozen.repository.OrderRepository;
import com.dkings.frozen.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalActiveRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long processingOrders = orderRepository.countByOrderStatus(OrderStatus.PROCESSING);
        long deliveredOrders = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);

        long totalProducts = productRepository.count();
        long lowStockProducts = productRepository.countByStockQuantityLessThanEqual(5);

        return new DashboardStatsDto(
                totalOrders,
                totalRevenue,
                pendingOrders,
                processingOrders,
                deliveredOrders,
                totalProducts,
                lowStockProducts
        );
    }
}
