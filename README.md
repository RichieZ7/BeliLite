# BeliLite 📝

A lightweight note-taking web application built to learn software engineering fundamentals. This project demonstrates the core concepts of full-stack development: frontend, backend, and database integration.

## 🎯 What You'll Learn

This project teaches you:

1. **Backend Development**: Building a REST API server with Node.js and Express
2. **Database Management**: Using SQLite to store and retrieve data
3. **Frontend Development**: Creating interactive user interfaces with HTML, CSS, and JavaScript
4. **API Integration**: Connecting frontend to backend using HTTP requests
5. **CRUD Operations**: Create, Read, Update, Delete - the foundation of most applications
6. **External API Integration**: Using xAI's Grok API for AI-powered text summarization

## 🏗️ Architecture Overview

```
┌─────────────┐         HTTP Requests         ┌─────────────┐
│   Browser   │ ────────────────────────────> │   Express   │
│  (Frontend) │ <──────────────────────────── │   Server    │
│             │         JSON Responses        │  (Backend)  │
└─────────────┘                                └─────────────┘
                                                       │
                                                       │ SQL Queries
                                                       ▼
                                                ┌─────────────┐
                                                │   SQLite    │
                                                │  Database   │
                                                └─────────────┘
```

### Components Explained

1. **Frontend (public/ folder)**
   - `index.html`: The structure/layout of your app
   - `style.css`: How your app looks (colors, spacing, fonts)
   - `app.js`: The logic that handles user interactions and talks to the backend

2. **Backend (server.js)**
   - Handles all data operations
   - Provides API endpoints (URLs) that the frontend calls
   - Manages the database connection

3. **Database (notes.db)**
   - Stores all your notes persistently
   - Created automatically when you first run the server

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher - required for built-in `fetch` API)
  - Download from [nodejs.org](https://nodejs.org/)
  - This gives you `npm` (Node Package Manager) which installs dependencies
- **xAI API Key** (optional, for Grok summarization feature)
  - Get your API key from [x.ai](https://x.ai/) or [console.x.ai](https://console.x.ai/)
  - Create a `.env` file in the project root (see setup below)

### Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```
   This reads `package.json` and installs:
   - `express`: Web server framework
   - `sqlite3`: Database driver
   - `cors`: Allows frontend-backend communication
   - `dotenv`: Loads environment variables from `.env` file

2. **Set up xAI API Key (for Grok summarization)**
   ```bash
   # Create a .env file in the project root
   echo "XAI_API_KEY=your-api-key-here" > .env
   ```
   - Replace `your-api-key-here` with your actual xAI API key
   - Get your API key from [x.ai](https://x.ai/) or [console.x.ai](https://console.x.ai/)
   - **Note**: The `.env` file is already in `.gitignore` - never commit your API key!
   - **Without API key**: The app will work, but the "Summarize with Grok" feature will show an error

3. **Start the server**
   ```bash
   npm start
   ```
   You should see:
   ```
   Connected to SQLite database
   Notes table ready
   BeliLite server running at http://localhost:3000
   ```

4. **Open your browser**
   - Go to `http://localhost:3000`
   - You should see the BeliLite app!

## 🐳 Docker Setup (Alternative)

Docker allows you to run your app in a containerized environment, making it easier to deploy and ensuring consistency across different machines.

### Prerequisites
- **Docker** installed ([docker.com](https://www.docker.com/get-started))
- **Docker Compose** (usually included with Docker Desktop)

### Quick Start with Docker

1. **Build and run with Docker Compose** (recommended):
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build the Docker image
   - Start the container
   - Make the app available at `http://localhost:3000`

2. **Or build and run manually**:
   ```bash
   # Build the Docker image
   docker build -t belilite .
   
   # Run the container
   docker run -p 3000:3000 \
     -v $(pwd)/data:/app/data \
     -e XAI_API_KEY=your-api-key-here \
     belilite
   ```

3. **Access the app**
   - Open `http://localhost:3000` in your browser

### Docker Commands

- **Stop the container**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Rebuild after changes**: `docker-compose up --build`
- **Run in background**: `docker-compose up -d`

### Environment Variables in Docker

**📖 For detailed instructions, see [DOCKER_API_KEY_SETUP.md](./DOCKER_API_KEY_SETUP.md)**

**Quick Setup (Recommended):**

1. **Create a `.env` file** in the project root:
   ```bash
   XAI_API_KEY=your-xai-api-key-here
   XAI_API_URL=https://api.x.ai/v1/chat/completions
   ```

2. **Start Docker** - Docker Compose automatically reads `.env`:
   ```bash
   docker-compose up --build
   ```

**Other Methods:**
- Set in `docker-compose.yml` (not recommended - exposes key in file)
- Pass via command line: `XAI_API_KEY=key docker-compose up`
- Set as system environment variables

See [DOCKER_API_KEY_SETUP.md](./DOCKER_API_KEY_SETUP.md) for all methods and troubleshooting.

### Database Persistence

The database is stored in the `./data` directory, which is mounted as a volume. This means your notes persist even if you stop/remove the container.

## 📚 Key Concepts Explained

### 1. REST API Endpoints

Your backend provides these endpoints (think of them as "doors" to access data):

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `POST /api/summarize` - Summarize text using xAI's Grok (requires API key)

### 2. HTTP Methods

- **GET**: Retrieve data (read-only, safe)
- **POST**: Create new data
- **PUT**: Update existing data
- **DELETE**: Remove data

### 3. JSON (JavaScript Object Notation)

The format used to send data between frontend and backend:
```json
{
  "id": 1,
  "title": "My Note",
  "content": "This is the note content",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### 4. Async/Await

JavaScript operations that take time (like API calls) are "asynchronous". The `async/await` syntax makes it easier to handle:
```javascript
async function loadNotes() {
  const response = await fetch('/api/notes'); // Wait for response
  const notes = await response.json(); // Wait for JSON conversion
  return notes;
}
```

### 5. Database Schema

The `notes` table has these columns:
- `id`: Unique identifier (auto-incremented)
- `title`: Note title (required)
- `content`: Note content (optional)
- `created_at`: When note was created
- `updated_at`: When note was last modified

### 6. External API Integration (xAI Grok)

The app integrates with xAI's Grok API to provide AI-powered text summarization:

- **How it works**: User writes text → clicks "Summarize with Grok" → Backend calls xAI API → Summary replaces original text
- **API Endpoint**: `POST /api/summarize` - Takes text, returns AI-generated summary
- **Security**: API key stored in `.env` file (never committed to git)
- **Error Handling**: Gracefully handles API errors, rate limits, and missing API keys
- **Model**: Uses `grok-beta` model from xAI

## 🛠️ Project Structure

```
BeliLite/
├── server.js          # Backend server (Express API)
├── package.json        # Project dependencies and scripts
├── notes.db           # SQLite database (created automatically)
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # HTML structure
    ├── style.css      # Styling
    └── app.js         # Frontend logic
```

## 🎓 Learning Path

### Beginner Level (You are here!)
- Understand how frontend and backend communicate
- Learn basic CRUD operations
- See how databases store data

### Next Steps to Explore

1. **Add Features**
   - Search/filter notes
   - Tags/categories
   - Markdown support
   - Note sharing

2. **Improve Security**
   - Input validation
   - Authentication (user login)
   - Rate limiting

3. **Enhance UI/UX**
   - Dark mode
   - Responsive design (mobile-friendly)
   - Animations

4. **Deploy to Production**
   - Use a cloud database (PostgreSQL)
   - Deploy backend (Heroku, Railway, etc.)
   - Deploy frontend (Netlify, Vercel, etc.)

## 🔍 Understanding the Code Flow

### Creating a Note

1. User fills out form and clicks "Save Note"
2. `app.js` intercepts form submission
3. Frontend sends POST request to `/api/notes` with note data
4. Backend receives request, validates data
5. Backend inserts data into SQLite database
6. Backend returns the created note
7. Frontend reloads the notes list to show the new note

### Editing a Note

1. User clicks "Edit" on a note
2. Frontend fetches the note data
3. Form is populated with existing data
4. User modifies and saves
5. Frontend sends PUT request to `/api/notes/:id`
6. Backend updates the database
7. Frontend reloads the notes list

## 🐛 Troubleshooting

**Server won't start?**
- Make sure Node.js is installed: `node --version`
- Make sure dependencies are installed: `npm install`

**Can't see notes?**
- Check that the server is running
- Open browser console (F12) to see errors
- Make sure you're accessing `http://localhost:3000`

**Database errors?**
- Delete `notes.db` and restart the server (it will recreate)

## 📖 Resources for Further Learning

- [MDN Web Docs](https://developer.mozilla.org/) - Excellent reference for HTML, CSS, JavaScript
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - Backend framework documentation
- [SQLite Tutorial](https://www.sqlitetutorial.net/) - Database concepts
- [REST API Tutorial](https://restfulapi.net/) - Understanding APIs

## 🎯 Interview Prep Tips

When discussing this project in interviews:

1. **Explain the architecture**: Frontend → Backend → Database flow
2. **Discuss trade-offs**: Why SQLite? (Simple, file-based, good for learning)
3. **Mention scalability**: "For production, I'd use PostgreSQL and add caching"
4. **Security considerations**: "I'd add input validation, authentication, and HTTPS"
5. **Testing**: "I'd add unit tests for the API and integration tests for the full stack"

## 📝 License

MIT

---

**Happy Learning!** 🚀

If you have questions or want to extend this project, feel free to experiment and explore!
