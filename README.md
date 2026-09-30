# 💳 Credit Card Task — Secure Payment Processing System

NexusPay is a full-stack payment processing system built using **React, Django, FastAPI, and MySQL**.

The project follows a simple microservices-style architecture where Django handles authentication, users, cards, and transaction records, while FastAPI handles payment validation and processing. The complete application can be run using **Docker Compose**.

## 🏗️ Architecture

The application is divided into four Docker containers:

| Service        | Container              |   Port | Purpose                                             |
| -------------- | ---------------------- | -----: | --------------------------------------------------- |
| Frontend       | `credit_card_frontend` | `5173` | React/Vite user interface                           |
| Django Backend | `credit_card_django`   | `8000` | Authentication, database operations and API gateway |
| FastAPI Engine | `credit_card_fastapi`  | `8001` | Payment validation and transaction processing       |
| MySQL          | `credit_db`            | `3307` | Stores application data                             |

### How it works

```text
React Frontend
      │
      ▼
Django REST API
      │
      ├── Authentication & JWT
      ├── User & Card Management
      ├── Transaction History
      │
      ▼
FastAPI Payment Engine
      │
      ▼
     MySQL
```

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* Axios
* React Router
* Tailwind CSS / CSS

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT

### Payment Service

* FastAPI
* Uvicorn
* Pydantic

### Database

* MySQL 8.0
* MySQL Client

### DevOps

* Docker
* Docker Compose

## ✨ Main Features

* User registration and login
* JWT-based authentication
* Protected API endpoints
* Credit/debit card management
* Secure card representation using masked card numbers
* Card validation using the Luhn algorithm
* Payment processing through FastAPI
* Successful and declined payment handling
* Transaction history
* Transaction filtering
* Dashboard statistics
* Django admin panel
* FastAPI Swagger documentation
* Dockerized development environment

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your system:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Git

Docker Desktop should be running before starting the project.

## 1. Clone the Repository

```bash
git clone https://github.com/NithishKumar003/credit_card_task.git
cd credit_card_task
```

## 2. Start the Application

From the project root directory, run:

```bash
docker compose up --build -d
```

This will build the required Docker images and start all application services.

Check whether the containers are running:

```bash
docker compose ps
```

## 3. Run Database Migrations

After the containers are running, apply the Django migrations:

```bash
docker exec -it credit_card_django python manage.py migrate
```

## 4. Create an Admin User

Create a Django superuser:

```bash
docker exec -it credit_card_django python manage.py createsuperuser
```

Follow the prompts to enter the username, email, and password.

## 🌐 Application URLs

Once the containers are running, the following services are available:

| Service         | URL                          |
| --------------- | ---------------------------- |
| User Dashboard  | http://localhost:5173        |
| Django API      | http://localhost:8000/api/   |
| Django Admin    | http://localhost:8000/admin/ |
| FastAPI Swagger | http://localhost:8001/docs   |
| MySQL           | `localhost:3307`             |

## ⚙️ Environment Configuration

The services communicate with each other using environment variables configured in `docker-compose.yml`.

### Django

```env
DB_HOST=db
DB_NAME=payment_system_db
FASTAPI_URL=http://fastapi_engine:8001
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FASTAPI_BASE_URL=http://localhost:8001/api
```

Inside Docker, Django communicates with FastAPI using the Docker service/container name rather than `localhost`.

## 🔐 Security

The project is designed to avoid storing complete card numbers.

Instead, the application works with:

* Masked card numbers
* Last four digits
* JWT authentication
* Protected API endpoints
* Server-side payment validation

Payment requests are passed from Django to the FastAPI payment service for additional validation and processing.

> **Note:** This project is intended for learning and demonstration purposes. It is not a production-ready payment gateway and should not be used to process real card information.

## 📊 Payment Flow

A typical payment request follows this flow:

```text
User
 │
 ▼
React Frontend
 │
 ▼
Django API
 │
 ├── Authenticates user
 ├── Validates request
 │
 ▼
FastAPI Payment Engine
 │
 ├── Validates card details
 ├── Performs payment checks
 ├── Processes transaction
 │
 ▼
Django
 │
 ▼
MySQL
 │
 ▼
Transaction History / Dashboard
```

Transactions can result in statuses such as:

* `PENDING`
* `SUCCESS`
* `FAILED`
* `DECLINED`

## 🐳 Docker Management

### Check running containers

```bash
docker compose ps
```

### View Django logs

```bash
docker compose logs -f django_backend
```

### View FastAPI logs

```bash
docker compose logs -f fastapi_engine
```

### View all service logs

```bash
docker compose logs -f
```

### Stop the application

```bash
docker compose down
```

### Stop containers and remove database volumes

```bash
docker compose down --volumes
```

> **Warning:** Removing the volumes will delete the MySQL database data stored by the Docker volume.

## 📁 Project Structure

A simplified project structure looks like this:

```text
credit_card_task/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── django_backend/
│   ├── manage.py
│   ├── apps/
│   ├── requirements.txt
│   └── Dockerfile
│
├── fastapi_engine/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── screenshots
└── README.md
```

## 🎯 Project Objective

The main objective of NexusPay is to demonstrate how different backend services can work together in a payment-processing application.

The project helped implement and understand:

* REST API development
* JWT authentication
* Database integration
* React frontend development
* Django REST Framework
* FastAPI services
* Service-to-service communication
* Payment validation
* Transaction management
* Docker containerization
* Docker Compose networking

## 👨‍💻 Author

**Nithish Kumar E**

GitHub: [NithishKumar003](https://github.com/NithishKumar003)

## 📄 License

This project is licensed under the **MIT License**.
