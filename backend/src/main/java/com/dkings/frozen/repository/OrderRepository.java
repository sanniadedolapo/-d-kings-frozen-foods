package com.dkings.frozen.repository;

import com.dkings.frozen.model.Order;
import com.dkings.frozen.model.OrderStatus;
import com.dkings.frozen.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status);

    List<Order> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);

    long countByOrderStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = :status")
    BigDecimal sumTotalRevenueByPaymentStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus <> 'CANCELLED'")
    BigDecimal sumTotalActiveRevenue();
}
