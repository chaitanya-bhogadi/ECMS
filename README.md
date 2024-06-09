# Electricity Connections Management System

This application is designed to manage applicants data efficiently with a React frontend and Django backend. It includes features like CRUD operations, pagination, filtering, and search functionality on the customer model, along with JWT-based authentication.

## Application Architecture

![332591800-b880ff9c-9ae5-4cc4-bcec-023bd5f12d3b(1)](https://github.com/chaitanya-bhogadi/ECMS/assets/43384255/d0d5fc8f-9856-499e-b4fb-9e1c0e0a2883)


## Prerequisites

- Docker

## Running the Application

1. **Clone the repository:**
   
   git clone [https://github.com/chaitanya-bhogadi/customers_management.git](https://github.com/chaitanya-bhogadi/ECMS.git)
   cd ECMS
   

2. **Start the application using Docker Compose:**
   
   docker-compose up --build
   

3. **Access the application:**
   - Frontend is accessible at `http://localhost:3000`
   - Backend API is accessible at `http://localhost:8000`

## Application Features

- **Frontend**:
  - Login and sign-up pages
  - Dashboard for viewing, adding, editing, and deleting customer data
  - Bar Chart page to view stats and trends
- **Backend**:
  - CRUD operations with pagination, filter, and search capabilities on the customer model
  - JWT-based authentication to secure the API

## Technologies

- **Frontend**: React with tsx, MUI kit
- **Backend**: Django
- **Database**: PostgreSQL
- **Containerization**: Docker
