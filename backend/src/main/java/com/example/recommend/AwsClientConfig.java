package com.example.recommend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.s3vectors.S3VectorsClient;

/**
 * Spring configuration that provides AWS SDK v2 clients as DI-managed beans.
 */
@Configuration
public class AwsClientConfig {

    @Bean
    public Region awsRegion() {
        // Adjust as needed or externalize via env/properties
        return Region.US_EAST_1;
    }

    @Bean
    public S3VectorsClient s3VectorsClient(Region region) {
        return S3VectorsClient.builder()
                .region(region)
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .build();
    }
}
