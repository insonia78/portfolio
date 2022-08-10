package com.example.datingSite.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.apache.juli.FileHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.datingSite.model.Characteristics;
import com.example.datingSite.model.Photos;
import com.example.datingSite.model.UploadFileResponse;
import com.example.datingSite.repository.CharacteristicsRepository;
import com.example.datingSite.repository.PhotosRepository;
import com.example.datingSite.service.FileStorageService;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;


@RestController

public class RestControllers {
  // Aggregate root
  private static final Logger logger = LoggerFactory.getLogger(FileHandler.class);
      
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private PhotosRepository photosRepository;
    @Autowired
    private CharacteristicsRepository characteristicsRepository;
  @PostMapping(path ="/setPhotos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  
  String doPost(@RequestPart(value="id") String id ,@RequestPart(value="photos", required=true) MultipartFile photos, @RequestPart("characteristcs_id") String characteristcs_id ) {
    Characteristics c = characteristicsRepository.findById(Long.parseLong(characteristcs_id)).get();
    
    Photos p = new Photos();
    
    String fileName = fileStorageService.storeFile(photos);
    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/Photos/")
                .path(fileName)
                .toUriString();
    
    System.out.println(fileDownloadUri);  
    p.setId(Long.parseLong(id));
    p.setPhoto_path(fileDownloadUri);
    p.setCharacteristics(c);
    photosRepository.save(p);        
    return "this is false";
  }
    @PostMapping("/uploadFile")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }
} 

