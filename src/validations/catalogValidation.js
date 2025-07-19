const { z } = require("zod");

const catalogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum([
    "Fiksi",
    "Non-Fiksi",
    "Fantasi",
    "Fiksi Ilmiah",
    "Sejarah",
    "Biografi",
    "Misteri",
    "Romantis",
    "Petualangan",
    "Horor",
    "Puisi",
    "Self-Improvement",
    "Psikologi",
    "Pendidikan",
    "Agama",
    "Politik",
    "Sains",
    "Seni & Budaya",
    "Komik",
    "Anak-anak",
    "Teknologi",
    "Ekonomi",
    "Sosial",
    "Kesehatan",
  ]),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
  type: z.enum([
    "Cetak",
    "Ebook",
    "Audiobook",
    "Komik",
    "Majalah",
    "Jurnal",
    "Artikel",
    "Ensiklopedia",
    "Manual Book",
  ]),
  publisher: z.string().min(1, "Publisher is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  coverUrl: z.string().url("Cover URL must be a valid URL"),
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
