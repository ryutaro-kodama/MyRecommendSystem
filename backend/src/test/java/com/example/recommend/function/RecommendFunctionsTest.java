package com.example.recommend.function;

import com.example.recommend.service.OpenAIService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class RecommendFunctionsTest {

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
                    } else if (key.equals("S3_VECTOR_BUCKETNAME")) {
                        System.setProperty("s3.vector.bucket-name", value);
                    } else if (key.equals("S3_VECTOR_INDEXNAME")) {
                        System.setProperty("s3.vector.index-name", value);
                    } else if (key.equals("S3_VECTOR_INDEXARN")) {
                        System.setProperty("s3.vector.index-arn", value);
                    }
                }
            });
        }
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
