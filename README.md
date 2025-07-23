
📚 Library Management System

A full-stack library management system built with **Next.js 15**, **Prisma**, **Redux Toolkit**, and **Tailwind CSS**. This system allows users to manage books, members, borrow/return activities, and more with a clean and responsive UI.

🔐 Test Credentials
Username: Hossam@hmail.com
Password: Hossam123

🚀 Features

- Modern UI with Mantine + TailwindCSS + ShadCN
- Authentication (NextAuth)
- State Management (Redux Toolkit + Optimistic Caching)
- File/Image Upload (UploadThing + Cloudinary)
- PDF Reports (React PDF)
- Filtering, Sorting, Pagination (TanStack Table)
- Date pickers, Phone inputs, Form validations
- Form Handling with react-hook-form + Zod
- Prisma ORM + PostgreSQL (or MySQL)
- Admin panel (add/edit/delete books, users, etc.)
- API routes with app/api/ in Next.js 15
- Rating System + Book Preview + BlurImage
- Fully responsive and mobile-friendly

🧠 Tech Stack

- Next.js 15: React framework for fullstack app
- Prisma ORM: Type-safe DB access
- Redux Toolkit: Global state & caching
- Tailwind CSS: Utility-first CSS
- Radix UI / ShadCN: Accessible components
- Mantine UI: UI component library
- Zod: Schema validation for forms and APIs
- Cloudinary: Media storage & optimization
- UploadThing: Secure file uploads
- Framer Motion: Animations

🛠️ Getting Started

1. Clone the repository
git clone https://github.com/yourusername/library-management.git
cd library-management

2. Install dependencies
npm install

3. Configure Environment Variables
Create a .env file in the root directory:

DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=some_secret_key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...

4. Run Prisma Migrations
npx prisma generate
npx prisma migrate dev

5. Start Development Server
npm run dev

Visit: http://localhost:3000

📦 Build & Deployment

npm run build
npm start

Use Vercel, Render, or Railway to deploy.

🧪 Test Credentials

Username: Hossam@hmail.com
Password: Hossam123

📁 Folder Structure

app/                 - Next.js 15 app dir (pages, layouts, api)
├── api/             - Backend routes
├── dashboard/       - Protected admin panel
components/          - Reusable UI components
lib/                 - Utilities (e.g., auth, db, helpers)
prisma/              - Prisma schema & seeds
public/              - Static assets (images/icons)
store/               - Redux slices and setup
styles/              - Tailwind + custom styles
hooks/               - Custom React hooks
types/               - TS types and interfaces

🤝 Contributing

1. Fork this repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

🧠 License

MIT License

📫 Contact

Made with ❤️ by Hossam
Email: Hossam@hmail.com
