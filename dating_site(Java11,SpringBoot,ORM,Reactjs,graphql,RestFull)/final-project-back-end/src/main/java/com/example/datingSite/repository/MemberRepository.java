package com.example.datingSite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.example.datingSite.model.Member;

public interface MemberRepository extends JpaRepository<Member,Long> {
 Optional<Member> findByEmail(String email);
 Optional<Boolean> deleteByEmail(String email);
 
}
