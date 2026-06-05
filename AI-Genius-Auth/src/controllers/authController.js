const bcrypt = require('bcryptjs');
const db = require('../models/db');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
} = require('../config/jwt');
const { AppError } = require('../middleware/errorMiddleware');


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide both email and password.', 400);
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid credentials.', 401);
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const refreshPayload = { id: user.id };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(refreshPayload);

    db.saveRefreshToken(refreshToken, user.id);

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      data: {
        accessToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        user: { id: user.id, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
};


const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    
    if (!refreshToken) {
      throw new AppError('No refresh token found. Please log in again.', 401);
    }

    
    if (!db.isRefreshTokenValid(refreshToken)) {
      throw new AppError('Refresh token has been revoked. Please log in again.', 401);
    }
    
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      db.deleteRefreshToken(refreshToken);
      throw new AppError('Refresh token is invalid or expired. Please log in again.', 401);
    }

    const user = db.findUserById(decoded.id);
    if (!user) {
      throw new AppError('The user associated with this token no longer exists.', 401);
    }

    const newAccessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed.',
      data: {
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      },
    });
  } catch (err) {
    next(err);
  }
};


const logout = (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      db.deleteRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout };