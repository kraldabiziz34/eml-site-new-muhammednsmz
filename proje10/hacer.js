// Global Değişkenlerimiz
var ilerleme = 0;
var kilitKirmaZamanlayici; // setInterval için
var sifreDondurmeZamanlayici; // setInterval için

// GÖREV 3: Diziye (Array) Kendi Loglarını Ekle
// Sahte log mesajlarını bir DİZİ (Array) içinde tutuyoruz.
var sahteLoglar = [
    "> Güvenlik duvarı atlanıyor...",
    "> Şifreleme algoritmaları çözülüyor...",
    "> Veritabanı portları taranıyor...",
    "> Yönetici (Admin) yetkileri alınıyor...",
    "> Veriler indiriliyor...",
    // Ekstra loglar (Görev 3)
    "> Kamera sistemleri devre dışı bırakılıyor...",
    "> Biyometrik tarama bypass ediliyor...",
    "> Ana sunucuya root erişimi sağlandı..."
];

// Butona tıklandığında çalışacak ana fonksiyon
function kodKirmayiBaslat() {
    // 1. Butonu devre dışı bırakalım ki bir daha basamasınlar
    var btn = document.getElementById("baslatBtn");
    btn.disabled = true;
    btn.innerHTML = "[ İŞLEM DEVAM EDİYOR... ]";

    // 2. Rastgele Şifre Döndürme İşlemi (Her 50 milisaniyede bir çalışır - Çok hızlı)
    sifreDondurmeZamanlayici = setInterval(rastgeleSifreUret, 50);

    // GÖREV 2: Hızı Ayarla (20 Saniye Kuralı)
    // Toplam 100 birim ilerleme var. 20 saniye (20000 ms) sürmeli.
    // 20000 / 100 = 200 milisaniyede bir çalışmalı.
    kilitKirmaZamanlayici = setInterval(barDoldur, 200);
}

// Şifre ekranında film efekti gibi rastgele rakamlar çıkaran fonksiyon
function rastgeleSifreUret() {
    var s1 = Math.floor(Math.random() * 9999);
    var s2 = Math.floor(Math.random() * 9999);
    var s3 = Math.floor(Math.random() * 9999);
    var s4 = Math.floor(Math.random() * 9999);

    document.getElementById("ekran").innerHTML = s1 + "-" + s2 + "-" + s3 + "-" + s4;
}

// Progress Barı (İlerleme çubuğunu) dolduran fonksiyon
function barDoldur() {
    // Her çalışmada ilerlemeyi 1 artır (Daha yavaş ve sinematik olması için)
    ilerleme = ilerleme + 1; 
    
    // HTML'deki <progress> etiketinin value değerini güncelliyoruz
    document.getElementById("yuklemeBari").value = ilerleme;
    document.getElementById("yuzdeYazi").innerHTML = "%" + ilerleme + " Tamamlandı";

    // Rastgele bir log mesajını ekrana yazdırma
    // Sadece belli aralıklarla log ekleyelim ki çok kalabalık olmasın
    if (ilerleme % 5 === 0) { 
        var rastgeleIndex = Math.floor(Math.random() * sahteLoglar.length);
        var yeniLog = document.createElement("li");
        yeniLog.innerHTML = sahteLoglar[rastgeleIndex];
        document.getElementById("logListesi").appendChild(yeniLog);
        
        // Listenin en altına otomatik kaydır
        var liste = document.getElementById("logListesi");
        liste.scrollTop = liste.scrollHeight;
    }

    // EĞER İLERLEME %100 OLDUYSA (İşlem Bitti)
    if (ilerleme >= 100) {
        // Zamanlayıcıları (Döngüleri) durdur
        clearInterval(kilitKirmaZamanlayici);
        clearInterval(sifreDondurmeZamanlayici);

        // GÖREV 1: Kırmızı Alarm (Sistem Kilitleme)
        var ekran = document.getElementById("ekran");
        ekran.innerHTML = "SİSTEM KİLİTLENDİ<br>POLİS ARANIYOR";
        ekran.style.color = "white";
        ekran.style.backgroundColor = "red";
        ekran.style.borderColor = "red";
        ekran.style.textShadow = "0 0 10px red";
        
        // Butonun durumunu değiştir
        var btn = document.getElementById("baslatBtn");
        btn.innerHTML = "[ ERİŞİM ENGELLENDİ ]";
        btn.style.borderColor = "red";
        btn.style.color = "red";
        
        // Sayfayı kırmızı alarm moduna al (Arka planı hafif kırmızı yap)
        document.body.style.backgroundColor = "#1a0000";
        document.querySelector(".terminal-kutusu").style.borderColor = "red";
        document.querySelector(".terminal-kutusu").style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.5)";
    }
}