package com.example.datingSite.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class LikeAndMessages {
    @Id @GeneratedValue
    @Column(name = "likeAndMessage_id", nullable = false)
    private Long id; 

    @Column(name = "receverEmail", nullable = false)
    private String receverEmail;

    @Column(name = "message")
    private String message;

    @Column(name = "likes")
    private Boolean likes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "email")
    private Member member;

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceverEmail() {
        return receverEmail;
    }

    public void setReceverEmail(String receverEmail) {
        this.receverEmail = receverEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getLikes() {
        return likes;
    }

    public void setLikes(Boolean likes) {
        this.likes = likes;
    }

    

    public LikeAndMessages(String receverEmail, String message, Boolean likes) {        
        this.receverEmail = receverEmail;
        this.message = message;
        this.likes = likes;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public LikeAndMessages() {
    }

       
     
    
}
