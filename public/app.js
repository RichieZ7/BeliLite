/**
 * BELILITE - FRONTEND JAVASCRIPT
 * 
 * This is the "frontend" - the code that runs in the user's browser.
 * It handles user interactions and communicates with the backend server.
 * 
 * Key concepts:
 * - DOM (Document Object Model): How JavaScript interacts with HTML elements
 * - API calls: Using fetch() to send requests to the backend
 * - Event listeners: Functions that run when users click buttons, submit forms, etc.
 * - Async/await: Handling operations that take time (like API calls)
 */

// State management - track if we're editing a note
let editingNoteId = null;

// DOM elements - references to HTML elements we'll manipulate
const noteForm = document.getElementById('note-form');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const summarizeBtn = document.getElementById('summarize-btn');
const formTitle = document.getElementById('form-title');
const notesList = document.getElementById('notes-list');

// API base URL - where our backend server is running
const API_URL = 'http://localhost:3000/api/notes';

/**
 * Load all notes from the backend and display them
 * 
 * How it works:
 * 1. Make a GET request to /api/notes
 * 2. Wait for the response (this is async - takes time)
 * 3. Convert response to JSON
 * 4. Display each note in the UI
 */
async function loadNotes() {
  try {
    // fetch() is a built-in browser function to make HTTP requests
    const response = await fetch(API_URL);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }
    
    // Convert the response to JavaScript objects
    const notes = await response.json();
    
    // Display the notes
    displayNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    notesList.innerHTML = '<div class="empty-state"><p>Error loading notes. Make sure the server is running!</p></div>';
  }
}

/**
 * Display notes in the UI
 * 
 * This function takes an array of notes and creates HTML elements for each one
 */
function displayNotes(notes) {
  if (notes.length === 0) {
    notesList.innerHTML = '<div class="empty-state"><p>No notes yet. Create your first note above!</p></div>';
    return;
  }
  
  // Create HTML for each note
  notesList.innerHTML = notes.map(note => `
    <div class="note-card">
      <h3>${escapeHtml(note.title)}</h3>
      <div class="note-meta">
        Created: ${formatDate(note.created_at)} | 
        Updated: ${formatDate(note.updated_at)}
      </div>
      <p>${escapeHtml(note.content || '(No content)')}</p>
      <div class="note-actions">
        <button class="btn-edit" onclick="editNote(${note.id})">Edit</button>
        <button class="btn-delete" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

/**
 * Create a new note
 * 
 * How it works:
 * 1. Get data from the form
 * 2. Send POST request to /api/notes with the note data
 * 3. Reload the notes list to show the new note
 */
async function createNote(title, content) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON
      },
      body: JSON.stringify({ title, content }), // Convert JavaScript object to JSON string
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    // Clear the form and reload notes
    noteForm.reset();
    loadNotes();
  } catch (error) {
    console.error('Error creating note:', error);
    alert('Failed to create note. Please try again.');
  }
}

/**
 * Update an existing note
 * 
 * Similar to create, but uses PUT method and includes the note ID
 */
async function updateNote(id, title, content) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    
    // Reset form and reload notes
    noteForm.reset();
    editingNoteId = null;
    formTitle.textContent = 'Create New Note';
    cancelBtn.style.display = 'none';
    loadNotes();
  } catch (error) {
    console.error('Error updating note:', error);
    alert('Failed to update note. Please try again.');
  }
}

/**
 * Delete a note
 * 
 * Sends a DELETE request to remove the note from the database
 */
async function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
    
    // Reload notes to reflect the deletion
    loadNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note. Please try again.');
  }
}

/**
 * Load a note into the form for editing
 * 
 * How it works:
 * 1. Fetch the note by ID
 * 2. Populate the form fields with the note data
 * 3. Change the form to "edit mode"
 */
async function editNote(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to load note');
    }
    
    const note = await response.json();
    
    // Populate form with note data
    noteTitle.value = note.title;
    noteContent.value = note.content || '';
    
    // Switch to edit mode
    editingNoteId = id;
    formTitle.textContent = 'Edit Note';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    noteForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading note:', error);
    alert('Failed to load note for editing.');
  }
}

/**
 * Cancel editing and reset form
 */
function cancelEdit() {
  noteForm.reset();
  editingNoteId = null;
  formTitle.textContent = 'Create New Note';
  cancelBtn.style.display = 'none';
}

/**
 * Summarize text using xAI's Grok
 * 
 * How it works:
 * 1. Get the text from the content textarea
 * 2. Send it to our backend /api/summarize endpoint
 * 3. Backend calls xAI's Grok API
 * 4. Replace the textarea content with the summary
 * 
 * This demonstrates integrating with external APIs (xAI)
 */
async function summarizeText() {
  const text = noteContent.value.trim();
  
  // Check if there's text to summarize
  if (!text) {
    alert('Please enter some text to summarize first!');
    return;
  }
  
  // Disable button and show loading state
  summarizeBtn.disabled = true;
  const originalText = summarizeBtn.textContent;
  summarizeBtn.textContent = '⏳ Summarizing...';
  
  try {
    // Call our backend API endpoint for summarization
    const response = await fetch('http://localhost:3000/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }), // Send the text to summarize
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to summarize text');
    }
    
    // Get the summary from the response
    const data = await response.json();
    const summary = data.summary;
    
    // Replace the textarea content with the summary
    noteContent.value = summary;
    
    // Show success message (optional)
    const successMsg = document.createElement('div');
    successMsg.textContent = '✓ Text summarized!';
    successMsg.style.cssText = 'color: #667eea; margin-top: 10px; font-size: 0.9rem;';
    noteForm.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
    
  } catch (error) {
    console.error('Error summarizing text:', error);
    alert(`Failed to summarize: ${error.message}`);
  } finally {
    // Re-enable button and restore original text
    summarizeBtn.disabled = false;
    summarizeBtn.textContent = originalText;
  }
}

// EVENT LISTENERS - Functions that run when users interact with the page

// Handle form submission (both create and update)
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page from refreshing
  
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  
  if (!title) {
    alert('Please enter a title');
    return;
  }
  
  if (editingNoteId) {
    // We're editing an existing note
    await updateNote(editingNoteId, title, content);
  } else {
    // We're creating a new note
    await createNote(title, content);
  }
});

// Handle cancel button
cancelBtn.addEventListener('click', cancelEdit);

// Handle summarize button
summarizeBtn.addEventListener('click', summarizeText);

// HELPER FUNCTIONS

/**
 * Escape HTML to prevent XSS (Cross-Site Scripting) attacks
 * This ensures user input is displayed as text, not executed as code
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format date string to be more readable
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Load notes when the page loads
loadNotes();

