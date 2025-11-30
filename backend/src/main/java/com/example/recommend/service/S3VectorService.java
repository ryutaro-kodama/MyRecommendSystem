package com.example.recommend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class S3VectorService {

    private final S3Client s3Client;
    private final String bucketName;
    private final ObjectMapper objectMapper;

    public S3VectorService(S3Client s3Client, 
                           @Value("${s3.vector.bucket:recommend-vectors}") String bucketName,
                           ObjectMapper objectMapper) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.objectMapper = objectMapper;
    }

    public void saveVector(String text, List<Double> vector) {
        String key = "vectors/" + UUID.randomUUID().toString() + ".json";
        Map<String, Object> data = Map.of(
                "text", text,
                "vector", vector
        );

        try {
            String json = objectMapper.writeValueAsString(data);
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build(), RequestBody.fromString(json));
        } catch (IOException e) {
            throw new RuntimeException("Failed to serialize vector data", e);
        }
    }
}
