provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "preference_center" {
  name = "preference-center-cluster"
}

# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "preference-center-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "512"
  cpu                      = "256"
  container_definitions = jsonencode([{
    name      = "preference-center-container"
    image     = "your-dockerhub-username/preference-center:latest"
    cpu       = 256
    memory    = 512
    essential = true
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
  }])
}

# ECS Service
resource "aws_ecs_service" "app_service" {
  name            = "preference-center-service"
  cluster         = aws_ecs_cluster.preference_center.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = ["subnet-xxxxxx"] # Replace with your subnet IDs
    security_groups = ["sg-xxxxxx"]     # Replace with your security group IDs
  }
}
