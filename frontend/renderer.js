const axios = require('axios');
const API_URL = 'http://localhost:5044/api/notes';

async function loadNotes() {
    try {
        console.log("Connecting to API:", API_URL);
        const res = await axios.get(API_URL);
        console.log("Notes loaded:", res.data);

        const notesBody = document.getElementById('notes-body');
        notesBody.innerHTML = '';

        res.data.forEach(note => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${note.title}</td>
                <td>${note.content}</td>
                <td>
                    <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">Edit</button>
                    <button onclick="deleteNote(${note.id})">Delete</button>
                </td>
            `;
            notesBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
        showError("Failed to load notes. Make sure the backend is running on port 5044.");
    }
}


async function addNote() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showError("Title and content cannot be empty!");
        return;
    }

    try {
        await axios.post(API_URL, { title, content });
        console.log("Note added successfully.");
        showSuccess("Note added successfully!");

        titleInput.value = '';
        contentInput.value = '';

        await loadNotes();
    } catch (error) {
        console.error("Error adding note:", error);
        showError("Failed to add note. Check console for details.");
    }
}


async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
        await axios.delete(`${API_URL}/${id}`);
        console.log(`Note with ID ${id} deleted.`);
        showSuccess("Note deleted successfully!");
        loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
        showError("Failed to delete note. It may not exist.");
    }
}

let currentEditId = null;

async function editNote(id, title, content) {
    currentEditId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editTitleInput').value = title;
    document.getElementById('editContentInput').value = content;
    document.getElementById('edit-form').style.display = 'block';
}

async function saveEditedNote() {
    const id = currentEditId;
    const newTitle = document.getElementById('editTitleInput').value;
    const newContent = document.getElementById('editContentInput').value;

    if (!newTitle || !newContent) {
        showError("Title and content cannot be empty!");
        return;
    }

    try {
        await axios.put(`${API_URL}/${id}`, { id, title: newTitle, content: newContent });
        console.log(`Note with ID ${id} edited.`);
        showSuccess("Note edited successfully!");
        await loadNotes();
        document.getElementById('editTitleInput').value = '';
        document.getElementById('editContentInput').value = '';
        currentEditId = null;
    } catch (error) {
        console.error("Error editing note:", error);
        showError("Failed to edit note. Please try again.");
    }
}

function showSuccess(message) {
    document.getElementById('message').innerHTML = `<span style="color: green;">${message}</span>`;
    setTimeout(() => { document.getElementById('message').innerHTML = ""; }, 3000);
}

function showError(message) {
    document.getElementById('message').innerHTML = `<span style="color: red;">${message}</span>`;
    setTimeout(() => { document.getElementById('message').innerHTML = ""; }, 5000);
}

window.onload = loadNotes;
