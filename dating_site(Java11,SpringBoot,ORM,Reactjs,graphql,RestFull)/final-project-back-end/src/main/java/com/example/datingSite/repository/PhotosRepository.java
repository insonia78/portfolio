package com.example.datingSite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.datingSite.model.Photos;
public interface PhotosRepository extends JpaRepository<Photos,Long> {
    //Optional<Photos> findByPhotosId(Long id);
}
