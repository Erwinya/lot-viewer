package com.halukkilincer.backend.service;

import com.halukkilincer.backend.entitiy.HomePage;
import java.util.Optional;

public interface HomePageService {
    Optional<HomePage> getHomePage();
    HomePage saveHomePage(HomePage homePage);
}
