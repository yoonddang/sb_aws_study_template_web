package com.template.web.configuration;

import okhttp3.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@Configuration
public class BasicConfiguration {
	@Bean
	public RestTemplate restTemplate(){
		OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();
		OkHttpClient client = clientBuilder
				.connectTimeout(30, TimeUnit.SECONDS)
				.retryOnConnectionFailure(true)
				.build();
		RestTemplate restTemplate = new RestTemplate(new OkHttp3ClientHttpRequestFactory(client));

		return restTemplate;
	}
}