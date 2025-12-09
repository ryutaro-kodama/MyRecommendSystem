package com.example.recommend.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.S3VectorsClient;
import software.amazon.awssdk.services.s3vectors.model.*;

import java.util.List;

@Repository
public class S3VectorsRepository {
    private final S3VectorsClient s3VectorsClient;

    @Value("${s3.vector.index-arn}")
    private String S3_INDEX_ARN;

    public S3VectorsRepository(S3VectorsClient s3VectorsClient) {
        this.s3VectorsClient = s3VectorsClient;
    }

    public void put(String key, VectorData data, Document metadata) {
        try {
            PutVectorsRequest request = PutVectorsRequest.builder()
                    // .vectorBucketName(S3_VECTOR_BUCKET)
                    // .indexName(S3_INDEX_NAME)
                    .indexArn(S3_INDEX_ARN)
                    .vectors(PutInputVector.builder().key(key).data(data).metadata(metadata).build())
                    .build();
            s3VectorsClient.putVectors(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save vector to S3", e);
        }
    }

    public List<ListOutputVector> list() {
        try {
            ListVectorsRequest request = ListVectorsRequest.builder()
                    .indexArn(S3_INDEX_ARN)
                    .returnData(true)
                    .returnMetadata(true)
                    .build();
            ListVectorsResponse response = s3VectorsClient.listVectors(request);
            return response.vectors();
        } catch (Exception e) {
            throw new RuntimeException("Failed to list vectors", e);
        }
    }

    public List<GetOutputVector> get(String key) {
        try {
            GetVectorsRequest request = GetVectorsRequest.builder()
                    .indexArn(S3_INDEX_ARN)
                    .returnData(true)
                    .returnMetadata(false)
                    .keys(key)
                    .build();
            GetVectorsResponse response = s3VectorsClient.getVectors(request);
            System.out.println(key);
            System.out.println(response.toString());
            System.out.println(response.vectors().size());
            return response.vectors();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get vector from S3", e);
        }
    }

    public List<QueryOutputVector> query(VectorData vectorData, int topK) {
        try {
            QueryVectorsRequest request = QueryVectorsRequest.builder()
                    .indexArn(S3_INDEX_ARN)
                    .returnMetadata(true)
                    .queryVector(vectorData)
                    .topK(topK)
                    .build();
            QueryVectorsResponse response = s3VectorsClient.queryVectors(request);
            return response.vectors();
        } catch (Exception e) {
            throw new RuntimeException("Failed to search vectors", e);
        }
    }
}
