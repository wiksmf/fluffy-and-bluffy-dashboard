# Fluffy and Bluffy Dashboard

A modern React-based desktop dashboard application for managing bookings, services, plans, and user accounts. Built with TypeScript, React Query, and Supabase for a robust and scalable solution.

## 🌐 Demo

**Live Site**: [https://fluffy-and-bluffy-dashboard.vercel.app/](https://fluffy-and-bluffy-dashboard.vercel.app/)

## 🚀 Features

- **Authentication System**: Secure login/logout functionality
- **Booking Management**: View, manage, and track bookings
- **Service Management**: Organize and manage services
- **Plan Management**: Handle different subscription/service plans
- **User Management**: Admin functionality for user accounts
- **Contact Management**: Manage customer contacts
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Router Dom** - Client-side routing
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Recharts** - Data visualization

### Backend & Database

- **Supabase** - Backend as a service (authentication, database, real-time)

### Development Tools

- **ESLint** - Code linting
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **TypeScript ESLint** - TypeScript-specific linting

## 📁 Project Structure

```
src/
├── context/           # React contexts (Dark Mode, etc.)
├── features/          # Feature-based modules
│   ├── authentication/
│   ├── bookings/
│   ├── confirm/
│   ├── contact/
│   ├── dashboard/
│   ├── plans/
│   ├── services/
│   └── users/
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services and Supabase client
├── styles/            # Global styles
├── types/             # TypeScript type definitions
├── ui/                # Reusable UI components
└── utils/             # Utility functions and constants
```
