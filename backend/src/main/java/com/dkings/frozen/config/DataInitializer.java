package com.dkings.frozen.config;

import com.dkings.frozen.model.*;
import com.dkings.frozen.repository.CategoryRepository;
import com.dkings.frozen.repository.OrderRepository;
import com.dkings.frozen.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           OrderRepository orderRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding D Kings Frozen Foods initial catalogue data...");

        Category chicken = categoryRepository.save(new Category("Chicken", "chicken", "Fresh, farm-raised frozen chicken cuts", "🍗", 1));
        Category turkey = categoryRepository.save(new Category("Turkey", "turkey", "Succulent imported and local turkey cuts", "🦃", 2));
        Category fish = categoryRepository.save(new Category("Fish", "fish", "Deep-sea caught and freshwater fish", "🐟", 3));
        Category seafood = categoryRepository.save(new Category("Seafood", "seafood", "Prawns, shrimps, squid and sea delicacies", "🦐", 4));
        Category beef = categoryRepository.save(new Category("Beef & Meat", "beef", "Prime beef cuts, goat meat, and sausages", "🥩", 5));
        Category snacks = categoryRepository.save(new Category("Snacks & Finger Foods", "snacks", "Ready-to-fry samosas, spring rolls and pastry snacks", "🥟", 6));

        List<Product> products = List.of(
                // Chicken
                new Product("DK-CHK-01", "Premium Hard Chicken (Orofo)", "Whole cut hard chicken, cleaned & blast frozen for rich stews and soups.", "1.4kg whole", new BigDecimal("7500.00"), 35, "🍗", true, true, chicken),
                new Product("DK-CHK-02", "Soft Chicken Wings", "Juicy, tender chicken wings perfect for roasting, grilling and pepper soup.", "1kg pack", new BigDecimal("8500.00"), 40, "🍗", true, true, chicken),
                new Product("DK-CHK-03", "Chicken Drumsticks", "Meaty, flavourful chicken drumsticks ready for frying or saucing.", "1kg pack", new BigDecimal("8200.00"), 25, "🍗", false, true, chicken),

                // Turkey
                new Product("DK-TRK-01", "Premium Turkey Wings", "Extra meaty, jumbo turkey wings cleanly dressed and flash frozen.", "1kg pack", new BigDecimal("14500.00"), 20, "🦃", true, true, turkey),
                new Product("DK-TRK-02", "Turkey Gizzards", "Clean, fat-trimmed gizzards ideal for gizdodo, asun and mixed grills.", "1kg pack", new BigDecimal("9000.00"), 18, "🦃", false, true, turkey),

                // Fish
                new Product("DK-FSH-01", "Atlantic Mackerel (Titus)", "Grade-A large Atlantic mackerel, packed with natural omega-3 oils.", "Large size (3 pcs)", new BigDecimal("12000.00"), 30, "🐟", true, true, fish),
                new Product("DK-FSH-02", "Croaker Fish (White Croaker)", "Firm-fleshed, mild croaker, great for oven baking or grilling.", "1kg pack (2-3 pcs)", new BigDecimal("13500.00"), 15, "🐟", true, true, fish),
                new Product("DK-FSH-03", "Smoked Catfish", "Aromatic, sand-free oven-dried catfish for native soups and sauces.", "Pack of 4", new BigDecimal("6800.00"), 22, "🐟", false, true, fish),

                // Seafood
                new Product("DK-SEA-01", "Jumbo Tiger Prawns", "Wild-caught jumbo prawns, shell-on and deveined for pasta, fried rice or BBQ.", "800g pack", new BigDecimal("16000.00"), 12, "🦐", true, true, seafood),
                new Product("DK-SEA-02", "Calamari Squid Rings", "Tender cleaned calamari rings, ready for seafood stir-fries or golden frying.", "500g pack", new BigDecimal("11000.00"), 10, "🦐", false, true, seafood),

                // Beef & Meat
                new Product("DK-BEEF-01", "Family Beef Sausages", "Premium spiced beef sausages, great for quick breakfast and roll-ups.", "500g pack", new BigDecimal("6500.00"), 50, "🌭", true, true, beef),
                new Product("DK-BEEF-02", "Boneless Stewing Beef Cuts", "Lean beef cubes, cleanly trimmed, tender and ready to cook.", "1kg pack", new BigDecimal("11500.00"), 20, "🥩", false, true, beef),
                new Product("DK-BEEF-03", "Fresh Goat Meat Cuts", "Assorted goat meat with skin on, perfect for traditional goat meat pepper soup.", "1kg pack", new BigDecimal("13000.00"), 14, "🥩", false, true, beef),

                // Snacks
                new Product("DK-SNK-01", "Cocktail Spring Rolls", "Crispy vegetable & seasoned minced chicken pastry rolls.", "Pack of 15", new BigDecimal("4500.00"), 30, "🥟", false, true, snacks),
                new Product("DK-SNK-02", "Beef Samosa", "Spiced minced beef stuffed pastry triangles, ready to fry.", "Pack of 15", new BigDecimal("4500.00"), 28, "🥟", false, true, snacks)
        );

        productRepository.saveAll(products);

        // Seed a sample completed demo order
        Product sampleProd1 = products.get(0); // Orofo
        Product sampleProd2 = products.get(5); // Titus

        Order sampleOrder = new Order();
        sampleOrder.setOrderNumber("DK-2026-10001");
        sampleOrder.setCustomerName("Adebayo Ogundimu");
        sampleOrder.setCustomerEmail("adebayo.o@example.com");
        sampleOrder.setCustomerPhone("+2348023456789");
        sampleOrder.setDeliveryAddress("14 Admiralty Way, Lekki Phase 1");
        sampleOrder.setDeliveryCity("Lekki, Lagos");
        sampleOrder.setNotes("Please keep chilled upon arrival.");
        sampleOrder.setPaymentMethod(PaymentMethod.WHATSAPP);
        sampleOrder.setPaymentStatus(PaymentStatus.PAID);
        sampleOrder.setOrderStatus(OrderStatus.PROCESSING);
        sampleOrder.setSubtotal(sampleProd1.getPrice().add(sampleProd2.getPrice()));
        sampleOrder.setDeliveryFee(new BigDecimal("1500.00"));
        sampleOrder.setTotalAmount(sampleOrder.getSubtotal().add(sampleOrder.getDeliveryFee()));

        OrderItem item1 = new OrderItem(sampleOrder, sampleProd1, sampleProd1.getName(), sampleProd1.getPrice(), 1, sampleProd1.getPrice());
        OrderItem item2 = new OrderItem(sampleOrder, sampleProd2, sampleProd2.getName(), sampleProd2.getPrice(), 1, sampleProd2.getPrice());

        sampleOrder.addItem(item1);
        sampleOrder.addItem(item2);

        orderRepository.save(sampleOrder);

        log.info("Catalogue initialized successfully with {} products and 1 initial demo order.", products.size());
    }
}
