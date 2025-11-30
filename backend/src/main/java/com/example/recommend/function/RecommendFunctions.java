package com.example.recommend.function;

import com.example.recommend.service.OpenAIService;
import com.example.recommend.service.S3VectorService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

@Configuration
public class RecommendFunctions {

    private final OpenAIService openAIService;
    private final S3VectorService s3VectorService;

    public RecommendFunctions(OpenAIService openAIService, S3VectorService s3VectorService) {
        this.openAIService = openAIService;
        this.s3VectorService = s3VectorService;
    }

    @Bean
    public Consumer<String> vectorizeProduct() {
        return description -> {
            List<Double> embedding = openAIService.getEmbedding(description);
            s3VectorService.saveVector(description, embedding);
        };
    }

    @Bean
    public Function<String, String> describeImage() {
        return imageUrl -> openAIService.describeImage(imageUrl);
    }
}
