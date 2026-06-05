const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: uuidv4(),
    email: 'admin@ai-genius.com',
    password: '$2a$10$3fKuW.TOr8myAaccrmz8hudXCr8JHHntCfN3k6930iTNIEkvt4O3G',
    role: 'Admin',
  },
  {
    id: uuidv4(),
    email: 'premium@ai-genius.com',
    password: '$2a$10$CHNJZKzK51IIP/90pNwck.hkMOmK1S9NzMx4ErijGP1S27de4Pfme',
    role: 'Premium_User',
  },
  {
    id: uuidv4(),
    email: 'free@ai-genius.com',
    password: '$2a$10$o09Vjs3pa.a.qj1iGpp/3OsPeWUfg9bH3CSGtjQByQBqh4WFhvIDu',
    role: 'Free_User',
  },
];

const refreshTokenWhitelist = new Map();

const db = {
  findUserByEmail(email) {
    return users.find((u) => u.email === email) || null;
  },

  findUserById(id) {
    return users.find((u) => u.id === id) || null;
  },

  saveRefreshToken(token, userId) {
    refreshTokenWhitelist.set(token, userId);
  },

  isRefreshTokenValid(token) {
    return refreshTokenWhitelist.has(token);
  },

  deleteRefreshToken(token) {
    refreshTokenWhitelist.delete(token);
  },

  getUserIdByRefreshToken(token) {
    return refreshTokenWhitelist.get(token) || null;
  },
};

module.exports = db;