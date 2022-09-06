package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	     DemoApplication.convertToUppAnddownCaseAString("this[p Iss a Test");
	}
	public static void convertToUppAnddownCaseAString(String value){
		char[] charValues = value.toCharArray();
        String formatedString = "";  
		for(int  i = charValues.length - 1 ; i >= 0 ; i--)
		{
			int asciiValue = (int) charValues[i];
			if((asciiValue >= 66 && asciiValue <= 90) || (asciiValue >= 97 && asciiValue <= 122))
			{ 
				if(i % 2 == 0)
				  formatedString += Character.toLowerCase(charValues[i]);
				else
				  formatedString += Character.toUpperCase(charValues[i]);  
			}
			else
			formatedString += charValues[i];
		}
		 
		System.out.println(formatedString);
         
	}
	public static void loadArray()
	{
		 int[] arrayOfString = {1,2,3,4,5};
		 for(int a : arrayOfString)
		 {
               System.out.println(a);
		 } 
		  
	}

}
