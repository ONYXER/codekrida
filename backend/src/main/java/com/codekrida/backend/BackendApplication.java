package com.codekrida.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		try {
			new ProcessBuilder("docker","start","mongodb").start().waitFor();
		} catch (IOException |InterruptedException e) {
			throw new RuntimeException(e);
		}
		SpringApplication.run(BackendApplication.class, args);
	}

}
