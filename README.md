# Hopeless Opus

Hopeless Opus is a full-stack interactive narrative puzzle platform. It combines a visual-novel style story engine, modular minigames, authenticated team accounts, persistent game sessions, dynamic scoring, reward claiming, and live leaderboard ranking.

Developed and deployed for TechTatva 2026, the national technical festival of MIT Manipal with 460+ registered teams competing for a ₹10,000 prize pool.

The project is built as a production-ready web application with a React/Vite frontend, Express/MongoDB backend, Dockerized services, Nginx reverse proxying, and Certbot-based SSL renewal support.

## Features

- Branching narrative system with MongoDB-backed story nodes
- Visual-novel interface with dialogue typing, character sprites, scene backgrounds, choices, and animated transitions
- 20 modular React minigames loaded on demand through a centralized minigame loader
- Persistent per-user minigame sessions with timers, retries, completion state, scores, and reward status
- Server-side scoring formulas based on elapsed time, base score, retries used, and game category
- JWT authentication for team registration, login, protected profiles, story progression, and minigame sessions
- Authorized participant validation during registration
- OTP-based password reset through email
- Live leaderboard with rank calculation, pagination, top-three display, and current-user highlighting
- Player profile with team details, points, and leaderboard rank
- Contact form backed by Nodemailer
- Docker Compose deployment with separate frontend, backend, Nginx, and Certbot services

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Radix UI
- Framer Motion
- GSAP
- Axios
- Lucide React
- React Hook Form
- Zod

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- Nodemailer
- CORS
- dotenv

### Infrastructure

- Docker
- Docker Compose
- Nginx
- Certbot

## Architecture Overview

```text
hopeless-opus/
+-- client/                 # React/Vite frontend
|   +-- src/
|   |   +-- components/     # Shared UI, HUD, minigame loader, navigation
|   |   +-- Minigames/      # M1-M20 puzzle implementations
|   |   +-- pages/          # Home, auth, profile, leaderboard, game pages
|   |   +-- lib/            # API base config and minigame session hook
|   +-- Dockerfile
|   +-- nginx.conf
+-- server/                 # Express API server
|   +-- controllers/        # Route handlers and business logic
|   +-- models/             # Mongoose schemas
|   +-- routes/             # REST API route groups
|   +-- middlewares/        # JWT auth and admin guards
|   +-- story/              # Story JSON seed/reference data
|   +-- utils/              # Email and validation helpers
|   +-- Dockerfile
+-- nginx/                  # Production reverse proxy config
+-- docker-compose.yml
```

## Core Workflows

### Story Progression

Players enter the game through the visual-novel interface. The frontend fetches the current story node from the backend and renders dialogue, background imagery, speaker information, and choices. When a choice is selected, the backend updates the user's `currentStoryId` and returns the next node.

If the next story ID points to a minigame, the frontend transitions into the minigame loader. On success or failure, the backend advances the story using the configured branch for that minigame outcome.

### Minigame Sessions

Each minigame session is stored per user and per minigame. Sessions track:

- Started time
- Remaining time
- Retry count
- Completion status
- Completion timestamp
- Score
- Reward claim status

The frontend polls the session API so timers and tries remain consistent even after page refreshes. Session completion is finalized through the backend to prevent client-only score manipulation.

### Scoring and Rewards

Minigames use base scores and time-based penalties. Some minigame groups also include retry-based scoring formulas. After a successful completion, the user can claim the persisted reward, which updates their points and affects leaderboard placement.

### Leaderboard

The leaderboard sorts teams by:

1. Points, descending
2. Money, descending
3. Total minigame usage, ascending

Authenticated users can fetch leaderboard data with their current rank highlighted.
