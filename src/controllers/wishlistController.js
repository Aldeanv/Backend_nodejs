const prisma = require("../config/prisma");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const catalogId = Number(req.params.catalogId);

    if (isNaN(catalogId)) {
      return res.status(400).json({ message: "ID catalog harus berupa angka" });
    }

    const catalog = await prisma.catalog.findUnique({
      where: { id: catalogId },
    });
    if (!catalog) {
      return res.status(404).json({ message: "Catalog tidak ditemukan" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        wishlists: {
          connect: { id: catalogId },
        },
      },
    });

    res.json({ message: "Berhasil menambahkan ke wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan wishlist", error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlists: true },
    });

    res.json({ wishlists: user.wishlists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil wishlist", error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const catalogId = Number(req.params.catalogId);

    if (isNaN(catalogId)) {
      return res.status(400).json({ message: "ID catalog harus berupa angka" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        wishlists: {
          disconnect: { id: catalogId },
        },
      },
    });

    res.json({ message: "Berhasil menghapus dari wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus wishlist", error: error.message });
  }
};
