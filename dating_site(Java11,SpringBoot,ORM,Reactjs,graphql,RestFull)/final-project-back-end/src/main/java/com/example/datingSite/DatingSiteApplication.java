package com.example.datingSite;


import com.example.datingSite.properties.FileStorageProperties;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@SpringBootApplication
@EnableConfigurationProperties({
	FileStorageProperties.class
})
//@Import({ CORSFilter.class, SpringWebSecurityConfiguration.class })
public class DatingSiteApplication {

	private final long MAX_AGE_SECS = 3600;

	public static void main(String[] args) {
		SpringApplication.run(DatingSiteApplication.class, args);
	}
    // @Bean
	// public WebMvcConfigurer corsConfigurer() {
		
	// 	System.out.println("hello");
	// 	return new WebMvcConfigurer() {
	// 		@Override
	// 		public void addCorsMappings(CorsRegistry registry) {
	// 			//registry.addMapping("/graphql").allowedOrigins("*");
	// 			registry.addMapping("/**").allowedOrigins("*")				
	// 			.allowedHeaders("*")
	// 			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
	// 			.allowCredentials(true)
	// 			.maxAge(MAX_AGE_SECS);
	// 		}
	// 	};
	// } 
	
}
