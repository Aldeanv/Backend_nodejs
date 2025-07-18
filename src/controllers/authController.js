const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist)
      return res.status(400).json({ message: "Email sudah digunakan" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Pendaftaran berhasil", user });
  } catch (error) {
    res.status(500).json({ message: "Registrasi gagal", error: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password, NIK, phone } = req.body;

  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist)
      return res.status(400).json({ message: "Email sudah digunakan" });

    if (!NIK || !phone) {
      return res
        .status(400)
        .json({ message: "NIK dan Phone wajib untuk admin" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
        NIK,
        phone,
      },
    });

    res.status(201).json({ message: "Admin berhasil didaftarkan", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registrasi admin gagal", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};
