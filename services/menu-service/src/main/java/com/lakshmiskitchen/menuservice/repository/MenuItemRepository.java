package com.lakshmiskitchen.menuservice.repository;

import com.lakshmiskitchen.menuservice.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, String> {
    List<MenuItem> findByCategory(String category);
    List<MenuItem> findByAvailableTrue();
}