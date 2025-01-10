# Request Monitoring Service

A microservices-based system for monitoring API requests, tracking failed attempts, and sending notifications for security events. The system uses RabbitMQ for service communication, Redis for in-memory storage, and Nginx as a reverse proxy.

## Architecture Overview

The system consists of two main microservices:
1. Users Service - Handles request like signup, signin, submit etc
2. Notification Service - Manages alert notifications via email and storing log

### Key Features

- Monitors POST requests to `/api/submit` endpoint
- Tracks failed requests due to invalid headers/tokens
- Alerts via email when threshold exceeded (5 attempts/10 minutes)
- Metrics storage and analysis
- High scalability (500 requests/second)
- Real-time processing with Redis
- Service communication via RabbitMQ

## Prerequisites

- Node.js 16+
- Redis
- RabbitMQ
- Nginx

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sahilf637/FlexyPe_assignment.git
cd FlexyPe_assignment
```

### 2. Install Dependencies

```bash
# Users Service
cd users
npm install

# Notification Service
cd ../notification
npm install
```

### 3. Configure Redis

```bash
# Install Redis
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis
```

### 4. Configure RabbitMQ

```bash
# Install RabbitMQ
sudo apt-get install rabbitmq-server

# Start RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

### 5. Configure Nginx

```bash
# Install Nginx
sudo apt-get install nginx

# Copy reverse proxy configuration
sudo cp /path/to/your/proxy/reverse-proxy /etc/nginx/sites-available/

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/reverse-proxy /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Configuration

### Environment Variables

Create `.env` files in both service directories:

```env
# users/.env
PORT=8001
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost

# notification/.env
PORT=8002
RABBITMQ_URL=amqp://localhost
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Starting the Services

1. Start Users Service:
```bash
cd users
npm start
```

2. Start Notification Service:
```bash
cd notification
npm start
```

## API Endpoints

API endpoints can be viewed here :- [Postman API](https://documenter.getpostman.com/view/26118247/2sAYQWJDVQ)

## Development

```bash
# Run services in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Future Hopes

1. Dockerize the services
2. Complete deployment in AWS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request


