import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Catatan: ini adalah quote placeholder buatan sendiri untuk keperluan development/demo.
// Ganti/lengkapi dengan quote asli dari sumber referensi (mis. Ruangguru) sebelum production,
// pastikan mencantumkan atribusi (author/source) yang benar dan sesuai izin penggunaan konten.
const quotes = [
  { quote: "Langkah kecil yang konsisten mengalahkan rencana besar yang tidak pernah dimulai.", author: "Swayen Team", source: "Internal" },
  { quote: "Istirahat 20 menit hari ini adalah investasi fokus untuk besok.", author: "Swayen Team", source: "Internal" },
  { quote: "Energi terbatas, prioritaskan yang paling penting dulu.", author: "Swayen Team", source: "Internal" },
  { quote: "Satu TimeBox selesai, satu langkah lebih dekat ke tujuanmu.", author: "Swayen Team", source: "Internal" },
  { quote: "Rencana malam yang sederhana lebih baik daripada rencana sempurna yang tak pernah dieksekusi.", author: "Swayen Team", source: "Internal" },
];

async function main() {
  // Normalisasi ke UTC midnight (bukan local midnight) supaya nilai yang dikirim ke kolom
  // @db.Date MySQL konsisten terlepas dari timezone mesin yang menjalankan script ini (WIB dkk).
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // Wipe & re-insert: jauh lebih aman untuk seed script dev yang mungkin dijalankan berkali-kali
  // (misal karena `prisma migrate dev` sudah auto-trigger seed sebelumnya), dibanding upsert
  // berbasis kolom Date yang rawan gagal match akibat perbedaan timezone antar pemanggilan.
  await prisma.dailyQuote.deleteMany({});

  const data = quotes.map((q, i) => ({
    ...q,
    showDate: new Date(todayUTC.getTime() + i * 24 * 60 * 60 * 1000),
  }));

  await prisma.dailyQuote.createMany({ data });

  console.log(`✅ Seeded ${quotes.length} daily quotes`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
