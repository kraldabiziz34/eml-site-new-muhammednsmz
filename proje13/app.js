/* =========================================================
   1. GLOBAL DEĞİŞKENLER VE HAFIZA
========================================================= */

let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
let vitrinUrunleri = [];

const DOLAR_KURU = 34;
const KARGO_UCRETI = 50;
const UCRETSIZ_KARGO_SINIRI = 1000;
const INDIRIM_ORANI = 0.20;

let kuponAktif = false;


/* =========================================================
   2. PARA BİRİMİ DÖNÜŞÜMÜ
========================================================= */

function tlFormatla(dolar) {
    return (dolar * DOLAR_KURU).toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY"
    });
}


/* =========================================================
   3. SEPET TUTARLARINI HESAPLAMA
========================================================= */

function sepetTutarlariniHesapla() {
    // Ürünlerin dolar cinsinden toplamı
    const araToplam = sepet.reduce(
        (toplam, urun) => toplam + Number(urun.price || 0),
        0
    );

    // Sepet boş değilse ve 1000$ altındaysa 50$ kargo
    let kargo = 0;

    if (sepet.length > 0 && araToplam < UCRETSIZ_KARGO_SINIRI) {
        kargo = KARGO_UCRETI;
    }

    // Ürünler + kargo
    const kargoDahilToplam = araToplam + kargo;

    // MESLEK11 kuponu ile %20 indirim
    const indirim = kuponAktif
        ? kargoDahilToplam * INDIRIM_ORANI
        : 0;

    const genelToplam = kargoDahilToplam - indirim;

    return {
        araToplam,
        kargo,
        indirim,
        genelToplam
    };
}


/* =========================================================
   4. API'DEN ÜRÜNLERİ GETİRME
========================================================= */

async function urunleriGetir(kategori) {
    const vitrin = document.getElementById("urun-vitrini");

    if (!vitrin) return;

    vitrin.innerHTML =
        "<h2 style='text-align:center; width:100%;'>⏳ Ürünler Yükleniyor...</h2>";

    try {
        const cevap = await fetch(
            `https://dummyjson.com/products/category/${kategori}`
        );

        if (!cevap.ok) {
            throw new Error("Ürünler alınamadı.");
        }

        const veri = await cevap.json();

        vitrinUrunleri = veri.products;
        vitrineBas(vitrinUrunleri);

    } catch (hata) {
        vitrin.innerHTML =
            "<h2 style='color:red;'>Sunucu bağlantı hatası!</h2>";
    }
}


/* =========================================================
   5. ÜRÜNLERİ VİTRİNE YERLEŞTİRME
========================================================= */

function vitrineBas(urunler) {
    const vitrin = document.getElementById("urun-vitrini");

    if (!vitrin) return;

    vitrin.innerHTML = "";

    urunler.forEach(urun => {
        const kart = `
            <article class="urun-karti">
                <div>
                    <img src="${urun.thumbnail}" alt="${urun.title}">
                    <h3>${urun.title}</h3>

                    <p style="color:#64748b; font-size:13px;">
                        ⭐ Puan: ${urun.rating} | Stok: ${urun.stock}
                    </p>
                </div>

                <div>
                    <div class="urun-fiyat">
                        ${tlFormatla(urun.price)}
                    </div>

                    <button
                        onclick="sepeteEkle(${urun.id})"
                        class="ekle-btn"
                    >
                        ➕ Sepete Ekle
                    </button>
                </div>
            </article>
        `;

        vitrin.innerHTML += kart;
    });
}


/* =========================================================
   6. SEPETE ÜRÜN EKLEME
========================================================= */

function sepeteEkle(urunId) {
    const eklenecekUrun = vitrinUrunleri.find(
        urun => urun.id === urunId
    );

    if (!eklenecekUrun) return;

    sepet.push(eklenecekUrun);

    localStorage.setItem("sepetim", JSON.stringify(sepet));

    sepetSayaciniGuncelle();
    sepetTablosunuCiz();

    const ses = document.getElementById("sepetSesi");

    if (ses) {
        ses.play().catch(() => {});
    }
}


/* =========================================================
   7. SEPET SAYACINI GÜNCELLEME
========================================================= */

function sepetSayaciniGuncelle() {
    const sayacElemani = document.getElementById("sepetSayaci");

    if (sayacElemani) {
        sayacElemani.innerText = sepet.length;
    }
}


/* =========================================================
   8. SEPET TABLOSUNU ÇİZME
   GÖREV 4: KARGO ÜCRETİ
   GÖREV 5: MARKA SÜTUNU
========================================================= */

function sepetTablosunuCiz() {
    const tabloGovdesi = document.getElementById("sepetTabloGovdesi");
    const araToplamAlani = document.getElementById("araToplamAlani");
    const kargoAlani = document.getElementById("kargoTutariAlani");
    const indirimAlani = document.getElementById("indirimTutariAlani");
    const toplamAlani = document.getElementById("toplamTutarAlani");

    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = "";

    if (sepet.length === 0) {
        tabloGovdesi.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center; padding:30px;">
                    Sepetinizde henüz ürün bulunmamaktadır.
                </td>
            </tr>
        `;
    } else {
        sepet.forEach((urun, siraIndex) => {
            const marka = urun.brand || "Belirtilmemiş";

            const satir = `
                <tr>
                    <td>
                        <img src="${urun.thumbnail}" alt="${urun.title}">
                    </td>

                    <td style="font-weight:bold;">
                        ${urun.title}
                    </td>

                    <td>${marka}</td>

                    <td>${tlFormatla(Number(urun.price || 0))}</td>

                    <td>
                        <button
                            onclick="sepettenSil(${siraIndex})"
                            class="urun-sil-btn"
                        >
                            Sil ✖
                        </button>
                    </td>
                </tr>
            `;

            tabloGovdesi.innerHTML += satir;
        });
    }

    // Ürün, kargo, indirim ve genel toplamı hesapla
    const tutarlar = sepetTutarlariniHesapla();

    if (araToplamAlani) {
        araToplamAlani.innerText = tlFormatla(tutarlar.araToplam);
    }

    if (kargoAlani) {
        if (tutarlar.kargo === 0) {
            kargoAlani.innerText = "Ücretsiz";
        } else {
            kargoAlani.innerText = tlFormatla(tutarlar.kargo);
        }
    }

    if (indirimAlani) {
        indirimAlani.innerText = "-" + tlFormatla(tutarlar.indirim);
        indirimAlani.style.color = kuponAktif ? "green" : "";
    }

    if (toplamAlani) {
        toplamAlani.innerText = tlFormatla(tutarlar.genelToplam);

        // Kupon uygulandıysa toplamı yeşil göster
        toplamAlani.style.color = kuponAktif ? "green" : "";
        toplamAlani.style.fontWeight = "bold";
    }
}


/* =========================================================
   9. GÖREV 6: İNDİRİM KUPONU
========================================================= */

function kuponUygula() {
    const kuponInput = document.getElementById("kuponKodu");
    const kuponMesaji = document.getElementById("kuponMesaji");

    if (!kuponInput || !kuponMesaji) return;

    const girilenKod = kuponInput.value.trim().toUpperCase();

    if (sepet.length === 0) {
        kuponAktif = false;

        kuponMesaji.innerText =
            "Kupon uygulamak için sepetinize ürün ekleyin.";

        kuponMesaji.style.color = "red";

        sepetTablosunuCiz();
        return;
    }

    if (girilenKod === "MESLEK11") {
        kuponAktif = true;

        kuponMesaji.innerText =
            "✓ MESLEK11 kuponu uygulandı! %20 indirim kazandınız.";

        kuponMesaji.style.color = "green";

        sepetTablosunuCiz();

    } else {
        kuponAktif = false;

        kuponMesaji.innerText =
            "Geçersiz kupon kodu. Lütfen tekrar deneyin.";

        kuponMesaji.style.color = "red";

        sepetTablosunuCiz();
    }
}


/* =========================================================
   10. SEPETTEN ÜRÜN SİLME
========================================================= */

function sepettenSil(index) {
    sepet.splice(index, 1);

    localStorage.setItem("sepetim", JSON.stringify(sepet));

    if (sepet.length === 0) {
        kuponAktif = false;

        const mesaj = document.getElementById("kuponMesaji");

        if (mesaj) {
            mesaj.innerText = "";
        }
    }

    sepetSayaciniGuncelle();
    sepetTablosunuCiz();
}


/* =========================================================
   11. SEPETİ TAMAMEN BOŞALTMA
========================================================= */

function sepetiBosalt() {
    sepet = [];
    kuponAktif = false;

    localStorage.removeItem("sepetim");

    const kuponInput = document.getElementById("kuponKodu");
    const kuponMesaji = document.getElementById("kuponMesaji");

    if (kuponInput) {
        kuponInput.value = "";
    }

    if (kuponMesaji) {
        kuponMesaji.innerText = "";
    }

    sepetSayaciniGuncelle();
    sepetTablosunuCiz();
}


/* =========================================================
   12. SİPARİŞİ TAMAMLAMA
========================================================= */

function siparisiTamamla(olay) {
    olay.preventDefault();

    if (sepet.length === 0) {
        alert("HATA: Sepetiniz boşken sipariş veremezsiniz!");
        return;
    }

    const form = document.getElementById("odemeFormu");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const musteri = document.getElementById("musteriAd").value;
    const tutarlar = sepetTutarlariniHesapla();
    const tutar = tlFormatla(tutarlar.genelToplam);

    alert(
        `🎉 Siparişiniz alındı Sayın ${musteri}!\n` +
        `Kargo dahil toplam: ${tutar}\n` +
        "Bu bir demo siparişidir; gerçek tahsilat yapılmamıştır."
    );

    sepetiBosalt();
    window.location.href = "index.html";
}


/* =========================================================
   13. SAYFA AÇILIŞI
========================================================= */

urunleriGetir("laptops");
sepetTablosunuCiz();
sepetSayaciniGuncelle();