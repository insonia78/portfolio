package com.example.datingSite.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

import com.example.datingSite.model.Characteristics;

public interface CharacteristicsRepository extends JpaRepository<Characteristics,Long> {
    
    Optional<Characteristics> findByMemberEmail(String email);
    
}
