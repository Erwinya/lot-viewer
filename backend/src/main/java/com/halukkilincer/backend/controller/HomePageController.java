package com.halukkilincer.backend.controller;

import com.halukkilincer.backend.entitiy.HomePage;
import com.halukkilincer.backend.service.HomePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/homepage")
public class HomePageController {
    private final HomePageService homePageService;

    @Autowired
    public HomePageController(HomePageService homePageService) {
        this.homePageService = homePageService;
    }

    @GetMapping
    public ResponseEntity<HomePage> getHomePage() {
        Optional<HomePage> homePage = homePageService.getHomePage();
        return homePage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HomePage> saveHomePage(@RequestBody HomePage homePage) {
        HomePage saved = homePageService.saveHomePage(homePage);
        return ResponseEntity.ok(saved);
    }
}
