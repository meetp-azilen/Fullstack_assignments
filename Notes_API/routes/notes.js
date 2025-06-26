const express = require('express');
const db = require('../db/init');
const { ensureAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', ensureAuth, (req, res) => {
    db.all('SELECT * FROM notes WHERE userId = ?', [req.session.userId], (err, rows) => {
        res.json(rows);
    });
});

router.post('/', ensureAuth, (req, res) => {
    const { content } = req.body;
    db.run('INSERT INTO notes(userId, content) VALUES (?, ?)', [req.session.userId, content], function (err) {
        res.json({ id: this.lastID, content });
    });
});

router.put('/:id', ensureAuth, (req, res) => {
    const { content } = req.body;
    db.run('UPDATE notes SET content = ? WHERE id = ? AND userId = ?', [content, req.params.id, req.session.userId], function (err) {
        res.json({ message: 'Updated' });
    });
});

router.delete('/:id', ensureAuth, (req, res) => {
    db.run('DELETE FROM notes WHERE id = ? AND userId = ?', [req.params.id, req.session.userId], function (err) {
        res.json({ message: 'Deleted' });
    });
});

module.exports = router;
