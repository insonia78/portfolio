package com.example.datingSite.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

@Entity
public class Characteristics{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="characteristics_id")
    private Long id;


    @Column(name="first_name", nullable= false)
    private String first_name;
    @Column(name="middle_name", nullable= true)
    private String middle_name;
    @Column(name="last_name", nullable= false)
    private String last_name; 

    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "etnicity", nullable = false)
    private String etnicity;
    
    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "hair_color", nullable = false)
    private String hair_color;

    @Column(name = "eye_color", nullable = false )
    private String eye_color;

    @Column(name = "height", nullable = false)
    private String height;

    @Column(name = "weight", nullable = false)
    private String weight;

    @Column(name = "message", nullable = true)
    private String message;

    @OneToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name="email") 
    private Member member;

    @OneToMany(fetch = FetchType.LAZY, cascade =  CascadeType.ALL, mappedBy = "characteristics") 
    private List<Photos> photos;
    
    public Characteristics(){}

    
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }   
    
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getHair_color() {
        return hair_color;
    }

    public void setHair_color(String hair_color) {
        this.hair_color = hair_color;
    }

    public String getEye_color() {
        return eye_color;
    }

    public void setEye_color(String eye_color) {
        this.eye_color = eye_color;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
   
    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getMiddle_name() {
        return middle_name;
    }

    public void setMiddle_name(String middle_name) {
        this.middle_name = middle_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }   

    public String getEtnicity() {
        return etnicity;
    }

    public void setEtnicity(String etnicity) {
        this.etnicity = etnicity;
    }

    public void setPhotos(List<Photos> photos) {
        this.photos = photos;
    }

    public List<Photos> getPhotos() {
        return photos;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Characteristics(String first_name, String middle_name, String last_name, String gender, String etnicity,
            Integer age, String hair_color, String eye_color, String height, String weight, String message) {
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.last_name = last_name;
        this.gender = gender;
        this.etnicity = etnicity;
        this.age = age;
        this.hair_color = hair_color;
        this.eye_color = eye_color;
        this.height = height;
        this.weight = weight;
        this.message = message;
    }

    
}