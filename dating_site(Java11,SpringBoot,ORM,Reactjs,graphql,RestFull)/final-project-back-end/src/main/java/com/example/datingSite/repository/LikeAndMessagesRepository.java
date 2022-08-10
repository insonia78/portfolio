package com.example.datingSite.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.example.datingSite.model.LikeAndMessages;
import com.example.datingSite.model.Member;

public interface LikeAndMessagesRepository extends JpaRepository<LikeAndMessages,Long> {
 
 
}