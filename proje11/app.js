// --- MUHAMMEDFLIX - TEMİZLENMİŞ APP.JS ---

// 1. SABİTLER VE DEĞİŞKENLER
const API_KEY = "e54385c4660f04f913f05aa38f2f213f";
const BASE_URL = "https://api.themoviedb.org/3";
const RESIM_URL = "https://image.tmdb.org/t/p/w500";
const ARKA_PLAN_URL = "https://image.tmdb.org/t/p/original"; // Hero için yüksek kalite

const vitrin = document.getElementById("film-vitrini");
const aramaInput = document.getElementById("arama-input");

// Modal Elementleri (Tekrar tanımlanmayı önlemek için en başta)
const modal = document.getElementById("film-modal");
const modalResim = document.getElementById("modal-resim");
const modalBaslik = document.getElementById("modal-baslik");
const modalTarih = document.getElementById("modal-tarih");
const modalPuan = document.getElementById("modal-puan");
const modalOzet = document.getElementById("modal-ozet");

let heroFilm = null;
let sayfa = 1; // GÖREV 9: Sayfalama değişkeni
let aramaModu = false; // Arama yapılıp yapılmadığını takip et

// 2. VERİ ÇEKME FONKSİYONU
async function filmleriGetir(url, eklemeModu = false) {
    try {
        const cevap = await fetch(url);
        const veriler = await cevap.json();
        
        if (veriler.results) {
            filmleriEkranaBas(veriler.results, eklemeModu);
        } else {
            if (!eklemeModu) vitrin.innerHTML = "<h2 style='color:white; text-align:center; width:100%;'>Sonuç bulunamadı.</h2>";
        }
    } catch (hata) {
        console.error(hata);
        if (!eklemeModu) vitrin.innerHTML = "<h2 style='color:red; text-align:center;'>Bağlantı Hatası!</h2>";
    }
}

// 3. LİSTELEME VE KART OLUŞTURMA
function filmleriEkranaBas(filmlerDizisi, eklemeModu = false) {
    // Eğer arama yapılmıyorsa ve ilk sayfa yükleniyorsa Hero Banner'ı güncelle
    if (!aramaModu && !eklemeModu) {
        setHeroBanner(filmlerDizisi);
    }

    // GÖREV 9: Ekleme modundaysa içeriği silme, sonrasına ekle
    if (!eklemeModu) {
        vitrin.innerHTML = "";
    }
    
    filmlerDizisi.forEach(film => {
        if (!film.poster_path) return; // Afişi olmayanları atla

        const puan = film.vote_average.toFixed(1);
        // GÖREV 3: Puan rengine göre şık HEX kodları
        const renk = puan >= 8 ? "#f39c12" : (puan >= 5 ? "#95a5a6" : "#c0392b");

        const filmKutusu = document.createElement("article");
        filmKutusu.classList.add("film-karti");
        
        filmKutusu.innerHTML = `
            <span class="puan" style="border-color: ${renk}; color: ${renk};">${puan}</span>
            <img src="${RESIM_URL + film.poster_path}" alt="${film.title}">
            <div class="film-bilgi">
                <h3>${film.title}</h3>
                <p>${film.release_date ? film.release_date.split('-')[0] : 'N/A'}</p>
            </div>
        `;

        filmKutusu.addEventListener('click', () => modalAc(film));
        vitrin.appendChild(filmKutusu);
    });
}

// 4. HERO BANNER MANTIĞI
function setHeroBanner(filmler) {
    if (!filmler || filmler.length === 0) return;
    
    // Rastgele bir film seç
    heroFilm = filmler[Math.floor(Math.random() * filmler.length)];

    const heroSection = document.getElementById("hero-banner");
    const heroTitle = document.getElementById("hero-title");
    const heroDesc = document.getElementById("hero-overview");

    if (heroSection && heroFilm.backdrop_path) {
        heroSection.style.backgroundImage = `url('${ARKA_PLAN_URL}${heroFilm.backdrop_path}')`;
        heroTitle.innerText = heroFilm.title;
        heroDesc.innerText = heroFilm.overview ? heroFilm.overview.substring(0, 150) + "..." : "Açıklama bulunmuyor.";
    }
}

function playHeroFilm() { if (heroFilm) modalAc(heroFilm); }
function showHeroDetails() { if (heroFilm) modalAc(heroFilm); }

// 5. ARAMA MOTORU
if (aramaInput) {
    aramaInput.addEventListener('keyup', (e) => {
        const aranan = e.target.value;
        sayfa = 1; // Arama değişince sayfayı sıfırla
        if (aranan && aranan !== '') {
            aramaModu = true;
            const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${aranan}&page=1`;
            filmleriGetir(searchUrl);
        } else {
            // Arama silinirse popülerlere dön
            aramaModu = false;
            filmleriGetir(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`);
        }
    });
}

// GÖREV 9: DAHA FAZLA YÜKLE BUTONU
const dahaFazlaBtn = document.getElementById("daha-fazla-btn");
if (dahaFazlaBtn) {
    dahaFazlaBtn.addEventListener('click', () => {
        sayfa++;
        let url;
        if (aramaModu && aramaInput.value) {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${aramaInput.value}&page=${sayfa}`;
        } else {
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=${sayfa}`;
        }
        filmleriGetir(url, true); // true = ekleme modu
    });
}

// 6. MODAL, FRAGMAN, OYUNCU KADROSU VE BENZER FİLMLER
async function modalAc(film) {
    // Temel bilgileri doldur
    modalResim.src = film.poster_path ? RESIM_URL + film.poster_path : "https://via.placeholder.com/300x450";
    modalBaslik.innerText = film.title;
    modalTarih.innerText = "Yayın Tarihi: " + (film.release_date || "Bilinmiyor");
    
    // GÖREV 6: Bütçe Formatlama
    let budgeElem = document.getElementById("modal-butce");
    if (!budgeElem) {
        // Yoksa oluştur (modal-tarih'ten sonra ekle)
        budgeElem = document.createElement("p");
        budgeElem.id = "modal-butce";
        budgeElem.className = "butce-bilgi";
        modalTarih.after(budgeElem);
    }
    
    if (film.budget && film.budget > 0) {
        const formatliButce = Number(film.budget).toLocaleString('en-US');
        budgeElem.innerText = `💰 Bütçe: $${formatliButce}`;
        budgeElem.style.display = "block";
    } else {
        budgeElem.style.display = "none";
    }
    
    const puan = film.vote_average.toFixed(1);
    modalPuan.innerText = puan;
    // GÖREV 3: Modal puan rengi de güncellendi
    const renk = puan >= 8 ? "#f39c12" : (puan >= 5 ? "#95a5a6" : "#c0392b");
    modalPuan.style.backgroundColor = renk;
    
    modalOzet.innerText = film.overview || "Bu film için henüz bir özet girilmemiş.";

    // Dinamik içerikleri temizle
    const eskiVideo = document.getElementById("video-container");
    if (eskiVideo) eskiVideo.remove();
    
    const oyuncuListesi = document.getElementById("oyuncu-listesi");
    const benzerListesi = document.getElementById("benzer-listesi");
    if (oyuncuListesi) oyuncuListesi.innerHTML = "<span style='color:#aaa'>Yükleniyor...</span>";
    if (benzerListesi) benzerListesi.innerHTML = "<span style='color:#aaa'>Yükleniyor...</span>";

    // API İSTEKLERİNİ PARALEL OLARAK BAŞLAT
    const videoUrl = `${BASE_URL}/movie/${film.id}/videos?api_key=${API_KEY}&language=tr-TR`;
    const creditsUrl = `${BASE_URL}/movie/${film.id}/credits?api_key=${API_KEY}&language=tr-TR`;
    const similarUrl = `${BASE_URL}/movie/${film.id}/similar?api_key=${API_KEY}&language=tr-TR&page=1`;

    try {
        const [videoCevap, creditsCevap, similarCevap] = await Promise.all([
            fetch(videoUrl),
            fetch(creditsUrl),
            fetch(similarUrl)
        ]);

        const videoVeri = await videoCevap.json();
        const creditsVeri = await creditsCevap.json();
        const similarVeri = await similarCevap.json();

        // --- FRAGMAN EKLEME ---
        const fragman = videoVeri.results.find(v => v.type === "Trailer" && v.site === "YouTube") || 
                        videoVeri.results.find(v => v.site === "YouTube");
        
        // GÖREV 5: Fragman yoksa video kutusunu ve başlığı tamamen gizle
        const fragmanBaslik = document.querySelector(".modal-yazi h3"); // İlk h3 genelde özet başlığıdır, fragman başlığını bulmak için DOM yapısına bakmalıyız ama burada dinamik oluşturuyoruz.
        // Not: Mevcut HTML'de fragman için ayrı bir h3 yok, video container direkt ekleniyor.
        // Eğer fragman yoksa container oluşturmayacağız bile.
        
        if (fragman) {
            const videoContainer = document.createElement("div");
            videoContainer.id = "video-container";
            videoContainer.innerHTML = `
                <h3>Fragman</h3>
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${fragman.key}" 
                title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            modalOzet.after(videoContainer);
        } else {
            // Fragman yoksa hiçbir şey ekleme (Gizlenmiş/görünmez oldu)
            console.log("Fragman bulunamadı, video alanı gizlendi.");
        }

        // --- GÖREV 8: OYUNCU KADROSU (İlk 5 Oyuncu) ---
        if (oyuncuListesi) {
            oyuncuListesi.innerHTML = "";
            const ilkBesOyuncu = creditsVeri.cast.slice(0, 5);
            if (ilkBesOyuncu.length === 0) {
                oyuncuListesi.innerHTML = "<span style='color:#aaa'>Oyuncu bilgisi yok.</span>";
            } else {
                ilkBesOyuncu.forEach(oyuncu => {
                    const profilResim = oyuncu.profile_path 
                        ? RESIM_URL + oyuncu.profile_path 
                        : "https://via.placeholder.com/80x80?text=?";
                    
                    const oyuncuDiv = document.createElement("div");
                    oyuncuDiv.style.cssText = "display:flex; flex-direction:column; align-items:center; min-width:80px; text-align:center;";
                    oyuncuDiv.innerHTML = `
                        <img src="${profilResim}" alt="${oyuncu.name}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #e50914;">
                        <span style="font-size:0.75rem; color:#fff; margin-top:5px;">${oyuncu.name}</span>
                    `;
                    oyuncuListesi.appendChild(oyuncuDiv);
                });
            }
        }

        // --- GÖREV 10: BENZER FİLMLER (İlk 4 Film) ---
        if (benzerListesi) {
            benzerListesi.innerHTML = "";
            const benzerFilmler = similarVeri.results.filter(f => f.poster_path).slice(0, 4);
            if (benzerFilmler.length === 0) {
                benzerListesi.innerHTML = "<span style='color:#aaa'>Benzer film bulunamadı.</span>";
            } else {
                benzerFilmler.forEach(bFilm => {
                    const benzerDiv = document.createElement("div");
                    benzerDiv.style.cssText = "min-width:120px; cursor:pointer; transition:transform 0.2s;";
                    benzerDiv.innerHTML = `
                        <img src="${RESIM_URL + bFilm.poster_path}" alt="${bFilm.title}" style="width:120px; height:180px; object-fit:cover; border-radius:8px;">
                        <p style="font-size:0.7rem; color:#ccc; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;">${bFilm.title}</p>
                    `;
                    benzerDiv.addEventListener('click', () => modalAc(bFilm));
                    benzerDiv.addEventListener('mouseenter', () => benzerDiv.style.transform = "scale(1.05)");
                    benzerDiv.addEventListener('mouseleave', () => benzerDiv.style.transform = "scale(1)");
                    benzerListesi.appendChild(benzerDiv);
                });
            }
        }

    } catch (error) {
        console.error("Modal veri çekme hatası:", error);
    }

    modal.style.display = "block";
}

function modalKapat() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) modalKapat();
}

// GÖREV 4: YUKARI ÇIK BUTONU OLAYI
const yukariCikBtn = document.getElementById("yukari-cik-btn");
if (yukariCikBtn) {
    yukariCikBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// BAŞLANGIÇ: Popüler filmleri getir
filmleriGetir(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`);