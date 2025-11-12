# Khata Book

A simple, practical digital ledger (khata) app for managing income and expenses. This repository contains a full-stack application: a Node.js + Express backend (MongoDB) and a Vite + React frontend. The goal is to keep bookkeeping simple and provide tools to view, filter, and manage transactions.

This README is written in plain language for team members who will develop, test, and extend the project.

## Quick overview

- Backend: `back-end/` — Express API, MongoDB models, authentication, email notifications.
- Frontend: `front-end/` — React (Vite), Tailwind-style utility classes, pages and components for UI.

## What you can do with the app

- Register/login users (JWT-based authentication).
- Create, read, update, delete transactions (income & expense).
- Mark transactions as favorite.
- Filter and summarize transactions (summary shows totals).
- Contact via a contact form which sends emails (Gmail SMTP).

## Repo structure (high level)

- `/back-end` — server code
    - `server.js` — app entry, middleware, route mounting
    - `config/db.js` — mongoose connection (uses `MONGO_URI`)
    - `Routes/` — `User.Routes.js`, `Transaction.Routes.js`
    - `Controller/` — business logic (user and transaction handlers)
    - `Models/` — `User.Model.js`, `Transaction.Model.js`
    - `services/EmailSender.js` — helper to send emails via Gmail

- `/front-end` — UI code
    - `src/pages` — main pages (Home, SeeRecord, etc.)
    - `src/components` — reusable components (RecordList, AddNewTransection, AIChatBot)
    - `src/utils/axiosConfig.js` — axios instance (if used)

## Important files and where to look

- API routes: `back-end/Routes/*.js`
    - Users: mounted at `/api/users` — registration, login, profile, logout, contact, google-login, delete
    - Transactions: mounted at `/api/transactions` — standard CRUD + `/summary`

- Data models: `back-end/Models`
    - `User.Model.js` — fields: name, email, mobileNo, password (hashed), isGoogleUser, googleId, picture
    - `Transaction.Model.js` — fields: user (ref), amount, description, type (income|expense), favorite, date

- Frontend entry: `front-end/src/main.jsx` and routing in `front-end/src/App.jsx`.

## Environment variables (examples)

Create a `.env` file in `back-end/` with these variables (example values shown):

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/khata-book?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=youremail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

On the frontend, create a `.env` or use Vite environment vars. Example for `front-end/.env` (or set locally):

```
VITE_API_BASE_URL=http://localhost:3000
```

Note: Tailor the URLs for production deployments.

## How to run locally (Windows PowerShell examples)

1) Start backend

```powershell
cd back-end
npm install
npm run dev
```

2) Start frontend

```powershell
cd front-end
npm install
npm run dev
```

Open the frontend (Vite) URL (usually `http://localhost:5173`) and ensure `VITE_API_BASE_URL` points to your backend.

## API summary (common endpoints)

Authentication & user (base `/api/users`):

- POST `/api/users/register` — register new user
- POST `/api/users/login` — login and receive token
- POST `/api/users/logout` — logout (clears server session/cookie)
- POST `/api/users/google-login` — google oauth sign-in
- GET `/api/users/profile` — get authenticated user profile (protected)
- PUT `/api/users/profile/update` — update profile (protected)
- POST `/api/users/contact` — contact/send email (protected)
- POST `/api/users/deleteUser` — delete user (protected)

Transactions (base `/api/transactions`, protected by auth middleware):

- POST `/api/transactions` — create transaction
- GET `/api/transactions` — list transactions (supports filters via query params)
- GET `/api/transactions/summary` — get totals (income, expense, balance)
- GET `/api/transactions/:id` — get single transaction
- PUT `/api/transactions/:id` — update transaction
- DELETE `/api/transactions/:id` — delete transaction

How authentication is used:
- Frontend stores a token in localStorage under `authToken` and sends it in the `Authorization` header for protected endpoints. Some requests also include `credentials: 'include'` to support cookies.

## Data shape examples

User (example):

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "mobileNo": 9876543210
}
```

Transaction (example request body to create):

```json
{
    "amount": 500,
    "description": "Groceries",
    "type": "expense"
}
```

Response shapes follow common REST patterns and usually return { success: boolean, data: ... } or error messages.

## Frontend notes

- Frontend uses Vite and React (React 19+). Routes are configured in `src/App.jsx`.
- `front-end/src/components/AIChatBot.jsx` is a UI-only chatbot component added to the SeeRecord page. It currently simulates responses locally — to enable AI features, create a backend `/api/ai/chat` endpoint and connect the component to it.
- The main transaction UI is `RecordList.jsx` which fetches transactions using `VITE_API_BASE_URL` and expects the token in `Authorization` header.

## Development workflow & conventions

- Branches: use feature branches off `test` or `main` (follow repo-specific policy).
- Commits: short imperative messages; include a descriptive body for complex changes.
- Code style: follow existing patterns (functional React components, hooks). The project uses plain JS with some Tailwind-like classes.

## Tests and linting

- There are no automated tests committed in the repo currently. Add unit tests for controllers and components as needed.
- Frontend has an ESLint config; run `npm run lint` in `front-end` to check code style.

## Common troubleshooting

- If database connection fails: verify `MONGO_URI` and network access (allow IP in MongoDB Atlas).
- If email sending fails: ensure `EMAIL_USER` + `EMAIL_APP_PASSWORD` are correct and app password is enabled for Gmail.
- If CORS errors occur: confirm `VITE_API_BASE_URL` matches a whitelisted origin in `server.js` CORS config.

## Future work / AI Chatbot integration

To make the chatbot actually analyze transactions:
1. Add a backend route such as POST `/api/ai/chat` that accepts user message and authenticated user.
2. Backend should read the user's transactions from DB, build a context prompt, and call an AI provider (OpenAI, etc.) to generate responses.
3. Return the model response to the frontend; update `AIChatBot.jsx` to call that endpoint instead of the current simulated reply.

Files to look at for chatbot work:
- `front-end/src/components/AIChatBot.jsx` — UI and send logic (currently simulated)
- `back-end/Controller/*` — add `AIController.js` and route `/api/ai`

## Contribution

1. Fork/branch the repo.
2. Create a feature branch `feature/your-feature`.
3. Open a PR describing the change and testing instructions.

## Contacts & ownership

- Repo owner: vi5halsingh
- For questions about backend API or data models, check `back-end/Controller` and `back-end/Models`.

---

If you want, I can also:
- Create a small `back-end/README.md` and `front-end/README.md` with focused setup steps per folder.
- Scaffold the `POST /api/ai/chat` endpoint and a minimal controller that returns a dummy response so the chatbot becomes functional end-to-end.

Let me know what you prefer.
