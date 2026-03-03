const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'voyageedu-dev-secret';
const TOKEN_EXPIRY = '7d';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createAuthToken = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.signup = async (req, res) => {
  const { name, email, password, city, state, preferredStreams } = req.body || {};

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters long.' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      city: city?.trim(),
      state: state?.trim(),
      preferredStreams: Array.isArray(preferredStreams) ? preferredStreams : preferredStreams ? [preferredStreams] : [],
    });

    const token = createAuthToken(user);

    return res.status(201).json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    return res.status(500).json({ error: 'Unable to create account at the moment.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = createAuthToken(user);

    return res.json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ error: 'Unable to log in at the moment.' });
  }
};
