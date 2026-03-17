# Producto - Productivity Tracker

A productivity app that helps you track your work sessions, monitor energy levels, and optimize your workday.

Built as a school project for Chas Academy (React, TypeScript & React Native course).

---

## 📸 Screenshots

### Login

![Login](./docs/screenshots/login.png)

### Dashboard

![Dashboard](./docs/screenshots/dashboard.png)

### Timer

![Timer](./docs/screenshots/timer.png)

### Energy Tracking

![Energy](./docs/screenshots/energy.png)

### Insights

![Insights](./docs/screenshots/insights.png)

### Settings

![Settings](./docs/screenshots/settings.png)

---

## ✨ Features

- ⏱️ **Timer** - Track work sessions with three modes (Work, Meeting, Break)
- 📊 **Energy Tracking** - Log your energy levels throughout the day
- 📈 **Analytics** - See your productivity stats and trends
- 📅 **Calendar** - View and schedule activities
- 🌙 **Dark Mode** - Switch between light and dark themes
- 🔐 **User Authentication** - Secure login and signup
- ⚙️ **Settings** - Customize timer durations and preferences

---

## 🛠️ Tech Stack

**Frontend:**

- React
- TypeScript
- CSS Modules
- Context API
- React Router

**Backend:**

- Node.js + Express
- TypeScript
- Supabase (database & authentication)

**Testing:**

- Jest
- React Testing Library

---

## 📦 Installation

### Prerequisites

- Node.js
- npm
- Supabase account

### Steps

1. **Clone the repo**

```bash
   git clone https://github.com/malmo2/producto.git
   cd producto
```

2. **Install frontend dependencies**

```bash
   cd producto
   npm install
```

3. **Install backend dependencies**

```bash
   cd ../backend
   npm install
```

4. **Set up environment variables**

   Create `.env` in the backend folder:

```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   PORT=3000
```

Create `.env` in the producto folder:

```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_API_URL=http://localhost:3000
```

5. **Start the backend**

```bash
   cd backend
   npm run dev
```

6. **Start the frontend** (in a new terminal)

```bash
   cd producto
   npm run dev
```

7. **Open in browser**

```
   http://localhost:5173
```

---

## 🎯 How to Use

1. **Sign up** - Create an account
2. **Start timer** - Choose a focus mode and click Start
3. **Log energy** - Record how you're feeling
4. **View insights** - Check your productivity stats
5. **Customize settings** - Adjust timer durations and toggle dark mode

---

## 📁 Project Structure

```
producto/
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth middleware
│   │   └── lib/         # Supabase client
│   └── package.json
│
├── producto/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Context providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── utils/       # Helper functions
│   └── package.json
│
└── README.md
```

---

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

---

## 👥 Team

This project was built by a team of 5 students at Chas Academy:

- [Emelie] -
- [Mattias] -
- [Johannes] -
- [Benjame] -
- [Idris] -

We followed Agile/Scrum methodology with 2-week sprints.

---

## 📚 What We Learned

- Building full-stack applications with React and TypeScript
- Managing state with Context API
- Creating custom hooks for reusable logic
- Working with Supabase for backend
- Writing tests with Jest
- Collaborating with Git and GitHub
- Following Agile development practices

---

## 🐛 Known Issues

- React Native mobile app not yet implemented (wireframes completed, implementation planned for future)
- Some analytics charts need more data to display properly

---

**Built with React, TypeScript, and lots of coffee ☕**
