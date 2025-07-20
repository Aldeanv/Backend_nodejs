const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const {
  registerSchema,
  registerAdminSchema,
  loginSchema,
} = require("../validations/authValidation");

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exist = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exist)
      return res.status(400).json({ message: "Email sudah digunakan" });

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Pendaftaran berhasil", user });
  } catch (error) {
    if (error.name === "ZodError" && Array.isArray(error.errors)) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    res.status(500).json({ message: "Registrasi gagal", error: error.message });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const data = registerAdminSchema.parse({
      ...req.body,
      role: "admin",
    });

    const emailExist = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExist) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const nikExist = await prisma.user.findFirst({
      where: { NIK: data.NIK },
    });
    if (nikExist) {
      return res.status(400).json({ message: "NIK sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "admin",
        NIK: data.NIK,
        phone: data.phone,
      },
    });

    return res
      .status(201)
      .json({ message: "Admin berhasil didaftarkan", admin });
  } catch (error) {
    if (error.name === "ZodError" && Array.isArray(error.errors)) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    res
      .status(500)
      .json({ message: "Registrasi admin gagal", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { wishlists: true },
    });

    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return res.status(401).json({ message: "Login gagal" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        NIK: user.NIK,
        phone: user.phone,
        wishlists: user.wishlists,
      },
    });
  } catch (error) {
    if (error.name === "ZodError" && Array.isArray(error.errors)) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};
