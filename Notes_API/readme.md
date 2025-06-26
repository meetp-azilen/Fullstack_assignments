# Notes API

A simple and secure API for creating, reading, updating, and deleting notes, complete with user authentication and rate limiting.

## Features

*   **Secure Communication**: All API communication is over HTTPS.
*   **Authentication**: User registration and login functionality.
*   **CRUD Operations**: Full Create, Read, Update, and Delete operations for notes.
*   **Rate Limiting**: Protects the API from abuse and excessive requests.

## Prerequisites

*   [Node.js](https://nodejs.org/) (or the relevant runtime for the project)
*   [OpenSSL](https://www.openssl.org/)
    *   **Windows**: Download and install from [slproweb.com](https://slproweb.com/products/Win32OpenSSL.html).
    *   **macOS & Linux**: OpenSSL is typically pre-installed.

## Local Development Setup

### 1. Generate a Self-Signed SSL Certificate

This project requires HTTPS. For local development, you can generate a self-signed certificate.

1.  Open your terminal. On Windows, use the **"Win64 OpenSSL Command Prompt"** that comes with your OpenSSL installation.

2.  Create a directory for the certificate and navigate into it:
    ```bash
    mkdir cert
    cd cert
    ```

3.  Execute the OpenSSL command to generate a new key and certificate:
    ```bash
    openssl req -nodes -new -x509 -keyout key.pem -out cert.pem -days 365
    ```
    *   This command creates two files: `key.pem` (the private key) and `cert.pem` (the public certificate).
    *   You will be prompted for information (Country Name, etc.). You can press `Enter` to accept the defaults or leave them blank.

### 2. Install Dependencies & Run

_(Instructions on how to install dependencies and run the project should be added here. For example:)_

```bash
# Install project dependencies
npm install

# Run the server
npm start
```

The server should now be running at `https://localhost:8443`.

## Using the API with Postman

### Postman Configuration

Because you are using a locally signed certificate, you must disable SSL certificate verification in Postman's global settings.

1.  In Postman, go to **Settings** (wrench icon in the header) > **General**.
2.  Find the **"SSL certificate verification"** toggle and switch it to **OFF**.

### Endpoints

The base URL for all requests is `https://localhost:8443/api`.

#### Authentication

| Method | Endpoint         | Description          | Example Body (JSON)                       |
| :----- | :--------------- | :------------------- | :---------------------------------------- |
| `POST` | `/auth/register` | Registers a new user. | `{ "username": "user", "password": "password123" }` |
| `POST` | `/auth/login`    | Logs in an existing user. | `{ "username": "user", "password": "password123" }` |

#### Notes (Authentication Required)

| Method   | Endpoint      | Description                       | Example Body (JSON)                               |
| :------- | :------------ | :-------------------------------- | :------------------------------------------------ |
| `GET`    | `/notes`      | Get all notes for the user.       | N/A                                               |
| `POST`   | `/notes`      | Create a new note.                | `{ "content": "This is my first secure note." }`  |
| `GET`    | `/notes/{id}` | Get a single note by its ID.      | N/A                                               |
| `PUT`    | `/notes/{id}` | Update a note by its ID.          | `{ "content": "This is an updated note." }`       |
| `DELETE` | `/notes/{id}` | Delete a note by its ID.          | N/A                                               |

### Rate Limiting

This API implements rate limiting to ensure fair usage and prevent abuse. If you send too many requests in a short amount of time, you will receive an `HTTP 429 Too Many Requests` status code. This is expected behavior.
