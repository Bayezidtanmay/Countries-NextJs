# 🌍 Countries Explorer

An elegant and interactive web app that lets you explore countries from around the world — complete with profiles, favorites, filters, and authentication powered by **Supabase**.  
Built with **Next.js**, this app offers a clean UI, smooth user experience, and real-time updates to your personal profile and preferences.

---

## ✨ Features

### 🗺 Explore Countries
- Browse through all countries of the world with detailed information.  
- Search by **name**, **capital**, or **currency**.  
- Sort countries alphabetically or by **population**.

### ❤️ Favorites
- Mark any country as a favorite and easily toggle between **all countries** and **your favorites**.  
- Favorite data is stored securely in Supabase for each authenticated user.

### 👤 User Profiles
- Each user has their own **profile section** with:
  - Avatar upload (stored in Supabase Storage)
  - Display name, username, and bio
  - Instant avatar preview after upload
  - Edit and update profile details seamlessly
- A polished profile UI with a floating close button to return to the dashboard.

### 🔒 Authentication
- Secure authentication and session management powered by **Supabase Auth**.
- Users can **log in, log out**, and have their data persist across sessions.

### ⚙️ Dashboard
- A dynamic dashboard showing:
  - Profile summary (avatar, display name, and bio)
  - Search and filter controls
  - A responsive grid of country cards
- Smooth layout alignment and elegant design.

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | [Next.js](https://nextjs.org/), React, Redux Toolkit |
| **Backend / Database** | [Supabase](https://supabase.com/) |
| **Styling** | Tailwind CSS + Global Styles |
| **Storage** | Supabase Storage (for user avatars) |
| **Auth** | Supabase Auth |
| **State Management** | Redux Toolkit |

---

## 🗃️ Supabase Setup

This project uses Supabase for:
1. **Authentication** – user login, logout, and session management.  
2. **Database** – user profile storage and favorites management.  
3. **Storage** – user avatar uploads.

### 🧩 Tables & Schema

#### `user_profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users.id` |
| `username` | `text` | User’s unique name |
| `display_name` | `text` | Display name shown publicly |
| `bio` | `text` | Short description |
| `avatar_url` | `text` | Public URL of the uploaded avatar |
| `updated_at` | `timestamp` | Auto-updated timestamp |

#### `favorites`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users.id` |
| `country_id` | `text` | ISO country code (e.g., "FRA", "USA") |

---
