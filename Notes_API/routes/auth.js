const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/init');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users(username, password) VALUES(?,?)', [username, hash], function (err) {
        if (err) return res.status(400).json({ error: 'User exists' });
        res.json({ message: 'Registered' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: 'Invalid credentials' });

        req.session.userId = user.id;
        res.json({ message: 'Logged in' });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Logged out' }));
});

module.exports = router;
