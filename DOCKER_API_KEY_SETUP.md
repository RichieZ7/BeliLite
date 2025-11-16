# Setting xAI API Key in Docker

This guide shows you how to set your xAI API key when running BeliLite in Docker.

## 🔑 Method 1: Using .env File (Recommended)

This is the **easiest and most secure** method for local development.

### Step 1: Create .env File

In your project root directory (same folder as `docker-compose.yml`), create a `.env` file:

```bash
# Create .env file
touch .env
```

### Step 2: Add Your API Key

Open `.env` and add:

```bash
XAI_API_KEY=your-actual-xai-api-key-here
XAI_API_URL=https://api.x.ai/v1/chat/completions
```

**Important**: Replace `your-actual-xai-api-key-here` with your real API key from [console.x.ai](https://console.x.ai)

### Step 3: Start Docker

```bash
docker-compose up --build
```

Docker Compose automatically reads the `.env` file and passes the variables to your container.

**✅ Advantages:**
- Easy to manage
- `.env` is already in `.gitignore` (won't be committed)
- Can have different keys for different environments

---

## 🔑 Method 2: Directly in docker-compose.yml

You can set the API key directly in `docker-compose.yml`:

### Step 1: Edit docker-compose.yml

Uncomment and modify these lines:

```yaml
environment:
  - XAI_API_KEY=your-actual-api-key-here
  - XAI_API_URL=https://api.x.ai/v1/chat/completions
```

### Step 2: Start Docker

```bash
docker-compose up --build
```

**⚠️ Warning**: This method is **NOT recommended** because:
- Your API key will be visible in the file
- If you commit this file, your key will be exposed
- Harder to manage different keys for different environments

---

## 🔑 Method 3: Command Line (One-time Testing)

For quick testing, you can pass the API key via command line:

```bash
# Using docker run
docker run -p 3000:3000 \
  -e XAI_API_KEY=your-api-key-here \
  -v $(pwd)/data:/app/data \
  belilite

# Or using docker-compose with override
XAI_API_KEY=your-api-key-here docker-compose up
```

**✅ Advantages:**
- Quick for testing
- No file changes needed

**❌ Disadvantages:**
- Key visible in command history
- Have to type it every time

---

## 🔑 Method 4: Environment Variables (Production)

For production deployments, set environment variables on your host system:

### Linux/macOS:

```bash
# Set in your shell
export XAI_API_KEY=your-api-key-here
export XAI_API_URL=https://api.x.ai/v1/chat/completions

# Then start Docker
docker-compose up
```

### Windows (PowerShell):

```powershell
$env:XAI_API_KEY="your-api-key-here"
$env:XAI_API_URL="https://api.x.ai/v1/chat/completions"
docker-compose up
```

### Windows (Command Prompt):

```cmd
set XAI_API_KEY=your-api-key-here
set XAI_API_URL=https://api.x.ai/v1/chat/completions
docker-compose up
```

**✅ Advantages:**
- Secure (not in files)
- Good for production
- Can be set by deployment systems

---

## 🧪 Verify API Key is Set

After starting your container, check if the API key is working:

1. **Check container logs:**
   ```bash
   docker-compose logs belilite
   ```

2. **Test in the app:**
   - Go to http://localhost:3000
   - Write some text in a note
   - Click "Summarize with Grok"
   - If it works, your API key is set correctly!

3. **Check environment variables inside container:**
   ```bash
   docker exec belilite-app env | grep XAI
   ```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Never commit API keys in code** - Always use environment variables
3. **Use different keys for dev/prod** - Keep them separate
4. **Rotate keys regularly** - If exposed, generate new ones
5. **Use secrets management** - For production (AWS Secrets Manager, etc.)

---

## 🐛 Troubleshooting

### "xAI API key not configured" Error

**Problem**: Container starts but summarization doesn't work.

**Solutions:**
1. Check `.env` file exists and has `XAI_API_KEY=...`
2. Verify `.env` is in the same directory as `docker-compose.yml`
3. Restart container: `docker-compose restart`
4. Check logs: `docker-compose logs belilite`

### API Key Not Being Read

**Problem**: Environment variable not passed to container.

**Solutions:**
1. Make sure `.env` file format is correct (no spaces around `=`)
   ```bash
   # ✅ Correct
   XAI_API_KEY=sk-abc123
   
   # ❌ Wrong
   XAI_API_KEY = sk-abc123
   XAI_API_KEY="sk-abc123"
   ```

2. Rebuild container:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. Check if variable is set:
   ```bash
   docker exec belilite-app printenv XAI_API_KEY
   ```

### Different API Keys for Different Environments

Create separate `.env` files:

```bash
# .env.development
XAI_API_KEY=dev-key-here

# .env.production
XAI_API_KEY=prod-key-here
```

Then use:
```bash
# Development
docker-compose --env-file .env.development up

# Production
docker-compose --env-file .env.production up
```

---

## 📝 Quick Reference

**Recommended Setup (Local Development):**

1. Create `.env` file:
   ```bash
   echo "XAI_API_KEY=your-key-here" > .env
   ```

2. Start Docker:
   ```bash
   docker-compose up --build
   ```

3. Test:
   - Open http://localhost:3000
   - Try summarizing text

**That's it!** Your API key is now configured. 🎉

