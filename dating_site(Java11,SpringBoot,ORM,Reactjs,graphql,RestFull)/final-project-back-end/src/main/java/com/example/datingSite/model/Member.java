package com.example.datingSite.model;
import java.util.List;

import javax.persistence.*;

@Entity
public class Member {

    @Id
    @Column(name = "email", nullable = false)    
    private String email;
       
    @Column(name = "password", nullable = false)
    private String password;    
    @OneToOne(fetch = FetchType.LAZY,cascade =  CascadeType.ALL, mappedBy = "member") 
    private Characteristics characteristics;
    
    @OneToMany(fetch = FetchType.LAZY, cascade =  CascadeType.ALL, mappedBy = "member") 
    private List<LikeAndMessages> likeAndMessages;
    public Member() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Characteristics getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(Characteristics characteristics) {
        this.characteristics = characteristics;
    }

    public Member(String email, String password) {
        this.email = email;
        this.password = password;
        
    }

    public List<LikeAndMessages> getLikeAndMessages() {
        return likeAndMessages;
    }

    public void setLikeAndMessages(List<LikeAndMessages> likeAndMessages) {
        this.likeAndMessages = likeAndMessages;
    }

}
