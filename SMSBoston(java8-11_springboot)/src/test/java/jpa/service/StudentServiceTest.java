package jpa.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import jpa.entitymodels.*;


public class StudentServiceTest {

	StudentService studentService = new StudentService();
	static Student student = null;
	@BeforeAll
    public static void init(){
        student  = new Student("aiannitti7@is.gd", "Alexandra Iannitti","test",null);
    }
	@Test
	public void getStudentByEmail() {				
		Student student = this.studentService.getStudentByEmail("aiannitti7@is.gd");
    	// then
		assertEquals(student, StudentServiceTest.student);		
	}	
	
}
