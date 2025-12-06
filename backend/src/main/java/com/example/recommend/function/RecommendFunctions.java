package com.example.recommend.function;

import com.example.recommend.s3.S3VectorsRepository;
import com.example.recommend.service.OpenAIService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.model.VectorData;

import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Function;

@Configuration
public class RecommendFunctions {

    private final OpenAIService openAIService;
    private final S3VectorsRepository s3VectorsRepository;

    public RecommendFunctions(OpenAIService openAIService,
            S3VectorsRepository s3VectorsRepository) {
        this.openAIService = openAIService;
        this.s3VectorsRepository = s3VectorsRepository;
    }

    @Bean
    public Consumer<String> vectorizeProduct() {
        return description -> {
            List<Double> embedding = openAIService.getEmbedding(description);

            s3VectorsRepository.put(
                    UUID.randomUUID().toString(),
                    VectorData.fromFloat32(embedding.stream().map(Double::floatValue).toList()),
                    Document.mapBuilder()
                            .putString("original_text", description)
                            .build());
        };
    }

    @Bean
    public Function<String, String> describeImage() {
        return imageUrl -> openAIService.describeImage(imageUrl);
    }
}
