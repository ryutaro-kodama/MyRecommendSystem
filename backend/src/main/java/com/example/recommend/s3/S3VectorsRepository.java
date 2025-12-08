package com.example.recommend.s3;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.core.document.Document;
import software.amazon.awssdk.services.s3vectors.S3VectorsClient;
import software.amazon.awssdk.services.s3vectors.model.PutInputVector;
import software.amazon.awssdk.services.s3vectors.model.PutVectorsRequest;
import software.amazon.awssdk.services.s3vectors.model.VectorData;

@Repository
public class S3VectorsRepository {
    private final S3VectorsClient s3VectorsClient;

    @Value("${s3.vector.bucket-name}")
    private String S3_VECTOR_BUCKET;

    @Value("${s3.vector.index-name}")
    private String S3_INDEX_NAME;

    @Value("${s3.vector.index-arn}")
    private String S3_INDEX_ARN;

    public S3VectorsRepository(S3VectorsClient s3VectorsClient) {
        this.s3VectorsClient = s3VectorsClient;
    }

    public void put(String key, VectorData data, Document metadata) {
        try {
            PutVectorsRequest request = PutVectorsRequest.builder()
                    .vectorBucketName(S3_VECTOR_BUCKET)
                    .indexName(S3_INDEX_NAME)
                    .indexArn(S3_INDEX_ARN)
                    .vectors(PutInputVector.builder().key(key).data(data).metadata(metadata).build())
                    .build();
            s3VectorsClient.putVectors(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save vector to S3", e);
        }
    }
}
