package com.example.recommend.function;

import com.example.recommend.service.OpenAIService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Function;

import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest
class RecommendFunctionsTest {

    @Autowired
    private RecommendFunctions recommendFunctions;

    @Autowired
    private OpenAIService openAIService;

    @BeforeAll
    static void setup() throws IOException {
        // Load .env file if it exists
        Path envPath = Paths.get(".env");
        if (Files.exists(envPath)) {
            Files.lines(envPath).forEach(line -> {
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    String value = parts[1].trim();
                    if (key.equals("OPENAI_API_KEY")) {
                        System.setProperty("openai.api.key", value);
                    }
                }
            });
        }
    }

    @Test
    void describeImage_integration() {
        Function<String, String> describeImageFunction = recommendFunctions.describeImage();

        // Use a real image URL for testing
        String imageUrl = "https://uaoi.united-arrows.co.jp/img/item/32000/3200025Y0073/3200025Y0073_l1_a042.jpg";

        System.out.println("Converting image: " + imageUrl);
        String description = describeImageFunction.apply(imageUrl);

        System.out.println("Image Description: " + description);
        assertNotNull(description, "Description should not be null");
    }

    @Test
    void openAIService_getEmbedding() {
        String description = """
                Image Description: {
                  "color": "ダークチャコール（ブラウンがかったグレー）",
                  "quantity": "起毛感のあるウール調の厚手生地。表面はなめらかでマット、適度なハリと保温性がある。",
                  "genre": "メンズのカジュアルアウター／シャツジャケット",
                  "description": "シャツカラーで前開きはボタン留め。ヒップにかかるボックスシルエットで、やや落ち感のある肩のリラックスフィット。裾はストレート、左右に大きめのパッチポケットが配されている。無地で装飾を抑えたミニマルなデザインで、タートルネックなどのレイヤードに合わせやすい。"
                }""";

        List<Double> result = openAIService.getEmbedding(description);
        assertNotNull(result);
        System.out.println("Vectorizing result: " + result);

    }
}
