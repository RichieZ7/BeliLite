/**
 * BELILITE - BACKEND SERVER
 * 
 * This is the "backend" - the server that handles requests from the frontend.
 * Think of it as the brain of your app that processes data and talks to the database.
 * 
 * Key concepts:
 * - Express: A framework that makes it easy to create web servers
 * - API endpoints: URLs that the frontend calls to get/send data (like /api/notes)
 * - CRUD operations: Create, Read, Update, Delete - the basic operations for data
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express app - this is your server
const app = express();
// Use environment variable PORT if available (for Docker/cloud deployment)
// Otherwise default to 3000 for local development
const PORT = process.env.PORT || 3000;

// Middleware: These are functions that run before your routes
// - cors: Allows the frontend (running on a different port) to talk to this server
// - express.json(): Lets the server understand JSON data sent from the frontend
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the 'public' folder
// This is how the frontend gets delivered to the browser
app.use(express.static('public'));

// XAI API CONFIGURATION
// xAI's Grok API endpoint and configuration
// The API key is stored in environment variables for security
// Note: If you get a 404 error, the endpoint URL might need to be updated
// Check https://docs.x.ai for the latest API endpoint
const XAI_API_URL = process.env.XAI_API_URL || 'https://api.x.ai/v1/chat/completions';
const XAI_API_KEY = process.env.XAI_API_KEY; // Get API key from .env file

// DATABASE SETUP
// SQLite is a simple file-based database - perfect for learning!
// The database file will be created automatically if it doesn't exist
// In Docker, we'll store it in a data directory for persistence
const dbPath = process.env.DB_PATH || 'notes.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create the 'notes' table if it doesn't exist
    // This is like creating a spreadsheet with columns: id, title, content, created_at
    db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Notes table ready');
      }
    });
  }
});

// ============================================
// API ENDPOINTS - These are the "doors" your frontend uses to access data
// ============================================

/**
 * GET /api/notes
 * Returns all notes from the database
 * 
 * How it works:
 * 1. Frontend makes a GET request to /api/notes
 * 2. Server queries the database: "SELECT * FROM notes"
 * 3. Server sends the results back as JSON
 */
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY updated_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

/**
 * GET /api/notes/:id
 * Returns a single note by its ID
 * 
 * :id is a URL parameter - if you request /api/notes/5, req.params.id = 5
 */
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.json(row);
  });
});

/**
 * POST /api/notes
 * Creates a new note
 * 
 * How it works:
 * 1. Frontend sends POST request with note data in the request body
 * 2. Server inserts the data into the database
 * 3. Server returns the newly created note (with its auto-generated ID)
 */
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  db.run(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Return the newly created note
      res.json({
        id: this.lastID,
        title,
        content: content || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  );
});

/**
 * PUT /api/notes/:id
 * Updates an existing note
 * 
 * How it works:
 * 1. Frontend sends PUT request with updated data
 * 2. Server updates the row in the database where id matches
 * 3. Server returns the updated note
 */
app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  db.run(
    'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content || '', id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      // Return the updated note
      db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

/**
 * DELETE /api/notes/:id
 * Deletes a note
 * 
 * How it works:
 * 1. Frontend sends DELETE request
 * 2. Server deletes the row from the database
 * 3. Server confirms deletion
 */
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

/**
 * POST /api/summarize
 * Summarizes text using xAI's Grok
 * 
 * How it works:
 * 1. Frontend sends POST request with text to summarize
 * 2. Server sends the text to xAI's Grok API
 * 3. Grok returns a summary
 * 4. Server sends the summary back to the frontend
 * 
 * This is an example of integrating with an external API (xAI)
 */
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;
  
  // Validate input
  if (!text || text.trim().length === 0) {
    res.status(400).json({ error: 'Text is required for summarization' });
    return;
  }
  
  // Check if API key is configured
  if (!XAI_API_KEY) {
    res.status(500).json({ 
      error: 'xAI API key not configured. Please set XAI_API_KEY in your .env file.' 
    });
    return;
  }
  
  try {
    console.log('Calling xAI API:', XAI_API_URL);
    
    // Call xAI's Grok API to summarize the text
    // xAI uses a REST API similar to OpenAI's structure
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3', // xAI's Grok model (try 'grok-2' or 'grok-2-1212' if this doesn't work)
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, clear summaries of text. Summarize the given text in 2-3 sentences, capturing the main points.'
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        max_tokens: 150, // Limit summary length
        temperature: 0.7, // Controls randomness (0 = deterministic, 1 = creative)
        stream: false // xAI requires explicit stream parameter
      })
    });
    
    // Check if the API request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `API returned status ${response.status}`;
      console.error('xAI API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        url: XAI_API_URL
      });
      throw new Error(errorMessage);
    }
    
    // Parse the response from xAI
    const data = await response.json();
    
    // Extract the summary from xAI's response
    // xAI's response structure is similar to OpenAI's
    const summary = data.choices[0].message.content.trim();
    
    // Send the summary back to the frontend
    res.json({ summary });
  } catch (error) {
    console.error('xAI API error:', error);
    
    // Handle different types of errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      res.status(401).json({ error: 'Invalid xAI API key' });
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      res.status(429).json({ error: 'xAI API rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ 
        error: 'Failed to summarize text. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`BeliLite server running at http://localhost:${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT} to see the app!`);
});

// Gracefully close database connection when server shuts down
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

