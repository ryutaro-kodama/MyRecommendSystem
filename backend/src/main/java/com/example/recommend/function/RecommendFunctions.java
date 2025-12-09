package com.example.recommend.function;

import com.example.recommend.s3.S3VectorsRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.model.VectorData;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;

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

    public record VectorResponse(String key, String originalText, String imageUrl, List<Float> vector) {

    }

    @Bean
    public Supplier<List<VectorResponse>> listVectors() {
        // 引数を受け取らない形 (() -> ...) に変更
        return () -> {
            return s3VectorsRepository.list().stream()
                    .map(v -> {
                        return new VectorResponse(
                                v.key(),
                                v.metadata().asMap().get("original_text").toString(),
                                v.metadata().asMap().get("image_url").toString(),
                                v.data().float32().subList(0, 5));
                    })
                    .toList();
        };
    }

    public record FindSimilarRequest(String key) {
    }

    @Bean
    public Function<FindSimilarRequest, List<VectorResponse>> findSimilar() {
        return request -> {
            String key = request.key();
            var targetVector = s3VectorsRepository.get(key).get(0);
            System.out.println(targetVector.data().float32());

            var results = s3VectorsRepository.query(targetVector.data(), 3);
            return results.stream()
                    .map(v -> new VectorResponse(
                            v.key(),
                            v.metadata().asMap().get("original_text").toString(),
                            v.metadata().asMap().get("image_url").toString(),
                            // クエリ対象のベクトルデータは取得していないため
                            null))
                    .toList();
        };
    }
}
