const express = require('express');
const { db } = require('../database/data');
const router = express.Router();

// Function for getting the list of tasks
router.get('/', (req, res) => {
    try {
        const q = db.prepare('SELECT * FROM todos');
        const todos = q.all();
        res.status(200).json({ msg: 'Fetch data successfully', todos });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Function for creating a new task
router.post('/', (req, res) => {
    const { name, description, completed } = req.body;

    try {
        const q = db.prepare('INSERT INTO todos (name, description, completed) VALUES (?, ?, ?)');
        const result = q.run(name, description, completed);
        res.status(201).json({ id: result.lastInsertRowid, name, description, completed });
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Function for updating a task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;

    try {
        const q = db.prepare('UPDATE todos SET name = ?, description = ?, completed = ? WHERE id = ?');
        const result = q.run(name, description, completed, id);
        if (result.changes) {
            res.status(200).json({ id, name, description, completed });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Function for deleting a task
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    try {
        const q = db.prepare('DELETE FROM todos WHERE id = ?');
        const result = q.run(id);
        if (result.changes) {
            res.status(200).json({ msg: 'Task deleted' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
