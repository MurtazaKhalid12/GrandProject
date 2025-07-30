# 📄 Product Requirements Document (PRD)

## 🧠 Project Name: AI Recipe Generator

### 📋 Overview
The AI Recipe Generator is a full-stack web application that helps users generate recipes based on the ingredients they have. Users log in using a magic email link, enter a list of ingredients, and the app uses AI (via n8n) to generate a detailed recipe. Users can view, save, and revisit recipes later.

---

## 🎯 Goals

- Simplify cooking by recommending recipes based on what users already have.
- Leverage AI to create personalized and creative recipe ideas.
- Store user history and allow for recipe saving/favoriting.

---

## 🔧 Core Features

1. **User Authentication**
   - Email login with magic link (Supabase Auth).

2. **Recipe Input Form**
   - User types available ingredients into a text field.

3. **AI Recipe Generation**
   - n8n workflow formats the ingredients and sends to an AI model.
   - Returns recipe title, steps, cooking time, and optional image URL.

4. **Recipe Display**
   - Rendered clearly with steps, time, and image.
   - Save button to mark as a favorite.

5. **Saved Recipes View**
   - User can see past saved recipes.
   - Data fetched from Supabase.

---

## 🧑‍💻 Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | Next.js + TailwindCSS + ShadCN UI         |
| Backend   | Supabase (Auth + Postgres) + MongoDB Atlas|
| AI Logic  | n8n workflow using Groq/OpenAI             |
| Hosting   | Vercel (CI/CD via GitHub)                 |

---

## 🧭 User Journey

1. User opens app and logs in using email magic link.
2. On dashboard, user types ingredients (e.g., "eggs, tomatoes, spinach").
3. The app calls n8n which sends the prompt to an AI model.
4. AI returns a recipe which is displayed on the screen.
5. User clicks “Save Recipe” to store it.
6. User can access saved recipes via a sidebar or profile page.

---

## 🖼 Wireframe Screens

_(To be added manually or linked from Figma/Excalidraw)_

- Login Screen
- Ingredient Input / Dashboard
- Recipe Display Screen
- Saved Recipes Page

---

## 🗃 Database Schema

### Supabase Table: `recipes`

| Field           | Type         | Description                     |
|----------------|--------------|---------------------------------|
| id             | UUID         | Primary key                     |
| user_id        | UUID         | Linked to Supabase Auth user    |
| ingredients    | Text         | Raw input from user             |
| recipe_text    | Text         | Final AI-generated recipe       |
| created_at     | Timestamp    | Auto-generated timestamp        |

### MongoDB Collection: `recipes_ai`

Stores:
- full AI prompt/response
- optional image URLs
- response metadata for debugging

---

## 🔐 Authentication

- Email magic link login via Supabase Auth
- User session stored via Supabase client SDK

---

## 🔄 AI Integration (via n8n)

- Webhook node receives ingredients
- Code node builds a prompt:  
  _"Create a recipe using these ingredients: eggs, spinach, cheese..."_
- Groq/OpenAI returns a full recipe
- Response saved to Supabase and/or MongoDB

---

## ✅ Success Criteria

- Users can log in using email magic link
- Entering ingredients returns a creative recipe
- Recipes can be saved and viewed later
- Public deployment on Vercel

---

## 📅 Milestone Tracking

| Mi# 📄 Product Requirements Document (PRD)

## 🧠 Project Name: AI Recipe Generator

### 📋 Overview
The AI Recipe Generator is a full-stack web application that helps users generate recipes based on the ingredients they have. Users log in using a magic email link, enter a list of ingredients, and the app uses AI (via n8n) to generate a detailed recipe. Users can view, save, and revisit recipes later.

---

## 🎯 Goals

- Simplify cooking by recommending recipes based on what users already have.
- Leverage AI to create personalized and creative recipe ideas.
- Store user history and allow for recipe saving/favoriting.

---

## 🔧 Core Features

1. **User Authentication**
   - Email login with magic link (Supabase Auth).

2. **Recipe Input Form**
   - User types available ingredients into a text field.

3. **AI Recipe Generation**
   - n8n workflow formats the ingredients and sends to an AI model.
   - Returns recipe title, steps, cooking time, and optional image URL.

4. **Recipe Display**
   - Rendered clearly with steps, time, and image.
   - Save button to mark as a favorite.

5. **Saved Recipes View**
   - User can see past saved recipes.
   - Data fetched from Supabase.

---

## 🧑‍💻 Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | Next.js + TailwindCSS + ShadCN UI         |
| Backend   | Supabase (Auth + Postgres) + MongoDB Atlas|
| AI Logic  | n8n workflow using Groq/OpenAI             |
| Hosting   | Vercel (CI/CD via GitHub)                 |

---

## 🧭 User Journey

1. User opens app and logs in using email magic link.
2. On dashboard, user types ingredients (e.g., "eggs, tomatoes, spinach").
3. The app calls n8n which sends the prompt to an AI model.
4. AI returns a recipe which is displayed on the screen.
5. User clicks “Save Recipe” to store it.
6. User can access saved recipes via a sidebar or profile page.

---

## 🖼 Wireframe Screens

_(To be added manually or linked from Figma/Excalidraw)_

- Login Screen
- Ingredient Input / Dashboard
- Recipe Display Screen
- Saved Recipes Page

---

## 🗃 Database Schema

### Supabase Table: `recipes`

| Field           | Type         | Description                     |
|----------------|--------------|---------------------------------|
| id             | UUID         | Primary key                     |
| user_id        | UUID         | Linked to Supabase Auth user    |
| ingredients    | Text         | Raw input from user             |
| recipe_text    | Text         | Final AI-generated recipe       |
| created_at     | Timestamp    | Auto-generated timestamp        |

### MongoDB Collection: `recipes_ai`

Stores:
- full AI prompt/response
- optional image URLs
- response metadata for debugging

---

## 🔐 Authentication

- Email magic link login via Supabase Auth
- User session stored via Supabase client SDK

---

## 🔄 AI Integration (via n8n)

- Webhook node receives ingredients
- Code node builds a prompt:  
  _"Create a recipe using these ingredients: eggs, spinach, cheese..."_
- Groq/OpenAI returns a full recipe
- Response saved to Supabase and/or MongoDB

---

## ✅ Success Criteria

- Users can log in using email magic link
- Entering ingredients returns a creative recipe
- Recipes can be saved and viewed later
- Public deployment on Vercel

---

## 📅 Milestone Tracking

| Milestone              | Date    | Folder                       |
|------------------------|---------|------------------------------|
| PRD + Wireframes       | Day 15  | `/grand-project/docs/`      |
| Backend + DB setup     | Day 18  | `/grand-project/api/`       |
| Frontend UI            | Day 21  | `/grand-project/app/`       |
| AI logic + testing     | Day 24  | `/grand-project/ai/`        |
| Public demo live       | Day 27  | —                            |
| Docs + Loom walkthrough| Day 29  | `README.md` (root directory) |

---
lestone              | Date    | Folder                       |
|------------------------|---------|------------------------------|
| PRD + Wireframes       | Day 15  | `/grand-project/docs/`      |
| Backend + DB setup     | Day 18  | `/grand-project/api/`       |
| Frontend UI            | Day 21  | `/grand-project/app/`       |
| AI logic + testing     | Day 24  | `/grand-project/ai/`        |
| Public demo live       | Day 27  | —                            |
| Docs + Loom walkthrough| Day 29  | `README.md` (root directory) |

---
