# TextilCraft - Tekstil Sektörü Shopify Web Sitesi

Premium tekstil ve kumaş e-ticaret web sitesi. Shopify'da yayınlanmak üzere HTML, CSS ve JavaScript ile geliştirilmiştir.

## Sayfalar

- **Ana Sayfa** (`index.html`) - Hero bölümü, kategoriler, öne çıkan ürünler, hakkımızda, müşteri yorumları, bülten
- **Ürünler** (`products.html`) - Ürün kataloğu, filtreleme, sıralama, sayfalama
- **Hakkımızda** (`about.html`) - Şirket hikayesi, değerler, ekip, istatistikler
- **İletişim** (`contact.html`) - İletişim formu, bilgiler, harita, SSS

## Özellikler

- Tam responsive tasarım (mobil, tablet, masaüstü)
- Ürün filtreleme ve sıralama
- Alışveriş sepeti (localStorage ile)
- Favori ürün listesi
- Scroll animasyonları
- Sayaç animasyonları
- Mobil hamburger menü
- Yukarı çık butonu
- Bülten abone formu
- İletişim formu doğrulama
- SSS açılır-kapanır bölümü
- Preloader animasyonu
- Toast bildirim sistemi

## Teknolojiler

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid, Animations)
- Vanilla JavaScript (ES5 uyumlu)
- Google Fonts (Playfair Display, Poppins)
- Font Awesome 6 (ikonlar)
- Unsplash (örnek görseller)

## Kurulum

Dosyaları doğrudan bir web sunucusuna yükleyin veya Shopify temasına entegre edin.

```bash
# Yerel olarak çalıştırmak için
python3 -m http.server 8000
# veya
npx serve .
```

## Dosya Yapısı

```
shopify/
├── index.html          # Ana sayfa
├── products.html       # Ürünler sayfası
├── about.html          # Hakkımızda sayfası
├── contact.html        # İletişim sayfası
├── css/
│   └── style.css       # Ana stil dosyası
├── js/
│   └── main.js         # Ana JavaScript dosyası
├── assets/
│   └── images/         # Görseller klasörü
└── README.md
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
