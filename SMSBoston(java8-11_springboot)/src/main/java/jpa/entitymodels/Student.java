package jpa.entitymodels;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;



@Entity
@Table(name="student")
public class Student {	

	@Id
	@Column(name = "email")
	private String email ;
	private String name;
	private String password;
	
	
	@ManyToMany(fetch = FetchType.LAZY)	
	@JoinColumn(name="id")
	private List<Course> courses;
	
	public List<Course> getCourses() {
		return courses;
	}
	public void setCourses(List<Course> courses) {
		this.courses = courses;
	}
	public Student() {}
	public Student(String email, String name, String password, List<Course> course) {
		this.email = email;
		this.name = name;
		this.password = password;
		this.courses = course;
		
		
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
    public boolean equals(Object obj) 
    { 
          
    // if both the object references are  
    // referring to the same object. 
    if(this == obj) 
            return true; 
          
        // it checks if the argument is of the  
        // type Geek by comparing the classes  
        // of the passed argument and this object. 
        // if(!(obj instanceof Geek)) return false; ---> avoid. 
        if(obj == null || obj.getClass()!= this.getClass()) 
            return false; 
          
        // type casting of the argument.  
        Student s = (Student) obj; 
          
        // comparing the state of argument with  
        // the state of 'this' Object. 
        return (s.name.equals(this.name)  && s.email.equals(this.email)); 
    }	
}
