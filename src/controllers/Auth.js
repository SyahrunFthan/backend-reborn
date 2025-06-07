import Users from '../models/ModelUsers.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Roles from '../models/ModelRoles.js';
import formatPhoneNumber from '../utils/formatPhone.js';
import Residents from '../models/ModelResidents.js';
import encrypt from '../utils/encryption.js';
import decrypt from '../utils/decryption.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import generateOTP from '../utils/generateOtp.js';
import { Op } from 'sequelize';
dotenv.config();

// Mobile
export const sendOtpToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const otp = generateOTP();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Kode OTP Akun APP Desa',
      text: `Kode OTP Anda: ${otp}`,
      html: `<p>Kode OTP Anda adalah: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP Berhasil Terkirim', otp });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Check NIK To Register
export const checkNikForRegister = async (req, res) => {
  try {
    const { nik } = req.body;
    const encryptNik = encrypt(nik);
    const resident = await Residents.findOne({ where: { nik: encryptNik } });

    if (!resident)
      return res.status(404).json({ message: 'NIK tidak ditemukan' });

    const user = await Users.findAll({ where: { resident_id: resident.uuid } });

    if (user.length > 0)
      return res.status(409).json({ message: 'Anda sudah mempunyai akun.' });

    return res.status(200).json(resident);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Login User For Mobile App (Fix)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({
      where: { email },
      include: {
        model: Roles,
        as: 'roles',
        foreignKey: 'role_id',
      },
    });
    if (!user)
      return res.status(400).json({ email: 'Akun anda tidak ditemukan!' });

    if (user.roles.role_key !== 'user')
      return res.status(409).json({ email: 'Akun anda tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ password: 'Password anda salah!' });

    const token = jwt.sign(
      { userId: user.uuid },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: '24h' }
    );

    await Users.update({ token }, { where: { uuid: user.uuid } });

    const dataForClient = {
      userId: user.uuid,
      email: user.email,
      fullname: user.fullname,
      role: user.roles.role_key,
    };

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // if https then true
    });

    return res.status(200).json({ dataForClient, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Register User For Mobile & Website (Fix)
export const register = async (req, res) => {
  const { fullname, email, phone, username, password, resident_id, role_id } =
    req.body;

  try {
    const checkEmail = await Users.findOne({ where: { email } });
    if (checkEmail)
      return res.status(400).json({ email: 'Email sudah di gunakan!' });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const phoneNumber = formatPhoneNumber(phone);

    const checkPhone = await Users.findOne({ where: { phone: phoneNumber } });
    if (checkPhone)
      return res.status(400).json({ phone: 'Nomor telepon sudah di gunakan!' });

    await Users.create({
      fullname,
      email,
      username,
      resident_id,
      role_id,
      is_active: true,
      phone: phoneNumber,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Anda berhasil mendaftar!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Login User For Web
export const loginWeb = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        username: username,
      },
      include: {
        model: Roles,
        as: 'roles',
        foreignKey: 'role_id',
      },
    });

    if (!user)
      return res.status(400).json({ username: 'Akun anda tidak ditemukan!' });

    if (user.roles.role_key !== 'admin')
      return res.status(400).json({ email: 'Akun anda tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ password: 'Password anda salah!' });

    const accessToken = jwt.sign(
      { userId: user.uuid },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: '15s' }
    );

    const refreshToken = jwt.sign(
      { userId: user.uuid },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: '24h' }
    );

    await Users.update({ token: refreshToken }, { where: { uuid: user.uuid } });

    const dataForClient = {
      userId: user.uuid,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      role: user.roles.role_key,
    };

    res.cookie('token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });

    return res.status(200).json({ dataForClient, accessToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const refreshTokenAuth = async (req, res) => {
  try {
    const refreshToken = req.cookies.token;
    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findOne({
      where: {
        token: refreshToken,
      },
      include: {
        model: Roles,
        as: 'roles',
        foreignKey: 'role_id',
      },
    });

    if (!user) return res.sendStatus(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_TOKEN,
      (err, decoded) => {
        if (err) return res.sendStatus(403);

        const userId = decoded.userId;

        const accessToken = jwt.sign(
          { userId },
          process.env.ACCESS_SECRET_TOKEN,
          {
            expiresIn: '15s',
          }
        );

        const dataForClient = {
          userId: user.uuid,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          role: user.roles?.role_key,
        };

        return res.status(200).json({ dataForClient, token: accessToken });
      }
    );
  } catch (error) {
    console.error('Error in refreshTokenAuth:', error);
    return res
      .status(500)
      .json({ message: 'Server error', detail: error.message });
  }
};

// Logout User For Mobile & Website
export const logout = async (req, res) => {
  const { userId } = req;

  try {
    await Users.update({ token: null }, { where: { uuid: userId } });

    res.clearCookie('token');
    return res.status(200).json({ message: 'Anda berhasil logout!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Remove Token For Mobile
export const removeToken = async (req, res) => {
  try {
    const { id } = req.params;

    await Users.update({ token: null }, { where: { uuid: id } });
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ message: 'Token berhasil dihapus!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
