// 1. GLOBAL DEĞİŞKENLER VE HAFIZA (LOCALSTORAGE)
// Hafızada 'sepetim' varsa çek, yoksa boş dizi [] başlat.
let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
let vitrinUrunleri = []; // API'den gelen ürünleri geçici tutacağımız dizi

// Sayfa açılır açılmaz sağ üstteki Sepet (0) sayacını güncelle
sepetSayaciniGuncelle();


// 2. CANLI API'DEN ÜRÜN ÇEKME FONKSİYONU (index.html için)
async function urunleriGetir(kategori) {
    const vitrin = document.getElementById("urun-vitrini");
    
    // Eğer şu an sepet.html sayfasındaysak (vitrin yoksa) bu fonksiyonu çalıştırma!
    if (!vitrin) return;

    vitrin.innerHTML = "<h2 style='text-align:center; width:100%;'>⏳ Ürünler Sunucudan Çekiliyor...</h2>";

    try {
        // DummyJSON API: Ücretsiz ve Key istemeyen gerçek ürün veritabanı!
        const cevap = await fetch(`https://dummyjson.com/products/category/${kategori}`);
        const veri = await cevap.json();
        
        vitrinUrunleri = veri.products; // Gelen ürünleri global değişkene kaydet
        vitrineBas(vitrinUrunleri);

    } catch (hata) {
        vitrin.innerHTML = "<h2 style='color:red;'>Sunucu bağlantı hatası!</h2>";
    }
}

// 3. GELEN ÜRÜNLERİ VİTRİNE (GRID) DİZME
function vitrineBas(urunler) {
    const vitrin = document.getElementById("urun-vitrini");
    vitrin.innerHTML = "";

    urunler.forEach(urun => {
        const kart = `
            <article class="urun-karti">
                <div>
                    <img src="${urun.thumbnail}" alt="${urun.title}">
                    <h3>${urun.title}</h3>
                    <p style="color:#64748b; font-size:13px;">⭐ Puan: ${urun.rating} | Stok: ${urun.stock}</p>
                </div>
                <div>
                    <div class="urun-fiyat">$${urun.price}</div>
                    <!-- Tıklanınca ürünün benzersiz ID'sini fonksiyona gönderiyoruz -->
                    <button onclick="sepeteEkle(${urun.id})" class="ekle-btn">➕ Sepete Ekle</button>
                </div>
            </article>
        `;
        vitrin.innerHTML += kart;
    });
}

// 4. SEPETE EKLEME İŞLEMİ (LocalStorage Kaydı)
function sepeteEkle(urunId) {
    // Tıklanan ID'ye sahip ürünü vitrinUrunleri dizisinin içinden bul (Array.find)
    const eklenecekUrun = vitrinUrunleri.find(u => u.id === urunId);

    if (eklenecekUrun) {
        sepet.push(eklenecekUrun); // Sepet dizisine ekle
        localStorage.setItem("sepetim", JSON.stringify(sepet)); // Hafızaya kaydet
        
        sepetSayaciniGuncelle(); // Sağ üstteki sayıyı artır

        // HTML5 Ses efektini çal!
        const ses = document.getElementById("sepetSesi");
        if (ses) ses.play();
    }
}

// 5. SAĞ ÜSTTEKİ SEPET SAYACINI GÜNCELLEME
function sepetSayaciniGuncelle() {
    const sayacElemani = document.getElementById("sepetSayaci");
    if (sayacElemani) {
        sayacElemani.innerText = sepet.length;
    }
}


// ==========================================================
// SEPET SAYFASI (sepet.html) TABLO VE HESAPLAMA FONKSİYONLARI
// ==========================================================

function sepetTablosunuCiz() {
    const tabloGovdesi = document.getElementById("sepetTabloGovdesi");
    const toplamAlani = document.getElementById("toplamTutarAlani");

    // Eğer sepet.html sayfasında değilsek dur!
    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = "";
    let genelToplam = 0;

    if (sepet.length === 0) {
        tabloGovdesi.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:30px;'>Sepetinizde henüz ürün bulunmamaktadır.</td></tr>";
        toplamAlani.innerText = "$0.00";
        return;
    }

    // Sepetteki her ürünü tabloya satır (<tr>) olarak ekle ve fiyatını topla!
    sepet.forEach((urun, siraIndex) => {
        genelToplam += urun.price; // Fiyatları üst üste topla

        const satir = `
            <tr>
                <td><img src="${urun.thumbnail}" alt="${urun.title}"></td>
                <td style="font-weight:bold;">${urun.title}</td>
                <td>$${urun.price.toFixed(2)}</td>
                <td>
                    <!-- Sil butonuna ürünün dizideki sıra numarasını (siraIndex) gönderiyoruz -->
                    <button onclick="sepettenSil(${siraIndex})" class="urun-sil-btn">Sil ✖</button>
                </td>
            </tr>
        `;
        tabloGovdesi.innerHTML += satir;
    });

    // Hesaplanan genel toplamı tablonun en altına (tfoot) yazdır
    toplamAlani.innerText = "$" + genelToplam.toFixed(2);
}

// 6. SEPETTEN TEK ÜRÜN SİLME
function sepettenSil(index) {
    sepet.splice(index, 1); // Diziden o sıradaki 1 elemanı kesip atar!
    localStorage.setItem("sepetim", JSON.stringify(sepet)); // Güncel halini hafızaya yaz
    sepetTablosunuCiz(); // Tabloyu ve toplam fiyatı yeniden hesapla
    sepetSayaciniGuncelle();
}

// 7. SEPETİ TAMAMEN BOŞALTMA
function sepetiBosalt() {
    sepet = [];
    localStorage.removeItem("sepetim");
    sepetTablosunuCiz();
    sepetSayaciniGuncelle();
}

// 8. SİPARİŞİ TAMAMLAMA (FORM GÖNDERİMİ)
function siparisiTamamla(olay) {
    olay.preventDefault(); // Sayfa yenilenmesini durdur

    if (sepet.length === 0) {
        alert("HATA: Sepetiniz boşken sipariş veremezsiniz!");
        return;
    }

    const musteri = document.getElementById("musteriAd").value;
    const tutar = document.getElementById("toplamTutarAlani").innerText;

    alert(`🎉 Siparişiniz Alındı Sayın ${musteri}!\nKartınızdan ${tutar} çekilmiştir.\nÜrünleriniz kargoya hazırlanıyor.`);

    // Sipariş bitince sepeti sıfırla ve ana sayfaya yönlendir
    sepetiBosalt();
    window.location.href = "index.html";
}

// SİTE İLK AÇILDIĞINDA ÇALIŞACAK BAŞLANGIÇ KOMUTLARI:
urunleriGetir('laptops'); // Ana sayfadaysak varsayılan olarak Laptopları getir
sepetTablosunuCiz();      // Sepet sayfasındaysak tabloyu çiz
