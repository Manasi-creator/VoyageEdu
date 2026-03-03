const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'voyageedu-dev-secret';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'User not found' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id email name');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(401).json({ error: 'User not found' });
  }
};
