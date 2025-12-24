# LiveConnect – Real-Time Chat Application

LiveConnect is a full-stack real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) and WebSockets. It enables users to communicate in real-time through private and group chats, share media and files, and maintain persistent chat history.

---

##  Features

- User Authentication (Signup & Login using JWT)
- Real-time messaging using Socket.IO
- Private one-to-one chat
- Group chat creation and messaging
- Online user status indicator
- Persistent message storage using MongoDB
- Profile photo upload
- Media sharing (images and PDF files up to 10MB using Cloudinary)
- Responsive UI (Mobile and Desktop)

---

## 🛠 Tech Stack

Frontend:
- React
- Zustand (State management)
- Tailwind CSS

Backend:
- Node.js
- Express.js
- Socket.IO

Database:
- MongoDB Atlas

Media Storage:
- Cloudinary

---

##  Project Setup

###  Clone the repository
```bash
git clone https://github.com/Prudhvi-01/smartwinr_assignment.git
cd liveconnect-chat-app
```

---

###  Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

---

###  Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

##  How to Test

1. Open two browsers or two incognito tabs
2. Register two users
3. Start a private chat
4. Create a group and add members
5. Send messages and files (images or PDFs)
6. Observe real-time updates

---

##  ScreenShots:

<img width="1920" height="1200" alt="Screenshot 2025-12-24 132030" src="https://github.com/user-attachments/assets/1a858616-6835-4325-aba2-f70b535bb77a" />
<img width="1919" height="1199" alt="Screenshot 2025-12-24 131953" src="https://github.com/user-attachments/assets/bb53afd1-94e9-47f2-a306-48dcd975fa0b" />
<img width="1919" height="1199" alt="Screenshot 2025-12-24 131847" src="https://github.com/user-attachments/assets/97ad9c85-bcb2-4f69-b566-9021cf6dd43a" />



##  Notes

This project was developed as part of a Real-Time Chat Application assignment to demonstrate WebSocket-based communication, database persistence, and full-stack development using MERN stack.

