package jpa.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import jpa.dao.StudentDAO;
import jpa.entitymodels.Course;
import jpa.entitymodels.Student;


public class StudentService implements StudentDAO {

	@Override
	public List<Student> getAllStudents() {
		// TODO Auto-generated method stub
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("SMSBoston");
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		
		Query query = entityManager.createQuery("select s from Student s");
		List<?> allStudents = query.getResultList();
		return (List<Student>) allStudents;
		
	}

	@Override
	public Student getStudentByEmail(String sEmail) {
		// TODO Auto-generated method stub
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("SMSBoston");
		EntityManager entityManager = entityManagerFactory.createEntityManager();		
		
		Student student = entityManager.find(Student.class, sEmail);
		return student;	
		
	}

	@Override
	public boolean validateStudent(String sEmail, String sPassword) {
		// TODO Auto-generated method stub
		Student s = this.getStudentByEmail(sEmail);
		
		if(s == null || !(s.getPassword().equals(sPassword)))
			return false;
		
		return true;
	}

	@Override
	public void registerStudentToCourse(String sEmail, int cId) {
		// TODO Auto-generated method stub
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("SMSBoston");
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query query = entityManager.createNativeQuery("INSERT INTO student_course (Student_email, courses_ID) VALUES (? , ?);");
		entityManager.getTransaction().begin();
		query.setParameter(1, sEmail);
		query.setParameter(2, cId);
		query.executeUpdate();
		entityManager.getTransaction().commit();
		//entityManager.flush();		
	}
	@Override
	public List<Course> getStudentCourses(String sEmail) {
		// TODO Auto-generated method stub
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("SMSBoston");
		EntityManager entityManager = entityManagerFactory.createEntityManager();		
		TypedQuery<Course> query =  (TypedQuery<Course>) entityManager.createNativeQuery("select * from Course c join student_course sc on c.id = sc.courses_ID AND sc.Student_email = ?",Course.class);
		return query.setParameter(1,sEmail).getResultList();
	}

}
