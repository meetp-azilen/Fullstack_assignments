function ensureAuth(req, res, next) {
    if (req.session.userId) return next();
    res.status(401).json({ message: 'Unauthorized' });
}
module.exports = { ensureAuth };
