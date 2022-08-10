package com.example.datingSite.model;



import javax.persistence.*;


@Entity
public class Photos {

    @Id @GeneratedValue
    @Column(name = "photos_id", nullable = false)
    private Long id;
    
    @Column(name="photo_path")
    private String photo_path;
     
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "characteristics_id")
    private Characteristics characteristics;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoto_path() {
        return photo_path;
    }

    public void setPhoto_path(String photo_path) {
        this.photo_path = photo_path;
    }

    public Photos() {
    }
    public Characteristics getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(Characteristics characteristics) {
        this.characteristics = characteristics;
    }

    public Photos(String photo_path, Characteristics characteristics) {
        this.photo_path = photo_path;
        this.characteristics = characteristics;
    }

}
