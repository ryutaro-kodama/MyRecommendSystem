# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# IAM Policy for S3 Vector Access (and basic S3 for JAR if needed, though we upload directly usually or from local)
resource "aws_iam_role_policy" "lambda_s3_vector" {
  name = "${var.project_name}-lambda-s3-vector"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:*" # Broad access for preview service, narrow down later
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# API Gateway
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api-${var.environment}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

# Shared Lambda Configurations
locals {
  lambda_runtime = "java17"
  # Assuming the JAR file is built and located here. 
  # In a real CI/CD, this would come from S3 or build artifact.
  # For local terraform apply, we need the file to exist or use a dummy file.
  lambda_payload_path = "${path.module}/../backend/build/libs/backend-0.0.1-SNAPSHOT-aws.jar"
  lambda_handler      = "org.springframework.cloud.function.adapter.aws.FunctionInvoker"
}

# 1. VectorizeProduct Function
resource "aws_lambda_function" "vectorize_product" {
  filename      = local.lambda_payload_path
  function_name = "${var.project_name}-vectorizeProduct-${var.environment}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  timeout       = 30
  memory_size   = 512

  source_code_hash = filebase64sha256(local.lambda_payload_path)

  environment {
    variables = {
      SPRING_CLOUD_FUNCTION_DEFINITION = "vectorizeProduct"
      S3_INDEX_ARN                     = aws_cloudformation_stack.s3_vectors.outputs["VectorIndexArn"]
      # Add other DB connections etc if needed
    }
  }
}

# 2. ListVectors Function
resource "aws_lambda_function" "list_vectors" {
  filename      = local.lambda_payload_path
  function_name = "${var.project_name}-listVectors-${var.environment}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  timeout       = 30
  memory_size   = 512

  source_code_hash = filebase64sha256(local.lambda_payload_path)

  environment {
    variables = {
      SPRING_CLOUD_FUNCTION_DEFINITION = "listVectors"
      S3_INDEX_ARN                     = aws_cloudformation_stack.s3_vectors.outputs["VectorIndexArn"]
    }
  }
}

# 3. FindSimilar Function
resource "aws_lambda_function" "find_similar" {
  filename      = local.lambda_payload_path
  function_name = "${var.project_name}-findSimilar-${var.environment}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  timeout       = 30
  memory_size   = 512

  source_code_hash = filebase64sha256(local.lambda_payload_path)

  environment {
    variables = {
      SPRING_CLOUD_FUNCTION_DEFINITION = "findSimilar"
      S3_INDEX_ARN                     = aws_cloudformation_stack.s3_vectors.outputs["VectorIndexArn"]
    }
  }
}

# API Gateway Integrations & Routes

# VectorizeProduct
resource "aws_apigatewayv2_integration" "vectorize_product" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.vectorize_product.invoke_arn
}

resource "aws_apigatewayv2_route" "vectorize_product" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /vectorizeProduct"
  target    = "integrations/${aws_apigatewayv2_integration.vectorize_product.id}"
}

# ListVectors
resource "aws_apigatewayv2_integration" "list_vectors" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.list_vectors.invoke_arn
}

resource "aws_apigatewayv2_route" "list_vectors" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /listVectors"
  target    = "integrations/${aws_apigatewayv2_integration.list_vectors.id}"
}

# FindSimilar
resource "aws_apigatewayv2_integration" "find_similar" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.find_similar.invoke_arn
}

resource "aws_apigatewayv2_route" "find_similar" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /findSimilar"
  target    = "integrations/${aws_apigatewayv2_integration.find_similar.id}"
}

# Lambda Permissions for API Gateway
resource "aws_lambda_permission" "api_gw_vectorize" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.vectorize_product.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_list" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_vectors.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_find" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.find_similar.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
