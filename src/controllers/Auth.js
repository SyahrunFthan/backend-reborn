import Users from '../models/ModelUsers.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Roles from '../models/ModelRoles.js';
import formatPhoneNumber from '../utils/formatPhone.js';

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
      return res.status(400).json({ message: 'Akun anda tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Password anda salah!' });

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

// Register User For Mobile App (Fix)
export const register = async (req, res) => {
  const { fullname, email, phone, username, password } = req.body;

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
      phone: phoneNumber,
      password: hashedPassword,
      role_id: 3,
    });

    return res.status(201).json({ message: 'Anda berhasil mendaftar!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Logout User For Mobile (Bug)
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

export const removeToken = async (req, res) => {
  try {
    const { id } = req.params;

    await Users.update({ token: null }, { where: { uuid: id } });
    res.clearCookie('token');

    return res.status(200).json({ message: 'Token berhasil dihapus!' });
  } catch (error) {}
};
