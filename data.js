const SITE_CONFIG = {
  brand: "AutoShowcase",
  whatsappNumber: "6281234567890",
  email: "halo@autoshowcase.id",
  siteUrl: "",
  showDemoNotice: true
};

const CATEGORY_LABELS = { suv: "SUV", sedan: "Sedan", ev: "EV" };

const CARS = [
  {
    id: 1,
    name: "Cherry J6 2026",
    category: "suv",
    priceIDR: 545000000,
    image: "images/J6.png",
    imageAlt: "Mobil SUV TerraPulse AWD berwarna hijau",
    summary: "SUV tangguh untuk keluarga dan petualangan akhir pekan.",
    description: "TerraPulse AWD menawarkan performa andal, kabin lapang, dan fitur keselamatan modern untuk perjalanan harian maupun lintas kota.",
    specs: [
      { label: "Mesin", value: "1.5L Turbo" },
      { label: "Transmisi", value: "CVT" },
      { label: "Penggerak", value: "AWD" },
      { label: "Kapasitas", value: "5 penumpang" }
    ]
  },
  {
    id: 2,
    name: "Velox Prime 2026",
    category: "sedan",
    priceIDR: 420000000,
    image: "images/velox.svg",
    imageAlt: "Sedan Velox Prime berwarna merah",
    summary: "Sedan dinamis dengan kenyamanan dan efisiensi tinggi.",
    description: "Velox Prime memadukan pengendalian responsif, kabin tenang, dan teknologi terhubung untuk mobilitas kelas premium.",
    specs: [
      { label: "Mesin", value: "2.0L Turbo" },
      { label: "Transmisi", value: "DCT 8-Speed" },
      { label: "Penggerak", value: "RWD" },
      { label: "Konsumsi", value: "14 km/liter" }
    ]
  },
  {
    id: 3,
    name: "Voltara eX 2026",
    category: "ev",
    priceIDR: 690000000,
    image: "images/voltara.svg",
    imageAlt: "Mobil listrik Voltara eX berwarna biru",
    summary: "Kendaraan listrik serbaguna dengan jarak tempuh luas.",
    description: "Voltara eX dirancang untuk perjalanan bebas emisi dengan akselerasi halus, pengisian cepat, dan perlindungan baterai.",
    specs: [
      { label: "Motor", value: "Dual Motor" },
      { label: "Baterai", value: "82 kWh" },
      { label: "Jarak tempuh", value: "520 km" },
      { label: "Pengisian cepat", value: "30 menit" }
    ]
  },
  {
    id: 4,
    name: "Kodiak Tourer 2026",
    category: "suv",
    priceIDR: 735000000,
    image: "images/kodiak.svg",
    imageAlt: "SUV Kodiak Tourer berwarna abu-abu",
    summary: "SUV premium berkemampuan tinggi untuk semua medan.",
    description: "Kodiak Tourer menyediakan ruang luas, suspensi nyaman, dan kemampuan jelajah yang percaya diri.",
    specs: [
      { label: "Mesin", value: "2.4L Diesel" },
      { label: "Transmisi", value: "Automatic 8-Speed" },
      { label: "Penggerak", value: "4WD" },
      { label: "Ground clearance", value: "220 mm" }
    ]
  },
  {
    id: 5,
    name: "Velox S 2026",
    category: "sedan",
    priceIDR: 375000000,
    image: "images/velox.svg",
    imageAlt: "Sedan Velox S berwarna merah",
    summary: "Sedan ringkas, elegan, dan hemat untuk aktivitas harian.",
    description: "Velox S menawarkan efisiensi, fitur konektivitas, dan kenyamanan kabin dalam paket yang kompak.",
    specs: [
      { label: "Mesin", value: "1.5L" },
      { label: "Transmisi", value: "CVT" },
      { label: "Penggerak", value: "FWD" },
      { label: "Konsumsi", value: "17 km/liter" }
    ]
  },
  {
    id: 6,
    name: "Voltara City 2026",
    category: "ev",
    priceIDR: 495000000,
    image: "images/voltara.svg",
    imageAlt: "Mobil listrik Voltara City berwarna biru",
    summary: "Mobil listrik kompak yang ideal untuk mobilitas perkotaan.",
    description: "Voltara City mempermudah perjalanan sehari-hari lewat ukuran ringkas, cabang pengisian, dan biaya operasional rendah.",
    specs: [
      { label: "Motor", value: "Single Motor" },
      { label: "Baterai", value: "58 kWh" },
      { label: "Jarak tempuh", value: "410 km" },
      { label: "Pengisian cepat", value: "35 menit" }
    ]
  }
];

function validateCars() {
  const ids = new Set();
  CARS.forEach((car) => {
    if (ids.has(car.id)) console.warn(`Data mobil: ID duplikat ${car.id}`);
    ids.add(car.id);
    ["id", "name", "category", "priceIDR", "image", "imageAlt", "summary", "description", "specs"].forEach((field) => {
      if (car[field] === undefined || car[field] === null || car[field] === "") {
        console.warn(`Data mobil ${car.id}: field "${field}" tidak ada`);
      }
    });
    if (typeof car.priceIDR !== "number" || !Number.isFinite(car.priceIDR)) {
      console.warn(`Data mobil ${car.id}: priceIDR bukan angka`);
    }
    if (!Object.hasOwn(CATEGORY_LABELS, car.category)) {
      console.warn(`Data mobil ${car.id}: kategori tidak dikenal "${car.category}"`);
    }
  });
}
validateCars();
