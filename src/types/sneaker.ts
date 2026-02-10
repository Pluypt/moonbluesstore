export interface ResellPrice {
    stockX?: number;
    goat?: number;
    flightClub?: number;
}

export interface ResellLinks {
    stockX?: string;
    goat?: string;
    flightClub?: string;
}

export interface Sneaker {
    styleID: string;       // SKU (e.g., "DZ5485-612") - ใช้เป็น ID หลัก
    shoeName: string;      // ชื่อรุ่น
    brand: string;         // แบรนด์
    silhoutte: string;     // ทรงรองเท้า (e.g., Jordan 1)
    colorway: string;      // สี
    retailPrice: number;   // ราคาป้าย (USD)
    thumbnail: string;     // รูปหลัก
    imageLinks: string[];  // รูปทั้งหมด
    lowestResellPrice: ResellPrice; // ราคาตลาด
    resellLinks: ResellLinks;       // Link ไปเว็บ Resell
    description?: string;
    urlKey?: string;
}
