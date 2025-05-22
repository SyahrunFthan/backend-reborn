import Roles from '../models/ModelRoles.js';

// Super Admin
export const createRole = async (req, res) => {
  try {
    const { role_name, key_role } = req.body;
    const newRole = await Roles.create({
      role_name: role_name,
      key_role: key_role,
    });
    return res
      .status(201)
      .json({ message: 'Role berhasil dibuat', role: newRole });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Gagal membuat role', error: error.message });
  }
};

// Super Admin
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, key_role } = req.body;

    const role = await Roles.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      return res.status(404).json({ message: 'role tidak di temukan' });
    }

    await role.update({
      role_name: role_name,
      key_role: key_role,
    });

    return res.status(200).json({ message: 'berhasil mengupdate role' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  const Roles = await Roles.findByPk(id);

  try {
    await Roles.destroy({
      where: {
        uuid: id,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
