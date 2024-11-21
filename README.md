# Preference Center Service

## Summary

The preference centre service provides a robust and scalable backend solution. It enables users to select their preferred notification channels (email, SMS, or both) for any service they subscribe to with full support for real-time updates, event-driven architecture, and a complex API.

This project incorporates:

- **Queues and Jobs**: Efficient asynchronous task execution.
- **Event-Driven Architecture**: Ensures scalability and responsiveness.
- **Complex API**: Includes multiple routes, advanced request handling, validation.
- **WebSockets**: Provides real-time updates to clients for consent changes.
- **Request Validation**: Validates all incoming requests to ensure data integrity.
- **Caching with Redis**: Improves performance by caching frequently accessed data.
- **Unit and Integration Testing**: Powered by **Jest** and **Supertest** for thorough test coverage.

---

## **Table of Contents**

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Docker and Docker Compose](#docker-and-docker-compose)
8. [Infrastructure Provisioning (Terraform)](#infrastructure-provisioning-terraform)

---

## **Features**

- **User Management**: Create and manage users with unique email addresses.
- **Consent Preferences**: Track and update notification preferences for email and SMS.
- **Audit Logging**: Record all consent changes for auditing purposes.
- **Real-Time Updates**: Notify clients using WebSockets when preferences are updated.
- **Caching**: Use Redis to cache frequently accessed consent data.
- **Event-Driven Architecture**: Asynchronous processing of tasks using queues and jobs.
- **Testing**: Unit and integration testing with Jest and Supertest.

---

## **Technologies Used**

- **Backend**: Node.js (Express.js)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Real-Time Communication**: WebSocket (`socket.io`)
- **Containerization**: Docker
- **Infrastructure Management**: Terraform
- **Testing**: Jest, Supertest, Cypress

---

## **Installation**

### **1. Clone the Repository**

```sh
git clone <repository-name>
cd preference-center
```

### **2. Install Dependencies**

```sh
npm install
```

## **Running the Application**

### **1. Local Development**

If PostgreSQL and Redis are running locally on your machine:

1. Update the `.env` with your local configurations

2. Start the application
   ```sh
   npm start
   ```

### **2. Using Docker Compose**

Start all service(Node.js, PostgreSQL, Redis):

```sh
docker-compose up
```

To rebuild the services:

```
docker-compose up --build
```

## **API Endpoints**

### **User Routes**

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/users`     | Create a new user |
| GET    | `/api/users/:id` | Get user by ID    |

### **Event Routes**

| Method | Endpoint                                            | Description                          |
| ------ | --------------------------------------------------- | ------------------------------------ |
| POST   | `/api/events`                                       | Create a new consent change event    |
| GET    | `/api/events/:userId`                               | Get all events for a user            |
| GET    | `/api/events/:userId/state`                         | Get current consent state for a user |
| GET    | `/api/events/:userId?consentId=email_notifications` | Filter events based on consent type  |

## Testing

### **Run Unit and Integration Tests**

Use Jest and Supertest for testing:

```bash
npm test
```

### **Testing Framework Used**

- Jest: Used for unit and integration tests
- Supertest: Used for HTTP assertion and testing API endpoints.

markdown
Copy code

## **Docker and Docker Compose**

### **Build and Run with Docker**

To build the Docker image and run the container:

1. Build the Docker image:

   ```bash
   docker build -t preference-center .
   ```

2. Run the container:
   ```bash
   docker run -p 9010:9010 preference-center
   ```

## **Infrastructure Provisioning (Terraform)**

### **1. Install Terraform**

Follow the [Terraform installation guide](https://developer.hashicorp.com/terraform/tutorials) to install Terraform on your system.

---

### **2. Initialize Terraform**

Before applying any configurations, initialize Terraform in your project directory:

```bash
terraform init
```
---

### **3. Apply Terraform Configuration**

To provision the infrastructure defined in your main.tf file:
```bash
terraform apply -auto-approve
```

---
