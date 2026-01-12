variable "project_name" {
  description = "Project name to be used for tagging resources"
  type        = string
  default     = "my-recommend-system"
}

variable "region" {
  description = "AWS Region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}
