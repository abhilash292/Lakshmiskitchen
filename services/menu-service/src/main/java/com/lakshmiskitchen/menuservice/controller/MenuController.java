package com.lakshmiskitchen.menuservice.controller;

import com.lakshmiskitchen.menuservice.dto.MenuItemRequest;
import com.lakshmiskitchen.menuservice.dto.MenuItemResponse;
import com.lakshmiskitchen.menuservice.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @PostMapping
    public ResponseEntity<MenuItemResponse> create(@Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.create(request));
    }

    @GetMapping
    public List<MenuItemResponse> getAll() {
        return menuService.getAll();
    }

    @GetMapping("/{id}")
    public MenuItemResponse getById(@PathVariable String id) {
        return menuService.getById(id);
    }

    @PutMapping("/{id}")
    public MenuItemResponse update(@PathVariable String id, @Valid @RequestBody MenuItemRequest request) {
        return menuService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}