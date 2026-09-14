import { City, Project, DocumentationPhoto } from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'city-bdg',
    name: 'Bandung',
    province: 'Jawa Barat',
    coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    description: 'Kawasan hunian asri bernuansa pegunungan dengan akses strategis ke pusat kota & tol.',
    order: 1,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'city-jkt',
    name: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    coverImage: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1200&q=80',
    description: 'Pusat bisnis, ruko premium & hunian eksklusif dengan nilai investasi sangat tinggi.',
    order: 2,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'city-bgr',
    name: 'Bogor',
    province: 'Jawa Barat',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    description: 'Kota hijau sejuk, cocok untuk hunian keluarga, villa, maupun kebun produktif.',
    order: 3,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'city-bks',
    name: 'Bekasi',
    province: 'Jawa Barat',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Akses transportasi LRT & Tol terintegrasi, pilihan favorit hunian modern & ruko usaha.',
    order: 4,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'city-tng',
    name: 'Tangerang & BSD',
    province: 'Banten',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Kawasan mandiri modern dengan fasilitas bertaraf internasional dan ruko komersial ramai.',
    order: 5,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'city-ygk',
    name: 'Yogyakarta',
    province: 'DI Yogyakarta',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: 'Kota budaya & pendidikan, potensi investasi kos-kosan eksklusif dan tanah kavling.',
    order: 6,
    createdAt: Date.now() - 86400000 * 5,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-bdg-01',
    cityId: 'city-bdg',
    name: 'Grand Sentra Hills Dago',
    category: 'Rumah',
    address: 'Jl. Dago Giri No. 88, Mekarwangi, Dago Atas, Bandung',
    mapUrl: 'https://maps.google.com/?q=Dago+Bandung',
    price: 850000000,
    priceDisplay: 'Rp 850 Juta',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Cluster hunian modern tropis dengan pemandangan pegunungan Bandung Utara. Lingkungan udara sejuk bebas polusi, one gate security system, dan fasilitas clubhouse keluarga. Dekat dengan berbagai kampus ternama seperti ITB dan UNPAD Dago.',
    landArea: 120,
    buildingArea: 85,
    totalUnits: 36,
    availableUnits: 7,
    bedrooms: 3,
    bathrooms: 2,
    carports: 2,
    floors: 2,
    electricity: '2.200 Watt',
    waterSource: 'PDAM & Artetis Pegunungan',
    certificate: 'SHM (Sertifikat Hak Milik) + PBG/IMB Lengkap',
    facilities: [
      'One Gate System & CCTV 24 Jam',
      'Clubhouse & Kolam Renang',
      'Masjid Cluster & Taman Bermain Anak',
      'Row Jalan Lebar Paving 8 Meter',
      'Jaringan Listrik Underground',
      'Jogging Track Nuansa Pinus'
    ],
    strategicPoints: [
      '10 Menit ke Kawasan Wisata Dago Dream Park',
      '12 Menit ke Kampus ITB & Unpad Dipatiukur',
      '15 Menit ke Gerbang Tol Pasteur',
      '7 Menit ke RS Borromeus Dago'
    ],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', // 1: Fasad Depan
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // 2: Living Room
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', // 3: Master Bedroom
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', // 4: Dapur Modern
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', // 5: Denah / Balkon
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // 6: Gerbang / Lingkungan
    ],
    photoCaptions: [
      'Tampak Depan (Fasad Modern Scandinavian)',
      'Ruang Tamu & Ruang Keluarga Open Space',
      'Kamar Tidur Utama (Master Bedroom En-suite)',
      'Dapur Mewah Kitchen Set Minimalis',
      'Balkon Lantai 2 Mountain View',
      'Main Gate & Suasana Cluster Asri'
    ],
    bsiSchemePhoto: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    bsiSchemePhotoCaption: 'Tabel Angsuran & Simulasi KPR Syariah Bank BSI (Tenor 5 - 20 Tahun, Margin Tetap Murabahah)',
    cashBertahapSchemePhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    cashBertahapSchemePhotoCaption: 'Tabel Skema Cicilan Cash Bertahap Inhouse Developer 12x - 36x (Bunga 0%, Bebas Denda/Sita)',
    featured: true,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'proj-bdg-02',
    cityId: 'city-bdg',
    name: 'Kavling Harmoni Sentra Cimenyan',
    category: 'Tanah Kavling',
    address: 'Kecamatan Cimenyan, Kabupaten Bandung',
    mapUrl: 'https://maps.google.com/?q=Cimenyan+Bandung',
    price: 320000000,
    priceDisplay: 'Rp 320 Juta',
    paymentSchemes: ['Cash', 'Cash Bertahap'],
    description: 'Tanah kavling siap bangun dengan kontur matang di dataran tinggi Bandung Timur. Sangat cocok untuk villa keluarga, homestay wisata, ataupun investasi tanah bernilai tinggi dengan legalitas SHM per kavling sudah splitzing resmi.',
    landArea: 200,
    buildingArea: 0,
    totalUnits: 18,
    availableUnits: 4,
    bedrooms: 0,
    bathrooms: 0,
    carports: 0,
    floors: 0,
    electricity: 'Tersedia Jaringan PLN Depan Lokasi',
    waterSource: 'Mata Air Gunung Melimpah',
    certificate: 'SHM Per Kavling (Split)',
    facilities: [
      'Jalan Masuk Aspal & Row Cor 6 Meter',
      'Saluran Drainase Permanen Terpasang',
      'Pilar Batas Patok BPN Resmi',
      'Pemandangan Citylight Bandung 180 Derajat'
    ],
    strategicPoints: [
      '15 Menit ke Gedung Sate & Pusat Kota Bandung',
      '10 Menit ke Objek Wisata Caringin Tilu',
      'Bebas Banjir & Bebas Longsor'
    ],
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', // 1: Lahan Hijau
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // 2: View Bandung
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // 3: Kontur Lahan
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80', // 4: Akses Jalan
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // 5: Site Plan Topografi
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80', // 6: Panorama Senja
    ],
    photoCaptions: [
      'Hamparan Kavling Siap Bangun Siap Pondasi',
      'Citylight & Panorama Bandung dari Lokasi',
      'Kontur Tanah Datar dan Padat Alami',
      'Akses Jalan Masuk Lebar Cor Beton',
      'Site Plan Zonasi Kavling Matang',
      'Suasana Sunset Sore Hari di Lokasi'
    ],
    cashBertahapSchemePhoto: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80',
    cashBertahapSchemePhotoCaption: 'Tabel Skema Cicilan Kavling Bertahap 12 Bulan (Tanpa Bunga / Syariah Developer)',
    featured: false,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'proj-jkt-01',
    cityId: 'city-jkt',
    name: 'Sentra Business Ruko Fatmawati',
    category: 'Ruko',
    address: 'Jl. RS Fatmawati Raya No. 45, Cilandak, Jakarta Selatan',
    mapUrl: 'https://maps.google.com/?q=Fatmawati+Jakarta+Selatan',
    price: 3600000000,
    priceDisplay: 'Rp 3.6 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Ruko komersial 3.5 lantai di jalan protokol utama Fatmawati Jakarta Selatan. Sangat strategis untuk kantor, klinik estetika, cafe resto, kantor notaris, maupun ekspedisi. Area parkir luas dengan captive market ekspatriat dan perkantoran.',
    landArea: 95,
    buildingArea: 260,
    totalUnits: 8,
    availableUnits: 2,
    bedrooms: 0,
    bathrooms: 4,
    carports: 4,
    floors: 3,
    electricity: '11.000 Watt (3 Phase)',
    waterSource: 'Jetpump & Filter Air Industri',
    certificate: 'HGB Murni (Dapat ditingkatkan ke SHM)',
    facilities: [
      'Parkir Depan Luas Muat 4-5 Mobil Pribadi',
      'Instalasi Fiber Optik Kecepatan Tinggi',
      'Lift Barang / Slot Provision Lift Penumpang',
      'Rooftop Deck dengan View Sudirman - Simatupang',
      'Security Pos & Hydrant Pemadam Kebakaran'
    ],
    strategicPoints: [
      '3 Menit ke Stasiun MRT Fatmawati & MRT Cipete',
      '5 Menit ke Akses Pintu Tol TB Simatupang / JORR',
      '7 Menit ke Cilandak Town Square (Citos)',
      'Depan Koridor Transportasi Utama 24 Jam'
    ],
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80', // 1: Fasad Ruko
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', // 2: Lantai 1 Komersial
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', // 3: Ruang Kerja Lantai 2
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80', // 4: Meeting Room
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', // 5: Rooftop Area
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // 6: Kawasan Bisnis
    ],
    photoCaptions: [
      'Fasad Ruko Modern Minimalis Kaca Curtain Wall',
      'Lantai 1 Luas Siap Showroom / Resto / Bank',
      'Lantai 2 Partisi Kantor & Executive Office',
      'Lantai 3 Meeting Room & Breakout Lounge',
      'Rooftop View Gedung TB Simatupang',
      'Area Parkir Luas dan Akses Jalan Protokol'
    ],
    bsiSchemePhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    bsiSchemePhotoCaption: 'Tabel Pembiayaan Griya Bisnis / Komersial Bank BSI (Tenor hingga 15 Tahun)',
    cashBertahapSchemePhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    cashBertahapSchemePhotoCaption: 'Skema Angsuran Cash Bertahap Developer 24 Bulan Ruko Komersial',
    featured: true,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 22,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'proj-bgr-01',
    cityId: 'city-bgr',
    name: 'Kebun Durian Musang King & Villa Sentra Puncak',
    category: 'Tanah Kebun',
    address: 'Kecamatan Megamendung, Puncak, Bogor',
    mapUrl: 'https://maps.google.com/?q=Megamendung+Bogor',
    price: 1250000000,
    priceDisplay: 'Rp 1.25 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Tanah kebun produktif seluas 2.500 m² yang sudah ditanami 60 pohon Durian Musang King & Black Thorn usia produktif, plus bonus 1 unit Wooden Villa Glamping. Penghasilan panen durian rutin dan potensi disewakan villa harian.',
    landArea: 2500,
    buildingArea: 75,
    totalUnits: 1,
    availableUnits: 1,
    bedrooms: 2,
    bathrooms: 2,
    carports: 6,
    floors: 1,
    electricity: '3.500 Watt',
    waterSource: 'Mata Air Alami Gunung Pangrango',
    certificate: 'SHM Bersih Clear & Clean',
    facilities: [
      '60 Pohon Durian Musang King Berbuah Rutin',
      'Sistem Irigasi Tetes Otomatis (Drip Irrigation)',
      '1 Unit Villa Kayu Jati Etnik Siap Huni',
      'Pagar Keliling Lahan & Rumah Penjaga Kebun',
      'Kolam Ikan Air Tawar & Gazebo Santai'
    ],
    strategicPoints: [
      '15 Menit dari Gerbang Tol Ciawi / Gadog',
      'Bebas Jalur Ganjil Genap Lewat Jalur Alternatif',
      'Udara 19-23 Derajat Celsius Sejuk Alami'
    ],
    photos: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80', // 1: Pohon Buah Kebun
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80', // 2: Lahan Hijau
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80', // 3: Wooden Villa
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80', // 4: Interior Villa
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80', // 5: Gazebo & View
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', // 6: Hamparan Kebun
    ],
    photoCaptions: [
      'Kebun Durian Musang King Subur Terawat',
      'Pohon Durian Berbunga dan Berbuah Lebat',
      'Unit Villa Kayu Santai di Tengah Kebun',
      'Interior Kamar Villa Nuansa Hangat',
      'Gazebo dan Kolam Ikan Santai Keluarga',
      'Akses Masuk Mobil Sampai ke Titik Kebun'
    ],
    featured: true,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 16,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'proj-ygk-01',
    cityId: 'city-ygk',
    name: 'Sentra Kost Eksklusif UGM Pogung',
    category: 'Kosan',
    address: 'Pogung Baru Blok C, Mlati, Sleman, DI Yogyakarta',
    mapUrl: 'https://maps.google.com/?q=Pogung+UGM+Yogyakarta',
    price: 2450000000,
    priceDisplay: 'Rp 2.45 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Investasi properti passive income tinggi! Rumah kosan 14 kamar tidur (semua kamar mandi dalam, AC, water heater, full furnished) dengan occupancy rate rata-rata 95-100% per tahun. Terletak di zona ring 1 kampus UGM Yogyakarta.',
    landArea: 180,
    buildingArea: 320,
    totalUnits: 14,
    availableUnits: 2,
    bedrooms: 14,
    bathrooms: 14,
    carports: 3,
    floors: 2,
    electricity: 'Token Tiap Kamar 1.300W + Induk 5.500W',
    waterSource: 'Sumur Bor Dalam Jernih & Toren Otomatis',
    certificate: 'SHM + IMB Rumah Kost Lengkap',
    facilities: [
      '14 Kamar Full Furnished (Springbed, Lemari, Meja Kerja, AC, Smart TV)',
      'Kamar Mandi Dalam dengan Shower & Water Heater',
      'Dapur Bersama Lengkap Kulkas & Microwave',
      'Parkir Motor Luas Muat 16 Motor + 3 Mobil',
      'WiFi Mesh Dedicated 200 Mbps & CCTV 8 Titik',
      'Penjaga Kos Standby & Akses Fingerprint / Kartu Pintar'
    ],
    strategicPoints: [
      '4 Menit ke Fakultas Kedokteran & Teknik UGM',
      '5 Menit ke RSUP Dr. Sardjito Yogyakarta',
      '7 Menit ke Kawasan Kuliner Kaliurang & Hartono Mall',
      'Omset Bruto Rp 28 - 32 Juta / Bulan'
    ],
    photos: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80', // 1: Fasad Kost
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', // 2: Kamar Kost
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', // 3: Meja Kerja Kamar
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80', // 4: Kamar Mandi
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80', // 5: Dapur Bersama
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', // 6: Parkir & Lobby
    ],
    photoCaptions: [
      'Bangunan Kost 2 Lantai Mewah Konsep Industrial Tropis',
      'Interior Kamar Tidur Full Furnished Siap Sewa',
      'Fasilitas Meja Belajar/Kerja Mahasiswa & Jendela Terang',
      'Kamar Mandi Dalam Keramik Modern & Sanitari Toto',
      'Dapur Bersama Bersih & Ruang Santai Penghuni',
      'Lobby Depan, Pos Keamanan & Area Parkir Motor'
    ],
    featured: true,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'proj-bgr-02',
    cityId: 'city-bgr',
    name: 'Lahan Tambang Andesit & Pasir Sentra Rumpin',
    category: 'Tanah Tambang',
    address: 'Kecamatan Rumpin, Kabupaten Bogor, Jawa Barat',
    mapUrl: 'https://maps.google.com/?q=Rumpin+Bogor',
    price: 7800000000,
    priceDisplay: 'Rp 7.8 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap'],
    description: 'Lahan tambang batuan andesit keras & pasir cor berkualitas tinggi seluas 4,2 Hektar. Memiliki izin IUP Eksplorasi & Operasi yang masih aktif, cadangan batuan masif teruji laboratorium geologi, dan akses jalan tronton/dump truck lebar.',
    landArea: 42000,
    buildingArea: 120,
    totalUnits: 1,
    availableUnits: 1,
    bedrooms: 0,
    bathrooms: 2,
    carports: 10,
    floors: 1,
    electricity: '33.000 Watt Industri (Gardu Sendiri)',
    waterSource: 'Sumur Dalam Industri & Kolam Penampungan',
    certificate: 'SHM Hak Milik Pemilik + Izin IUP Lengkap',
    facilities: [
      'Izin Usaha Pertambangan (IUP) Aktif & AMDAL Terbit',
      'Cadangan Batu Andesit Diperkirakan > 1.2 Juta m³',
      'Kantor Lapangan, Mess Karyawan & Pos Timbang Jembatan',
      'Akses Jalan Diperkeras Masuk Truk Tronton & Trailer',
      'Jaringan Listrik Trafo Khusus Stone Crusher'
    ],
    strategicPoints: [
      'Dekat Koridor Suplai Material Proyek Tol Serpong-Balaraja',
      '20 Menit ke Kawasan Industri Tangerang Selatan',
      'Kualitas Batuan Lolos Uji Tekan Bina Marga'
    ],
    photos: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80', // 1: Tebing Batuan
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80', // 2: Alat Berat / Site
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80', // 3: Area Tambang
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // 4: Stockpile Material
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', // 5: Akses Jalan Truk
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80', // 6: Peta Geologi Cadangan
    ],
    photoCaptions: [
      'Deposit Tebing Batuan Andesit Masif Padat',
      'Area Operasional Penambangan & Manuver Unit',
      'Pos Timbangan Kendaraan & Kantor Direksi Keet',
      'Stockpile Batuan Split & Abu Batu Siap Kirim',
      'Akses Jalan Cor Masuk Truk Muatan Berat',
      'Peta Kontur & Bukti Uji Geolistrik Cadangan'
    ],
    featured: false,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'proj-tng-01',
    cityId: 'city-tng',
    name: 'Sentra Botanica Residence BSD',
    category: 'Rumah',
    address: 'Kawasan BSD City Sektor 9, Pagedangan, Tangerang',
    mapUrl: 'https://maps.google.com/?q=BSD+City+Tangerang',
    price: 1450000000,
    priceDisplay: 'Rp 1.45 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Hunian Smart Home 2 lantai berdesain Compact Luxury di kawasan premium BSD. Dilengkapi teknologi solar panel hemat energi, digital door lock, smart lighting, dan sistem resapan biopori mandiri.',
    landArea: 105,
    buildingArea: 110,
    totalUnits: 24,
    availableUnits: 5,
    bedrooms: 4,
    bathrooms: 3,
    carports: 2,
    floors: 2,
    electricity: '3.500 Watt + Hybrid Solar Panel',
    waterSource: 'PDAM Premium Tirta Benteng',
    certificate: 'SHM + PBG Split Siap AJB',
    facilities: [
      'Smart Home IoT (Door Lock, CCTV, AC Control)',
      'Clubhouse Kolam Renang Infinity & Gym Center',
      'Children Playground & Reflexology Path',
      'Security Patrol 24 Jam & Panic Button'
    ],
    strategicPoints: [
      '5 Menit ke ICE BSD & AEON Mall BSD',
      '7 Menit ke Gerbang Tol BSD - Bintaro - Jakarta',
      '8 Menit ke Stasiun KRL Cisauk Intermoda'
    ],
    photos: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', // 1: Fasad Luxury
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', // 2: Living Room
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', // 3: Bedroom
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80', // 4: Dapur & Dining
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', // 5: Kamar Mandi
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80', // 6: Kolam Renang Cluster
    ],
    photoCaptions: [
      'Tampak Depan Rumah 2 Lantai Desain Kontemporer',
      'Ruang Keluarga Lapang Pencahayaan Alami Maksimal',
      'Kamar Tidur Utama Luas dengan Jendela Lebar',
      'Ruang Makan & Dapur Bersih Marmer Elegan',
      'Kamar Mandi Mewah Kering Sanitari Premium',
      'Fasilitas Kolam Renang & Clubhouse Warga'
    ],
    featured: true,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'proj-bks-01',
    cityId: 'city-bks',
    name: 'Sentra Boulevard Commercial Grand Galaxy',
    category: 'Ruko',
    address: 'Boulevard Raya Grand Galaxy City, Bekasi Selatan',
    mapUrl: 'https://maps.google.com/?q=Grand+Galaxy+City+Bekasi',
    price: 1950000000,
    priceDisplay: 'Rp 1.95 Miliar',
    paymentSchemes: ['Cash', 'Cash Bertahap', 'Bank BSI'],
    description: 'Ruko 2.5 lantai di jalur utama Grand Galaxy City dengan traffic pengunjung ribuan orang per hari. Sangat cocok untuk franchise kuliner, klinik kecantikan, kursus pendidikan, atau kantor cabang perbankan.',
    landArea: 75,
    buildingArea: 160,
    totalUnits: 12,
    availableUnits: 3,
    bedrooms: 0,
    bathrooms: 3,
    carports: 3,
    floors: 3,
    electricity: '5.500 Watt',
    waterSource: 'PDAM',
    certificate: 'SHGB Murni',
    facilities: [
      'Parkir Depan On-Street Sangat Luas',
      'Bebas Banjir dan Drainase Rapi Bawah Tanah',
      'Pencahayaan LED & Plafon Tinggi 3.8 Meter Tiap Lantai'
    ],
    strategicPoints: [
      '5 Menit ke Mall Grand Galaxy Park',
      '8 Menit ke Pintu Tol Bekasi Barat & Tol Becakayu',
      '10 Menit ke Stasiun LRT Cikunir'
    ],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    photoCaptions: [
      'Fasad Ruko 3 Lantai Tampak Depan',
      'Area Bisnis Lantai 1 Los Tanpa Sekat',
      'Lantai 2 Kantor Nyaman Siap Pakai',
      'Pemandangan Kawasan Komersial Ramai',
      'Area Parkir Depan dan Akses Jalan Kembar',
      'Kamar Mandi & Fasilitas Utilitas Lengkap'
    ],
    featured: false,
    status: 'Tersedia',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 1,
  }
];

export const INITIAL_DOCUMENTATION: DocumentationPhoto[] = [
  {
    id: 'doc-1',
    title: 'Serah Terima Kunci Unit & Dokumen SHM',
    caption: 'Momen penuh kebahagiaan serah terima kunci rumah dan berkas legalitas SHM kepada konsumen di Cluster Grand Sentra Bandung.',
    photoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    category: 'Akad & Serah Terima',
    date: '2026-08-25',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7
  },
  {
    id: 'doc-2',
    title: 'Progress Pengecoran Struktur Lantai 2',
    caption: 'Dokumentasi mutu konstruksi pengecoran lantai 2 dengan beton mutu K-250 dan pembesian standar SNI pada unit Blok B.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    category: 'Progress Bangun',
    date: '2026-08-20',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: 'doc-3',
    title: 'Survey Serentak & Konsultasi Syariah',
    caption: 'Antusiasme para calon pembeli saat gathering survey lokasi bersama tim arsitek dan konsultan syariah di Sentra Hills Bogor.',
    photoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    category: 'Survey Lokasi',
    date: '2026-08-15',
    createdAt: Date.now() - 86400000 * 17,
    updatedAt: Date.now() - 86400000 * 17
  },
  {
    id: 'doc-4',
    title: 'Finishing Fasad Modern Minimalis',
    caption: 'Tahap pemasangan kusen aluminium premium, cat eksterior weatherproof, dan batu alam fasad tipe 45 siap huni.',
    photoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    category: 'Progress Bangun',
    date: '2026-08-10',
    createdAt: Date.now() - 86400000 * 22,
    updatedAt: Date.now() - 86400000 * 22
  },
  {
    id: 'doc-5',
    title: 'Penandatanganan Akad Syariah Tanpa Riba',
    caption: 'Prosesi penandatanganan akad jual beli cash bertahap bebas denda & bebas sita di kantor pemasaran Sentra Properti.',
    photoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    category: 'Akad & Serah Terima',
    date: '2026-08-05',
    createdAt: Date.now() - 86400000 * 27,
    updatedAt: Date.now() - 86400000 * 27
  },
  {
    id: 'doc-6',
    title: 'Kunjungan Lapangan & Penentuan Kavling',
    caption: 'Konsumen menentukan posisi kavling sudut favorit dengan pemandangan pegunungan asri didampingi tim marketing.',
    photoUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    category: 'Survey Lokasi',
    date: '2026-07-28',
    createdAt: Date.now() - 86400000 * 35,
    updatedAt: Date.now() - 86400000 * 35
  }
];
