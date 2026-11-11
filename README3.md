OYUN PROGRAMLAMA YAZMA ÖDEVLERİ
1.HAFTA
1. Deftere Yazma Görevi (Teorik Pekiştirme):
Öğrenciler bilişim dersi defterlerine aşağıdaki başlıkları ve kısa tanımlarını (benzetmeleriyle birlikte) yazıp haftaya öğretmene gösterecekler:
Unity Hub: Projeleri ve Unity versiyonlarını yönettiğimiz alet çantamız.
LTS: Uzun Süreli Destek (En hatasız sürüm).
Visual Studio: Unity için kod yazacağımız (kod düzenleyici) program.
Scene: Film Setimiz (Çalışma alanımız).
Game: Oyuncunun gördüğü ekran (Kamera açısı).
Hierarchy: Sahnedeki objelerin isim listesi.
Project: Oyun malzemelerimizin (ses, resim, kod) durduğu depo.
Inspector: Seçilen objenin özelliklerini gördüğümüz ve değiştirdiğimiz denetçi paneli.
----------------------------------
2.HAFTA
1. Deftere Yazma Görevi (Kod Sözlüğü):
Defterlerinize şu temel kavramları anlayacağınız dilde, kısaca yazın:
Script: Oyundaki objelere ne yapacağını söylediğimiz senaryo/kod dosyası.
void Start(): Sadece oyunun en başında bir kere çalışan kod bölümü.
void Update(): Oyun açık olduğu sürece saniyede defalarca, sürekli çalışan kod bölümü.
Debug.Log(): Unity Konsoluna mesaj yazdırmaya (hata bulmaya) yarayan komut.
public: Kodda yazdığımız değişkenin Unity Inspector (Denetçi) panelinde görünmesini ve değiştirilmesini sağlayan kelime.
transform.Translate: Bir objeyi x, y veya z yönünde hareket ettiren kod parçası.
-----------------------------------
3.HAFTA
1. Deftere Yazma Görevi (Arazi Sözlüğü):
Defterlerinize şu kavramları yazıp haftaya gösterin:
Terrain (Arazi): Oyunumuzdaki dağları, tepeleri ve zemini yaptığımız 3 boyutlu devasa hamur objesi.
Raise/Lower Terrain: Araziyi yükseltmeye (dağ yapmaya) veya klavyeden SHIFT'e basılı tutarsak alçaltmaya (krater yapmaya) yarayan fırça aracı.
Texture (Doku): 3D dünyadaki objelerin üzerini kapladığımız gerçekçi resim dosyaları (Çim, toprak, taş fotoğrafı gibi).
Import (Aktarmak): Bilgisayarımızda veya internette bulunan bir dosyayı (resim, 3D model, ses) Unity Project (Depo) paneline sürükleyip bırakarak projeye dahil etme işlemi.
-----------------------------------
4.HAFTA
1. Deftere Yazma Görevi (Değişken Sözlüğü):
Bugün öğrendiğimiz hafıza kutularını (değişkenleri) defterinize yazın:
int: Tam sayılar kutusu. (Can, altın, mermi sayısı gibi küsuratsız şeyler için).
float: Virgüllü sayılar kutusu. (Boy uzunluğu, koşma hızı gibi hassas şeyler için. Sonuna 'f' konur).
string: Metin (Yazı) kutusu. (İsimler, diyaloglar için. Çift tırnak " " içine yazılır).
bool: Mantık kutusu. Sadece iki ihtimali vardır: True (Doğru) veya False (Yanlış).
Input.GetKeyDown(): Klavyeden belirtilen tuşa basıldığı ilk anı yakalayan tetikleyici kod.
transform.localScale: Bir objenin 3D dünyadaki boyutunu (şişkinliğini) ayarlayan kod.
------------------------------------
5.HAFTA
1. Deftere Yazma Görevi (Mantık Sözlüğü):
Defterinize şu tanımları ve işaretleri yazın:
Global Değişken (Megafon): Sınıfın başında public ile yazılan, Inspector'da görünen ve oyun boyunca yaşayan değişken.
Local Değişken (Fısıltı): Süslü parantez { } içinde doğup parantez bitince silinen gizli değişken.
if (Şart) { İşlem } : Oyunun beyni! EĞER parantez içindeki şart doğruysa süslü parantez içindeki kodu çalıştırır.
else if : Yoksa Eğer! İlk 'if' şartı tutmadıysa, ikinci bir şart denemek için kullanılır.
> (Büyüktür), < (Küçüktür), == (Eşit midir?), >= (Büyük veya eşittir).
Input.GetMouseButtonDown(0): Farenin Sol (Tetik) tuşuna tıklandığını anlayan komut.
------------------------------------
6.HAFTA
1. Deftere Yazma Görevi (Profesyonel Oyun Sözlüğü):
Fonksiyon (Metot): Sadece biz çağırdığımızda (örneğin bir butona basıldığında) çalışan özel kod paketleri. (public void OyunuBaslat() gibi).
Canvas (Tuval): Oyunlardaki yazıların, menülerin ve butonların üzerine yerleştirildiği 2 boyutlu şeffaf ekran çerçevesi.
SceneManager.LoadScene("SahneAdi"): Bir sahneden diğerine (Menüden Oyuna) geçiş yapmayı sağlayan komut. (En üste using UnityEngine.SceneManagement; yazmayı gerektirir).
Application.Quit(): Oyunu tamamen kapatıp masaüstüne dönmeyi sağlayan çıkış komutu.
Post-Processing (Ekran Filtreleri): Oyunun kamerasına eklenen; parlama (Bloom), köşe karartma (Vignette) ve renk düzeltme gibi sinematik grafik efektleri.
------------------------------------
7.HAFTA
1. Deftere Yazma Görevi (1. Ünite Final Sözlüğü):
Collider (Çarpıştırıcı): Objelerin fiziksel sınırlarını belirleyen görünmez kafes.
OnCollisionEnter: Katı objeler birbirine fiziksel olarak çarptığında çalışan fonksiyon.
Is Trigger (Tetikleyici): Collider'ı katı olmaktan çıkarıp içinden geçilebilen bir sensöre dönüştüren ayar.
OnTriggerEnter: Is Trigger özelliği açık olan bir sensörün içinden geçildiğinde çalışan fonksiyon.
CompareTag("EtiketAdi"): Çarptığımız objenin kimliğini (Altın mı, Tuzak mı?) kontrol eden komut.
Coroutine (IEnumerator ve WaitForSeconds): Oyun akışını dondurmadan, belirli bir saniye bekleyip ardından işlem yapmayı sağlayan zaman ayarlı yardımcı yordam.
------------------------------------
8.HAFTA
Deftere Yazma Görevi:
GDD (Game Design Document): Bir oyunun yapımına başlanmadan önce hikayesinin, kurallarının, görevlerinin ve görsel/işitsel referanslarının yazıldığı tasarım belgesi.
Oyun Türleri: FPS (Birinci Şahıs), TPS (Üçüncü Şahıs), RPG (Rol Yapma), Platformer, Survival (Hayatta Kalma).
UI Text (using UnityEngine.UI;): Konsol yerine doğrudan oyuncunun ekranındaki yazıları kodla değiştirmemizi (canEkrani.text = ...) sağlayan arayüz bileşeni.

