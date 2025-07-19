const prisma = require("../config/prisma");
const {
  catalogSchema,
  searchCatalogSchema,
} = require("../validations/catalogValidation");

function isAdmin(user) {
  return user?.role === "admin";
}

// Create
exports.createCatalog = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res
      .status(403)
      .json({ message: "Hanya admin yang dapat menambahkan katalog" });
  }

  try {
    const data = catalogSchema.parse(req.body);
    const catalog = await prisma.catalog.create({ data });

    res.status(201).json({ message: "Catalog berhasil ditambahkan", catalog });
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validasi gagal", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Gagal menambahkan catalog", error: error.message });
  }
};

// Read
exports.getAllCatalogs = async (req, res) => {
  try {
    const catalogs = await prisma.catalog.findMany();
    res.json({ catalogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil catalog", error: error.message });
  }
};

// Read by ID
exports.getCatalogById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID harus berupa angka" });
    }

    const catalog = await prisma.catalog.findUnique({
      where: { id },
    });

    if (!catalog) {
      return res.status(404).json({ message: "Catalog tidak ditemukan" });
    }

    res.json(catalog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil catalog", error: error.message });
  }
};

// Update
exports.updateCatalog = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res
      .status(403)
      .json({ message: "Hanya admin yang dapat mengubah katalog" });
  }

  try {
    const data = catalogSchema.parse(req.body);
    const catalog = await prisma.catalog.update({
      where: { id: Number(req.params.id) },
      data,
    });

    res.json({ message: "Catalog berhasil diperbarui", catalog });
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validasi gagal", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Gagal memperbarui catalog", error: error.message });
  }
};

// Delete
exports.deleteCatalog = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res
      .status(403)
      .json({ message: "Hanya admin yang dapat menghapus katalog" });
  }

  try {
    await prisma.catalog.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Catalog berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus catalog", error: error.message });
  }
};

//seacrh
exports.searchCatalogs = async (req, res) => {
  try {
    const params = searchCatalogSchema.parse(req.query);

    const where = {};

    if (params.keyword) {
      where.OR = [
        { title: { contains: params.keyword, mode: "insensitive" } },
        { author: { contains: params.keyword, mode: "insensitive" } },
      ];
    }

    if (params.genre) where.genre = params.genre;
    if (params.type) where.type = params.type;
    if (params.year) where.year = params.year;

    const skip = (params.page - 1) * params.limit;

    const [catalogs, total] = await Promise.all([
      prisma.catalog.findMany({
        where,
        orderBy: { [params.sortBy]: params.sortOrder },
        skip,
        take: params.limit,
      }),
      prisma.catalog.count({ where }),
    ]);

    res.json({
      data: catalogs,
      total,
      page: params.page,
      lastPage: Math.ceil(total / params.limit),
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};
