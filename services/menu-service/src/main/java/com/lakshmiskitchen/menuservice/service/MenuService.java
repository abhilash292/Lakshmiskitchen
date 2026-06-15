package com.lakshmiskitchen.menuservice.service;

import com.lakshmiskitchen.menuservice.dto.MenuItemRequest;
import com.lakshmiskitchen.menuservice.dto.MenuItemResponse;
import com.lakshmiskitchen.menuservice.entity.MenuItem;
import com.lakshmiskitchen.menuservice.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository repository;

    @CacheEvict(value = "menu", allEntries = true)
    public MenuItemResponse create(MenuItemRequest request) {
        MenuItem item = MenuItem.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .build();
        return toResponse(repository.save(item));
    }

    @Cacheable(value = "menu")
    public List<MenuItemResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public MenuItemResponse getById(String id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
    }

    @CacheEvict(value = "menu", allEntries = true)
    public MenuItemResponse update(String id, MenuItemRequest request) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        item.setName(request.name());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setCategory(request.category());
        item.setImageUrl(request.imageUrl());
        return toResponse(repository.save(item));
    }

    @CacheEvict(value = "menu", allEntries = true)
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Menu item not found");
        }
        repository.deleteById(id);
    }

    private MenuItemResponse toResponse(MenuItem item) {
        return new MenuItemResponse(item.getId(), item.getName(), item.getDescription(),
                item.getPrice(), item.getCategory(), item.getImageUrl(), item.isAvailable());
    }
}