# Docker Guide for BeliLite

This guide will help you test your Docker setup and ensure everything works correctly.

## 🧪 Testing Your Docker Setup

### Step 1: Build the Docker Image

```bash
docker build -t belilite .
```

This creates a Docker image named "belilite" from your Dockerfile.

**Expected output:**
- Docker will download the Node.js base image
- Install dependencies
- Copy your application files
- Create the final image

### Step 2: Test with Docker Compose (Recommended)

```bash
# Create data directory for database persistence
mkdir -p data

# Build and start the container
docker-compose up --build
```

**What to check:**
- ✅ Container starts without errors
- ✅ You see "Connected to SQLite database" in logs
- ✅ You see "Notes table ready" in logs
- ✅ Server is running on port 3000

### Step 3: Test the Application

1. **Open your browser**: Go to `http://localhost:3000`
2. **Create a note**: Add a title and content, click "Save Note"
3. **Verify it works**: The note should appear in the list
4. **Test summarization** (if you have xAI API key):
   - Write some text
   - Click "Summarize with Grok"
   - Text should be replaced with a summary

### Step 4: Verify Database Persistence

1. **Stop the container**: Press `Ctrl+C` or run `docker-compose down`
2. **Check the data directory**: `ls -la data/` should show `notes.db`
3. **Start again**: `docker-compose up`
4. **Verify**: Your notes should still be there!

### Step 5: Clean Up (Optional)

```bash
# Stop and remove containers
docker-compose down

# Remove the image (optional)
docker rmi belilite

# Remove data (optional - this deletes your notes!)
# rm -rf data/
```

## 🐛 Troubleshooting

### Port Already in Use

If you get "port 3000 already in use":
```bash
# Option 1: Stop other services using port 3000
# Option 2: Change port in docker-compose.yml:
ports:
  - "3001:3000"  # Access at http://localhost:3001
```

### Database Permission Errors

If you see database permission errors:
```bash
# Make sure data directory exists and is writable
mkdir -p data
chmod 755 data
```

### Container Won't Start

Check the logs:
```bash
docker-compose logs
```

Common issues:
- Missing environment variables
- Port conflicts
- Database path issues

### Rebuild After Code Changes

If you change your code:
```bash
docker-compose up --build
```

The `--build` flag rebuilds the image with your latest changes.

## 📦 Docker Commands Cheat Sheet

```bash
# Build image
docker build -t belilite .

# Run container
docker run -p 3000:3000 belilite

# Run with environment variable
docker run -p 3000:3000 -e XAI_API_KEY=your-key belilite

# Run with volume (database persistence)
docker run -p 3000:3000 -v $(pwd)/data:/app/data belilite

# View running containers
docker ps

# View logs
docker logs belilite-app

# Stop container
docker stop belilite-app

# Remove container
docker rm belilite-app

# Remove image
docker rmi belilite

# Docker Compose commands
docker-compose up          # Start
docker-compose up -d        # Start in background
docker-compose down         # Stop
docker-compose logs -f      # View logs
docker-compose ps           # List containers
```

## ✅ Pre-Deployment Checklist

Before pushing to GitHub, make sure:

- [ ] Docker image builds successfully
- [ ] Container starts without errors
- [ ] App is accessible at http://localhost:3000
- [ ] You can create, read, update, and delete notes
- [ ] Database persists after container restart
- [ ] Environment variables work correctly
- [ ] All files are committed (except .env and node_modules)

## 🚀 Next Steps

Once Docker is working:
1. Test all features thoroughly
2. Commit your Docker files to Git
3. Push to your private GitHub repository
4. Consider deploying to a cloud platform (Railway, Render, etc.)

