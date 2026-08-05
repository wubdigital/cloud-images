# Cloud Images Project - Automated CI/CD to AWS ECS

## 🏗️ Architecture Overview

```text
      GitHub
        |
        ▼
   GitHub Actions
        |
        ▼
       ECR
        |
        ▼
  User ---> ALB ---> ECS Fargate
                       |       |
                    Task 1   Task 2
                       |       |
                       +-------+
                           |
                           ▼
                          S3
📋 System Documentation
1. How is the system built?
The system runs a Node.js-based Web application that enables uploading files directly to AWS S3. The application is containerized with Docker and runs on Amazon's cloud infrastructure in a distributed manner.

2. Which AWS services were used?
Amazon ECR (Elastic Container Registry): For storing the project's Docker images.

Amazon ECS (Elastic Container Service - Fargate): For running containers in a Serverless environment without managing servers, utilizing a Service running multiple tasks concurrently.

ALB (Application Load Balancer): For routing user traffic to the ECS tasks in a balanced manner, supporting Zero-Downtime deployments.

Amazon S3: For storing documents and files uploaded by users through the application.

3. How does the CI/CD pipeline work?
The process is managed automatically via GitHub Actions upon a git push to the main branch:

Checkout & Auth: Checking out the repository code and authenticating with AWS using secure Secrets.

Build & Push: Building a new Docker image and pushing it to Amazon ECR.

ECS Deployment: Fetching the existing ECS Task Definition, updating the image tag directly via CLI commands, registering a new task definition revision, and updating the ECS service while ensuring Zero-Downtime continuity.

4. How were permissions handled?
AWS permissions and access are securely managed using an IAM Task Role alongside GitHub Actions Secrets (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY). This allows the pipeline to safely connect to AWS and update ECS without exposing sensitive credentials in the source code.

5. What is a challenge we encountered and how did we solve it?
The Challenge: During the deployment stage via GitHub Actions, we encountered a persistent AWS SDK error: Unexpected key 'enableFaultInjection' found in params, which prevented registering the updated Task Definition.

The Solution: We bypassed the outdated external actions and instead implemented the deployment process using a custom script based on AWS CLI and jq directly inside the runner. The script fetches the existing task definition, cleans up obsolete system fields, updates it with the new image, and updates the service smoothly and stably.

6. Bonus: Application Auto Scaling
We configured an Auto Scaling mechanism for the ECS Service to handle loads dynamically:

Minimum Tasks: 2 (Routine state).

Maximum Tasks: 4 (Scaling ceiling under load).

Metric & Threshold: The system monitors ECSServiceAverageCPUUtilization with a target threshold of 70% CPU. When traffic increases and CPU exceeds 70%, the Target Tracking mechanism automatically scales out tasks (from 2 to 3 and 4), and scales them back down to the minimum when the load decreases.
```
