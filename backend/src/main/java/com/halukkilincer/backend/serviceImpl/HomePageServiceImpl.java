package com.halukkilincer.backend.serviceImpl;

import com.halukkilincer.backend.entitiy.HomePage;
import com.halukkilincer.backend.repository.HomePageRepository;
import com.halukkilincer.backend.service.HomePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HomePageServiceImpl implements HomePageService {
    private final HomePageRepository homePageRepository;

    @Autowired
    public HomePageServiceImpl(HomePageRepository homePageRepository) {
        this.homePageRepository = homePageRepository;
    }

    @Override
    public Optional<HomePage> getHomePage() {
        return homePageRepository.findById(1L);
    }

    @Override
    public HomePage saveHomePage(HomePage homePage) {
        return homePageRepository.save(homePage);
    }
}
