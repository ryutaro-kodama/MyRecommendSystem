output "api_endpoint" {
  description = "HTTP API Gateway Endpoint"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito Client ID"
  value       = aws_cognito_user_pool_client.client.id
}

output "s3_vector_index_arn" {
  description = "ARN of the S3 Vector Index"
  value       = aws_cloudformation_stack.s3_vectors.outputs["VectorIndexArn"]
}
