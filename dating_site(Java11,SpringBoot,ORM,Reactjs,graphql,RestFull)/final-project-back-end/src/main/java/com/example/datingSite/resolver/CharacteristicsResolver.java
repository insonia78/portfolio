package com.example.datingSite.resolver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import graphql.kickstart.tools.GraphQLResolver;

import com.example.datingSite.model.*;
import com.example.datingSite.repository.*;

import java.util.List;



@Component
public class CharacteristicsResolver implements GraphQLResolver<Characteristics> {
    @Autowired
    private PhotosRepository photosRepository;
    @Autowired
    private MemberRepository memberRepository;
     
    public CharacteristicsResolver(PhotosRepository photosRepository, MemberRepository memberRepository) {
      this.photosRepository = photosRepository;
      this.memberRepository = memberRepository;
    }
   
    public List<Photos> getPhotos(Characteristics c) {
      return  photosRepository.findAll();
    }    
    // public Member getMember(Characteristics c) {

    //   return memberRepository.findByEmail(c.getMember().getEmail()).orElseThrow(null);
    // }    
}
