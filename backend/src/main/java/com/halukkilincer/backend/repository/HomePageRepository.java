package com.halukkilincer.backend.repository;

import com.halukkilincer.backend.entitiy.HomePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomePageRepository extends JpaRepository<HomePage, Long> {
}
