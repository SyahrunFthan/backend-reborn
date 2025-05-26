import jwt from 'jsonwebtoken';
import Users from '../models/ModelUsers.js';
import Roles from '../models/ModelRoles.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
      return res.status(401).json({ message: 'Token not found!' });

    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token not found!' });

    const user = await Users.findOne({
      where: { token },
      include: {
        model: Roles,
        as: 'roles',
        foreignKey: 'role_id',
      },
    });

    if (!user) return res.status(401).json({ message: 'Invalid token!' });

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, decoded) => {
      if (err) {
        await Users.update({ token: null }, { where: { uuid: user.uuid } });

        res.clearCookie('token');
        return res
          .status(403)
          .json({ message: 'Invalid token or expired token' });
      }

      req.userId = decoded.userId;
      req.role = user.roles.role_key;
      req.name = user.fullname;

      next();
    });
  } catch (error) {
    console.error('Kesalahan Verivy Token:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default verifyToken;
