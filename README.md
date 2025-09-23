
# halukkilincercom

## About the Backend

This project is the backend application for the halukkilincer.com website. It is developed with Spring Boot and provides the following main features:

- RESTful API for data delivery
- User and content management
- Security and error handling
- Easy configuration and extensible architecture

### Getting Started

To start the backend, follow these steps:

1. Make sure Java 17+ is installed.
2. Open a terminal in the project directory.
3. Run `./mvnw spring-boot:run`.

### Configuration

All configurations are located in `backend/src/main/resources/application.properties`.

### Folder Structure

```
backend/
├── src/main/java/com/halukkilincer/backend
│   ├── controller/   # API endpoints
│   ├── service/      # Business logic
│   ├── repository/   # Data access
│   └── entitiy/      # Data models
└── src/main/resources
	├── static/       # Static files
	└── templates/    # Templates
```

### Testing

Tests are located under `backend/src/test/java/com/halukkilincer/backend`. To run tests:

```
./mvnw test
```

### Contribution

To contribute, please create a pull request.

---
Feel free to reach out if you have any questions.
