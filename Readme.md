# Meeting Room Booking System (Backend)

A NodeJs-based meeting room booking system with authentication, room management, and booking conflict resolution.

## Technical Stack
- **Authentication**: Clerk
- **Database ORM**: Prisma (MongoDB)
- **Image Upload**: imgbb
- **Deployment**: Render

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/[your-username]/room-booking-server.git
cd room-booking-server

npm install

cp .env.example .env.local
# Database
DATABASE_URL="mysql://user:password@localhost:3306/db_name"

npm run dev