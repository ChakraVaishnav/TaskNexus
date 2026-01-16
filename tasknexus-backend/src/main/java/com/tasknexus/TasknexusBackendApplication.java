package com.tasknexus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tasknexus")
public class TasknexusBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TasknexusBackendApplication.class, args);
	}

}
