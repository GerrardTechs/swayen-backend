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
  { quote: "Disiplin adalah memilih antara apa yang kamu inginkan sekarang dan apa yang paling kamu inginkan nanti.", author: "Abraham Lincoln", source: "Filosofi" },
  { quote: "Fokus bukanlah tentang mengatakan ya, tapi tentang mengatakan tidak pada ratusan ide bagus lainnya.", author: "Steve Jobs", source: "Inovasi" },
  { quote: "Waktu Anda terbatas, jangan buang waktu itu untuk menjalani hidup orang lain.", author: "Steve Jobs", source: "Motivasi" },
  { quote: "Bukan karena hal-hal itu sulit kita tidak berani, tapi karena kita tidak berani maka hal-hal itu sulit.", author: "Seneca", source: "Stoikisme" },
  { quote: "Sukses adalah jumlah dari usaha-usaha kecil yang diulangi hari demi hari.", author: "Robert Collier", source: "Pengembangan Diri" },
  { quote: "Manajemen waktu sesungguhnya adalah manajemen energi dan fokus harianmu.", author: "Swayen Team", source: "Internal" },
  { quote: "Setiap menit yang kamu gunakan dalam perencanaan menghemat sepuluh menit dalam eksekusi.", author: "Brian Tracy", source: "Produktivitas" },
  { quote: "Jangan menunggu momen yang tepat, ambilah momen ini dan jadikan tepat.", author: "Swayen Mindset", source: "Internal" },
  { quote: "Ketenangan pikiran lahir dari persiapan malam yang terarah.", author: "Night Sentinel", source: "Swayen" },
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
