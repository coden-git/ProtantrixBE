const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

// POST /create/user/admin
// Body: { name: string, phone: string (10 digits), password: string }
async function createAdminUser(req, res) {
  try {
    const { name, phone, password } = req.body || {};

    // Normalize phone (ensure only digits)
    const cleanPhone = String(phone || '').replace(/\D/g, '');

    // Check if user already exists by phone
    const existing = await User.findOne({ phone: cleanPhone }).lean();
    if (existing) {
      return res.status(409).json({ ok: false, error: 'User with this phone already exists' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(String(password), saltRounds);

    const user = new User({
      name: String(name).trim(),
      phone: cleanPhone,
      password: hash,
      role: 'admin',
      isActive: true,
      projects: [],
    });

    const saved = await user.save();

    return res.status(201).json({
      ok: true,
      user: {
        _id: saved._id,
        name: saved.name,
        phone: saved.phone,
        role: saved.role,
        isActive: saved.isActive,
        projects: saved.projects,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('createAdminUser error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

async function loginUser(req, res) {
  try {
    const { phone, password } = req.body || {};
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const user = await User.findOne({ phone: cleanPhone }).select('+password');
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid phone or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ ok: false, error: 'User is inactive' });
    }
    const match = await bcrypt.compare(String(password), user.password || '');
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Invalid phone or password' });
    }
    const safeUser = user.toObject();
    delete safeUser.password;
    const secret = (process.env.JWT || '').replace(/^"|"$/g, '');
    if (!secret) {
      return res.status(500).json({ ok: false, error: 'JWT secret not configured' });
    }
    // Include top-level role claim and set expiration to 1 year
    const token = jwt.sign({ user: safeUser, role: safeUser.role }, secret, { expiresIn: '365d' });
    return res.json({ ok: true, token, user: safeUser, expiresIn: '365d' });
  } catch (err) {
    console.error('loginUser error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

// POST /user/create - admin creates a user (role & projects accepted)
async function createStandardUser(req, res) {
  try {
    const { name, phone, password, role = 'user', projects = [] } = req.body || {};
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const existing = await User.findOne({ phone: cleanPhone }).lean();
    if (existing) {
      return res.status(409).json({ ok: false, error: 'User with this phone already exists' });
    }
    const hash = await bcrypt.hash(String(password), 10);
    const normalizedProjects = Array.isArray(projects)
      ? projects.filter(p => p && p.uuid && p.name).map(p => ({ uuid: String(p.uuid), name: String(p.name).trim() }))
      : [];
    const user = new User({
      name: String(name).trim(),
      phone: cleanPhone,
      password: hash,
      role: role === 'admin' ? 'admin' : 'user',
      isActive: true,
      projects: normalizedProjects,
    });
    const saved = await user.save();
    return res.status(201).json({
      ok: true,
      user: {
        _id: saved._id,
        name: saved.name,
        phone: saved.phone,
        role: saved.role,
        isActive: saved.isActive,
        projects: saved.projects,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
    });
  } catch (err) {
    console.error('createStandardUser error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

module.exports = { createAdminUser, loginUser, createStandardUser };
