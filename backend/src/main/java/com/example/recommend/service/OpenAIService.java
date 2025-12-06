package com.example.recommend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final RestClient restClient;

    public OpenAIService(@Value("${openai.api.key:}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public List<Double> getEmbedding(String text) {
        Map<String, Object> request = Map.of(
                "model", "text-embedding-3-small",
                "input", text);

        Map response = restClient.post()
                .uri("/embeddings")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
        return (List<Double>) data.get(0).get("embedding");
    }

    public String describeImage(String imageUrl) {
        Map<String, Object> request = Map.of(
                "model", "gpt-5",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", List.of(
                                        Map.of("type", "text", "text",
                                                """
                                                        画像の商品を日本語で詳しく説明してください。説明の形式は以下のJSON形式で出力してください。
                                                        
                                                        {'color': '商品の色', 'quantity': '商品の質感',
                                                         'genre': '商品のジャンル', 'description': 'その他商品の見た目の説明'}
                                                        """),
                                        Map.of("type", "image_url", "image_url",
                                                Map.of("url", imageUrl))))),
                "max_completion_tokens", 2000);

        Map response = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
}
