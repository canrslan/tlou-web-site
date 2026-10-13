
/* ===== SEPET SAYFASI ===== */

const urunListesi = document.getElementById("sepetUrunListesi");
const toplamAdetAlani = document.getElementById("toplamAdet");
const araToplamAlani = document.getElementById("araToplam");
const genelToplamAlani = document.getElementById("genelToplam");
const kosullarKabul = document.getElementById("kosullarKabul");
const odemeBtn = document.getElementById("odemeBtn");

// Tarayıcıda kayıtlı ürünleri oku.
let sepet = [];

try {
    const kayit = JSON.parse(
        localStorage.getItem("endureSepet") || "[]"
    );

    if (Array.isArray(kayit)) {
        sepet = kayit.filter(urun =>
            typeof urun.ad === "string" &&
            Number.isFinite(urun.fiyat) &&
            urun.fiyat >= 0 &&
            Number.isInteger(urun.adet) &&
            urun.adet > 0
        );
    }
} catch (hata) {
    console.error("Sepet okunamadı:", hata);
}

// Fiyatı TL olarak biçimlendir.
function fiyatYaz(fiyat) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0
    }).format(fiyat);
}

// Değişiklikleri kaydet.
function sepetiKaydet() {
    localStorage.setItem(
        "endureSepet",
        JSON.stringify(sepet)
    );
}

// Ödeme butonunu kontrol et.
function odemeKontrol() {
    odemeBtn.disabled =
        sepet.length === 0 || !kosullarKabul.checked;
}

// Sepetteki ürünleri göster.
function sepetiGoster() {

    urunListesi.replaceChildren();

    let toplamAdet = 0;
    let toplamTutar = 0;

    if (sepet.length === 0) {
        const bosMesaj = document.createElement("p");
        bosMesaj.className = "empty-message";
        bosMesaj.textContent = "Sepetin henüz boş. Ürün eklemek için mağazaya dön.";
        urunListesi.appendChild(bosMesaj);
    }

    sepet.forEach(function (urun, index) {

        toplamAdet += urun.adet;
        toplamTutar += urun.fiyat * urun.adet;

        // Ürün kartı
        const kart = document.createElement("article");
        kart.className = "cart-product";

        const baslik = document.createElement("h3");
        baslik.textContent = urun.ad;

        const aciklama = document.createElement("p");
        aciklama.className = "cart-product-description";
        aciklama.textContent =
            urun.aciklama || "Özel ekipman ürünü.";

        const fiyat = document.createElement("p");
        fiyat.className = "cart-product-price";
        fiyat.textContent = fiyatYaz(
            urun.fiyat * urun.adet
        );

        // Demo kargo bilgisi
        const kargo = document.createElement("div");
        kargo.className = "cart-shipping";

        kargo.textContent =
            "🚚 Örnek kargo: Yurtiçi Kargo | " +
            "Tahmini teslimat: Siparişten sonra 3–5 iş günü";

        // Adet kontrol alanı
        const adetAlani = document.createElement("div");
        adetAlani.className = "cart-quantity";

        const azalt = document.createElement("button");
        azalt.type = "button";
        azalt.textContent = "−";
        azalt.setAttribute("aria-label", "Adet azalt");

        azalt.addEventListener("click", function () {
            urun.adet--;

            if (urun.adet === 0) {
                sepet.splice(index, 1);
            }

            sepetiKaydet();
            sepetiGoster();
        });

        const adet = document.createElement("span");
        adet.textContent = "Adet: " + urun.adet;

        const artir = document.createElement("button");
        artir.type = "button";
        artir.textContent = "+";
        artir.setAttribute("aria-label", "Adet artır");

        artir.addEventListener("click", function () {
            urun.adet++;
            sepetiKaydet();
            sepetiGoster();
        });

        const sil = document.createElement("button");
        sil.type = "button";
        sil.textContent = "Sil";
        sil.className = "remove-product";

        sil.addEventListener("click", function () {
            sepet.splice(index, 1);
            sepetiKaydet();
            sepetiGoster();
        });

        adetAlani.append(azalt, adet, artir, sil);

        kart.append(
            baslik,
            aciklama,
            fiyat,
            kargo,
            adetAlani
        );

        urunListesi.appendChild(kart);
    });

    // Sipariş özetini güncelle.
    toplamAdetAlani.textContent = toplamAdet;
    araToplamAlani.textContent = fiyatYaz(toplamTutar);
    genelToplamAlani.textContent = fiyatYaz(toplamTutar);

    odemeKontrol();
}

// Koşullar kutucuğu değiştiğinde butonu kontrol et.
kosullarKabul.addEventListener("change", odemeKontrol);

// Demo ödeme

/* ===== DEMO ÖDEME SİSTEMİ ===== */

const odemePenceresi =
    document.getElementById("odemePenceresi");

const odemeKapat =
    document.getElementById("odemeKapat");

const secureBtn =
    document.getElementById("secureBtn");

const secureEkrani =
    document.getElementById("secureEkrani");

const kartBilgileri =
    document.getElementById("kartBilgileri");

const odemeOnayla =
    document.getElementById("odemeOnayla");

// Ödeme ekranını aç.
odemeBtn.addEventListener("click", function () {

    if (sepet.length === 0 || !kosullarKabul.checked) {
        return;
    }

    kartBilgileri.hidden = false;
    secureEkrani.hidden = true;

    odemePenceresi.classList.add("active");
    odemePenceresi.setAttribute("aria-hidden", "false");

    odemeKapat.focus();
});

// Ödeme ekranını kapat.
function odemePenceresiniKapat() {
    odemePenceresi.classList.remove("active");
    odemePenceresi.setAttribute("aria-hidden", "true");

    odemeBtn.focus();
}

odemeKapat.addEventListener(
    "click",
    odemePenceresiniKapat
);

// 3D Secure simülasyonunu göster.
secureBtn.addEventListener("click", function () {

    kartBilgileri.hidden = true;
    secureEkrani.hidden = false;

    odemeOnayla.focus();
});

// Demo siparişi onayla.
odemeOnayla.addEventListener("click", function () {

    

    // Sepeti temizle.
    sepet = [];
    kosullarKabul.checked = false;

    sepetiKaydet();
    sepetiGoster();

    odemePenceresiniKapat();
    
    bildirimGoster("Demo sipariş başarıyla tamamlandı! ✓");
   
});
 

// Escape tuşuyla pencereyi kapat.
document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        odemePenceresi.classList.contains("active")
    ) {
        odemePenceresiniKapat();
    }

});


// Sayfa açılınca sepeti yükle.
sepetiGoster();


/* ===== TOAST BİLDİRİM ===== */

let bildirimZamanlayici;

function bildirimGoster(mesaj) {

    const bildirim = document.getElementById("bildirim");
    const metin = document.getElementById("bildirimMetni");

    if (!bildirim || !metin) return;

    metin.textContent = mesaj;

    bildirim.classList.add("show");

    clearTimeout(bildirimZamanlayici);

    bildirimZamanlayici = setTimeout(function () {
        bildirim.classList.remove("show");
    }, 3000);
}

