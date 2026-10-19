// =========================================================
// UZAY GEMİSİ ANA BİLGİSAYARI - app.js
// Tüm sayfaların "beynidir". Fonksiyonlar onclick ile çağrılır.
// =========================================================

// ---------------------------------------------------------
// 1. ŞİFRE GİRİŞ FONKSİYONU (index.html için)
// ---------------------------------------------------------
function girisYap() {
    // DOM Seçici: HTML'deki şifre kutusunun İÇİNDEKİ DEĞERİ (value) alıp değişkene atıyoruz.
    var girilenSifre = document.getElementById("sifreKutusu").value;

    // Şartlı İfade (If-Else) - ÇOKLU ŞİFRE KONTROLÜ
    if (girilenSifre == "2025" || girilenSifre == "1947" || girilenSifre == "1980") {
        // Şifre doğruysa:
        document.getElementById("mesajAlani").innerHTML = "Erişim Onaylandı. Hoş geldiniz Kaptan.";
        document.getElementById("mesajAlani").style.color = "cyan"; // CSS'e JS ile müdahale!

        // Gizli menüyü görünür yapıyoruz!
        document.getElementById("gizliMenu").style.display = "block";

        // Kutuyu gizleyelim
        document.getElementById("sifreKutusu").style.display = "none";
    } else {
        // Şifre yanlışsa:
        document.getElementById("mesajAlani").innerHTML = "HATA: Geçersiz Erişim Kodu!";
        document.getElementById("mesajAlani").style.color = "red";
    }
}

// ---------------------------------------------------------
// 2. KALKAN KONTROL FONKSİYONU (kontrol.html için)
//    Parametre Alan Fonksiyon: gelen veri 'ac' veya 'kapat' olur.
// ---------------------------------------------------------
function kalkanYonet(durum) {

    // Ortak kullanacağımız hedef kutuyu bir değişkene atayalım ki kod kısa olsun.
    var kutu = document.getElementById("kalkanDurumu");

    if (durum == "ac") {
        kutu.innerHTML = "KALKANLAR AKTİF (Maksimum Koruma)";
        kutu.className = "durum-kutusu mavi"; // Class'ı değiştirip CSS'i güncelledik!
    }
    else if (durum == "kapat") {
        kutu.innerHTML = "KALKANLAR DEVRE DIŞI (Tehlike)";
        kutu.className = "durum-kutusu kirmizi";
    }
    else if (durum == "yokoldu") {
        kutu.innerHTML = "SİSTEM ÇÖKTÜ - KALKANLAR YOK EDİLDİ!";
        kutu.className = "durum-kutusu siyah-yanip-sonen";
    }
}

// ---------------------------------------------------------
// 3. OKSİJEN HESAPLAYICI (personel.html için)
//    Switch-Case ve Return Kullanımı
// ---------------------------------------------------------

// Ana fonksiyon
function oksijenHesapla() {
    var rutbe = document.getElementById("rutbeSecim").value;

    // Yardımcı fonksiyona rütbeyi gönderip, dönen (return) sonucu alıyoruz.
    var harcananLitre = litreBul(rutbe);

    // Sonucu Ekrana Yazdırma
    document.getElementById("sonucAlani").innerHTML = "Günlük Tüketim: " + harcananLitre + " Litre";
}

// Geriye Değer Döndüren Yardımcı Fonksiyon
function litreBul(gelenRutbe) {
    var litre = 0;

    // Switch-Case yapısı: Bir değişkenin çok fazla ihtimali varsa If-Else yerine kullanılır.
    switch (gelenRutbe) {
        case "kaptan":
            litre = 450; // Kaptan stresli, çok nefes alıyor :)
            break; // İşlem bitince bloktan çık!
        case "muhendis":
            litre = 600; // Efor sarf ediyor
            break;
        case "bilim":
            litre = 300; // Sakin sakin oturuyor
            break;
        case "isci":
            litre = 800; // İşçiler ağır efor sarf ediyor
            break;
        default:
            litre = 0; // Hiçbiri değilse
    }

    // Hesaplanan değeri asıl fonksiyona GERİ DÖNDÜR (Return)
    return litre;
}