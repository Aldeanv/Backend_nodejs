const { z } = require("zod");

const catalogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum([
    "Fiksi Ilmiah",
    "Fantasi",
    "Romantis",
    "Misteri",
    "Thriller",
    "Horor",
    "Petualangan",
    "Drama",
    "Fiksi Sejarah",
    "Distopia",
    "Satire",
    "Biografi",
    "self-improvement",
    "Motivasi",
    "Sejarah",
    "Filsafat",
    "Psikologi",
    "Sains",
    "Politik",
    "Sosial Budaya",
    "Travel",
    "Bisnis",
    "Teknologi",
    "Kesehatan",
    "Drama Teater",
    "Klasik",
  ]),
  year: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1000).max(new Date().getFullYear())
  ),
  type: z.enum([
    "Fiksi",
    "Non-Fiksi",
    "Biografi",
    "Autobiografi",
    "Memoar",
    "Puisi",
    "Cerpen",
    "Novel",
    "Komik",
    "Antologi",
    "Ensiklopedia",
    "Kamus",
    "Buku Teks",
    "Panduan",
    "Manual",
    "Jurnal",
    "Majalah",
    "Naskah Drama",
    "Buku Referensi",
    "Buku Bergambar",
  ]),
  publisher: z.string().min(1, "Publisher is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
});

const searchCatalogSchema = z.object({
  keyword: z.string().optional(),
  genre: z.string().optional(),
  type: z.string().optional(),
  year: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z
    .enum(["title", "author", "genre", "type", "year", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

module.exports = { catalogSchema, searchCatalogSchema };