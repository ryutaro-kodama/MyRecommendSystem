package com.example.recommend.function;

import com.example.recommend.s3.S3VectorsRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.model.VectorData;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;

@Configuration
public class RecommendFunctions {

    private final S3VectorsRepository s3VectorsRepository;

    public RecommendFunctions(S3VectorsRepository s3VectorsRepository) {
        this.s3VectorsRepository = s3VectorsRepository;
    }

    public record VectorizeProductRequest(String text, List<Double> vector, String imageUrl) {
    }

    @Bean
    public Function<VectorizeProductRequest, String> vectorizeProduct() {
        return request -> {
            s3VectorsRepository.put(
                    UUID.randomUUID().toString(),
                    VectorData.fromFloat32(request.vector().stream().map(Double::floatValue).toList()),
                    Document.mapBuilder()
                            .putString("original_text", request.text())
                            .putString("image_url", request.imageUrl() != null ? request.imageUrl() : "")
                            .build());
            return "Vectorization successful, saved to S3";
        };
    }
}
