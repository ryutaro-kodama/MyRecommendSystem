resource "aws_cloudformation_stack" "s3_vectors" {
  name = "${var.project_name}-s3-vectors-${var.environment}"

  template_body = yamlencode({
    AWSTemplateFormatVersion = "2010-09-09"
    Description              = "S3 Vectors Resources"
    Resources = {
      VectorBucket = {
        Type = "AWS::S3Vectors::VectorBucket"
        Properties = {
          Name = "${var.project_name}-vectors-${var.environment}"
        }
      }
      VectorIndex = {
        Type = "AWS::S3Vectors::VectorIndex"
        Properties = {
          VectorBucketName = "${var.project_name}-vectors-${var.environment}" # Reference manually or via GetAtt if CFN allows
          IndexName        = "main-index"
        }
        DependsOn = "VectorBucket"
      }
    }
    Outputs = {
      VectorIndexArn = {
        Description = "ARN of the Vector Index"
        Value = {
          "Fn::GetAtt" = ["VectorIndex", "Arn"]
        }
      }
    }
  })
}
