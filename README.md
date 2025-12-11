# Engineering website for orders - Modern Next.js Application

![Next.js](https://img.shields.io/badge/Next.js-16.0.8-000000?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-7.0.0-2D3748?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)

A modern full-stack application built with Next.js, React 19, Prisma ORM, and TypeScript, featuring advanced developer tooling and best practices.

## ✨ Features

- ⚡ Next.js 16 with React 19
- 🗄️ Prisma ORM with PostgreSQL/MySQL support
- 🔐 NextAuth.js for authentication
- 🧰 Redux Toolkit for state management
- 🎨 MUI (Material-UI) for components
- 📝 React Hook Form with Zod validation
- 🛠️ Comprehensive developer tooling:
  - ESLint + Prettier
  - Lint-staged
  - Knip for dead code detection
  - Webpack Bundle Analyzer

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/my-app.git
cd my-app
```

2. Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env
Edit .env with your database credentials and other settings.
```

3. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Development

```bash
npm run dev
Open http://localhost:3000 in your browser.
```

5. Production Build

```bash
npm run build
npm start
```
