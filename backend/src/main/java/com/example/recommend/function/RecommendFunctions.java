package com.example.recommend.function;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.example.recommend.s3.S3VectorsRepository;
import com.example.recommend.service.OpenAIService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.model.VectorData;

import java.util.List;
import java.util.UUID;
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
    public Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> recommendationHandler() {
        return event -> {
            String path = event.getPath();
            String body = event.getBody();
            APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();

            try {
                if ("/vectorizeProduct".equals(path)) {
                    List<Double> embedding = openAIService.getEmbedding(body);
                    s3VectorsRepository.put(
                            UUID.randomUUID().toString(),
                            VectorData.fromFloat32(embedding.stream().map(Double::floatValue).toList()),
                            Document.mapBuilder()
                                    .putString("original_text", body)
                                    .build());
                    response.setStatusCode(200);
                    response.setBody("Vectorization successful");
                } else if ("/describeImage".equals(path)) {
                    String description = openAIService.describeImage(body);
                    response.setStatusCode(200);
                    response.setBody(description);
                } else {
                    response.setStatusCode(404);
                    response.setBody("Path not found: " + path);
                }
            } catch (Exception e) {
                response.setStatusCode(500);
                response.setBody("Internal Server Error: " + e.getMessage());
            }

            return response;
        };
    }
}
