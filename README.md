# Khata Book

Khata Book is a digital ledger application designed to help individuals and businesses easily manage financial transactions, credits, and debits. The project is structured with a modern React frontend and a robust Node.js/Express backend, offering a full-stack solution for secure and efficient bookkeeping.

## Project Structure

- **back-end/**: Node.js (Express) API server with MongoDB integration, user authentication, transaction management, and email notifications.
- **front-end/**: React application (built with Vite) featuring an intuitive UI for managing transactions, user profiles, and summaries.

## Features

- User authentication with JWT tokens
- Create, read, update, and delete (CRUD) transactions
- Financial summaries and transaction filtering
- Email notifications for important events
- Responsive, mobile-first design
- Protected routes for authenticated users

## Getting Started

### Prerequisites

- Node.js v16+
- MongoDB Atlas account or local MongoDB instance
- Gmail account for email notifications

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vi5halsingh/khata-book.git
    ```
2. Follow setup instructions in each subdirectory:
    - [Backend Setup](back-end/README.md)
    - [Frontend Setup](front-end/README.md)

## License

This project is licensed under the MIT License.

---

For detailed API documentation and advanced setup, please refer to the individual README files in the `back-end` and `front-end` folders.
