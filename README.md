# Customer Registry Management System

A full-stack MERN customer support and complaint management platform with three roles —
**Customer**, **Agent**, and **Admin** — built with a glassmorphism / gradient SaaS UI.

---

## 1. Tech Stack

**Frontend:** React + Vite, React Router DOM, Tailwind CSS, Axios, React Icons, Framer Motion,
Context API, react-toastify, Chart.js (via react-chartjs-2)

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcryptjs, multer, dotenv, cors

> Note on two deliberate substitutions from the original spec:
> - **bcryptjs** instead of `bcrypt` — identical API, but pure JavaScript so it installs
>   anywhere without native build tools. Swap it for `bcrypt` if you prefer; only the
>   import in `User.js` changes.
> - **multer v2** instead of v1 — v1.x has known vulnerabilities; v2's API is the same
>   for everything used here.

---

## 2. Folder Structure

```
customer-care/
├── server/
│   ├── index.js                 # Express entry point
│   ├── seed.js                  # Seeds categories + a default admin
│   ├── package.json
│   ├── .env.example
│   ├── uploads/                 # Complaint attachments land here
│   └── src/
│       ├── config/db.js
│       ├── models/              # User, Customer, Agent, Category, Complaint, Message, Notification
│       ├── controllers/
│       ├── routes/
│       ├── middleware/          # auth.js (JWT + roles), errorHandler.js, upload.js
│       ├── services/            # notificationService.js
│       └── utils/               # generateToken, responseFormatter, validators
│
└── client/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── main.jsx / App.jsx / index.css
        ├── context/             # AuthContext, ThemeContext, ToastContext
        ├── hooks/                # useAuth, useFetch
        ├── services/             # api.js + one service per resource
        ├── routes/               # AppRoutes.jsx, ProtectedRoute.jsx
        ├── layouts/              # DashboardLayout, AuthLayout
        ├── components/           # Navbar, Sidebar, ComplaintTable, ChatBox, etc.
        └── pages/                # Landing, Login, Dashboard, Complaints, admin/*, ...
```

---

## 3. Installation

From the `customer-care` folder:

```bash
# Backend
cd server
npm install
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET

# Frontend
cd ../client
npm install
cp .env.example .env     # default already points at localhost:5000/api
```

---

## 4. MongoDB Setup

Any of these work — just put the connection string in `server/.env` as `MONGO_URI`:

- **Local MongoDB:** install MongoDB Community Server, then `MONGO_URI=mongodb://127.0.0.1:27017/customer_registry`
- **MongoDB Atlas (free tier):** create a cluster, add a database user, allow your IP,
  and copy the connection string into `MONGO_URI`.

Then seed default categories + an admin account:

```bash
cd server
node seed.js
```

This creates:
- 5 categories: Billing, Technical Support, Account, Product Feedback, Other
- Admin login → **admin@customerregistry.com / Admin@123** (change the password after first login)

---

## 5. Run Commands

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173`. Register as a **customer** or **agent** from the landing page,
or log in as the seeded admin to assign agents and manage categories.

---

## 6. API Routes

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET/PUT | `/api/auth/profile` | Authenticated |
| GET | `/api/customers` | Admin |
| PUT | `/api/customers/:id` | Self or Admin |
| GET | `/api/agents` | Admin |
| PUT | `/api/agents/:id` | Self or Admin |
| POST | `/api/complaints` | Customer |
| GET | `/api/complaints` | Authenticated (scoped by role) |
| GET/PUT/DELETE | `/api/complaints/:id` | Owner / Assigned Agent / Admin |
| POST/GET | `/api/messages` | Authenticated, complaint participants only |
| GET/PUT | `/api/notifications` | Authenticated |
| GET/POST/PUT/DELETE | `/api/categories` | Read: all · Write: Admin |
| GET/POST/PUT/DELETE | `/api/users` | Admin |
| GET | `/api/users/analytics` | Admin |

All protected routes expect `Authorization: Bearer <token>`.

---

## 7. How a Complaint Flows

1. **Customer** raises a complaint (title, description, category, priority, optional attachment).
2. **Admin** assigns it to an agent from the complaint detail page.
3. **Agent** updates status (`open → in_progress → resolved/closed`) and chats with the customer.
4. **Customer** sees status changes via in-app notifications and leaves feedback once resolved.

Every status change is appended to the complaint's `timeline`, so the full history is always visible.

---

## 8. Testing Checklist

- [ ] Register as a customer, then as an agent — confirm role-based dashboards differ
- [ ] Log in as the seeded admin — confirm access to Manage Users / Agents / Categories
- [ ] Raise a complaint with and without an attachment
- [ ] Admin assigns the complaint to an agent — confirm the agent gets a notification
- [ ] Agent changes status — confirm the customer gets a notification and sees the new timeline entry
- [ ] Open chat from the complaint detail page on both customer and agent accounts, send messages both ways
- [ ] Customer submits feedback after the complaint is marked resolved
- [ ] Search and filter on the Complaints list (status, priority, text search) + pagination
- [ ] Toggle dark mode from Settings — confirm it persists on reload
- [ ] Hit a protected route while logged out — confirm redirect to `/login`
- [ ] Hit `/admin/users` as a customer — confirm redirect to `/dashboard`
- [ ] Resize to mobile width — confirm sidebar collapses into a drawer

---

## 9. Notes on Design Decisions

- **Chat** is implemented via REST + 8-second polling rather than WebSockets/Socket.IO —
  the original spec didn't mandate a real-time transport, and polling keeps the stack
  exactly as specified. Swapping in Socket.IO later only touches `ChatBox.jsx` and a new
  `socket.js` service.
- **Glassmorphism + gradient system** lives almost entirely in `index.css` as Tailwind
  `@layer components` (`.glass-card`, `.btn-primary`, `.gradient-text`, etc.), so the look
  is consistent without repeating utility classes everywhere.
- The production build was verified locally (`npm run build` succeeds, ~195 KB gzipped JS).
  For a larger app you'd eventually want to route-split with `React.lazy`, but it wasn't
  necessary at this scope.
