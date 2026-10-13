
const sepetButonu = document.getElementById("sepetBtn");
sepetButonu.addEventListener("click", function () {
    window.location.href = "sepet.html";
});
const sepetSayisi = document.getElementById("sepetSayisi");
const sepeteEkleButonlari = document.querySelectorAll(".add-to-cart-btn");

let toplamUrun = 0;

/* Sepete ekleme butonları */
sepeteEkleButonlari.forEach(function (buton) {
    buton.addEventListener("click", function () {
        toplamUrun++;
        sepetSayisi.textContent = toplamUrun;

        
    });
});

/* Sepet butonu */
sepetButonu.addEventListener("click", function () {
    
});






/* ===== KOLEKSİYONLARI SEPETE EKLE ===== */

document.querySelectorAll(".collection-cart-btn")
    .forEach(function (buton) {

        buton.addEventListener("click", function () {

            const koleksiyonAdi = buton.dataset.name;

            // Mevcut sepet sayısını 1 artır.
            toplamUrun++;

            // Ekrandaki sepet sayısını güncelle.
            sepetSayisi.textContent = toplamUrun;

            // Eklenen koleksiyonu bildir.
            

        });

    });


/* ===== ÜRÜN ARAMA VE KATEGORİ FİLTRELEME ===== */

// HTML elemanlarını seçiyoruz.
const urunArama = document.getElementById("urunArama");

const filtreButonlari =
    document.querySelectorAll(".filter-btn");

const urunKartlari =
    document.querySelectorAll(".product-card");

const urunSonuc =
    document.getElementById("urunSonuc");

// Başlangıç kategorimiz bütün ürünler.
let aktifKategori = "all";

// Ürünleri kontrol eden fonksiyon.
function urunleriFiltrele() {

    const arananMetin = urunArama.value
        .trim()
        .toLocaleLowerCase("tr-TR");

    let gorunenUrunSayisi = 0;

    urunKartlari.forEach(function (kart) {

        const urunAdi = kart.querySelector("h3")
            .textContent
            .toLocaleLowerCase("tr-TR");

        const urunKategorisi = kart.dataset.category;

        // Ürün adı aramayla eşleşiyor mu?
        const isimEslesiyor =
            urunAdi.includes(arananMetin);

        // Ürün seçilen kategoriye ait mi?
        const kategoriEslesiyor =
            aktifKategori === "all" ||
            urunKategorisi === aktifKategori;

        // Her iki koşul da doğruysa ürün görünür.
        const goster =
            isimEslesiyor && kategoriEslesiyor;

        kart.classList.toggle("is-hidden", !goster);

        if (goster) {
            gorunenUrunSayisi++;
        }

    });

    // Sonuç sayısını göster.
    if (gorunenUrunSayisi === 0) {
        urunSonuc.textContent =
            "Aramanıza uygun ürün bulunamadı.";
    } else {
        urunSonuc.textContent =
            gorunenUrunSayisi + " ürün gösteriliyor.";
    }

}

// Kullanıcı arama kutusuna yazdığında çalışır.
urunArama.addEventListener("input", urunleriFiltrele);

// Kullanıcı kategori butonuna bastığında çalışır.
filtreButonlari.forEach(function (buton) {

    buton.addEventListener("click", function () {

        // Seçilen kategoriyi öğren.
        aktifKategori = buton.dataset.category;

        // Eski seçili kategori işaretini kaldır.
        filtreButonlari.forEach(function (filtre) {
            filtre.classList.remove("active");
        });

        // Yeni seçilen butonu vurgula.
        buton.classList.add("active");

        // Ürünleri yeniden filtrele.
        urunleriFiltrele();

    });

});

// Sayfa ilk açıldığında ürün sayısını göster.
urunleriFiltrele();


/* ===== ÜRÜNLERİ SEPET SAYFASI İÇİN KAYDET ===== */

function fiyatSayiyaCevir(fiyatMetni) {
    return Number(
        fiyatMetni.replace(/[^\d,]/g, "").replace(",", ".")
    );
}

function sepetKaydinaEkle(ad, fiyat, aciklama) {

    let sepet = [];

    try {
        sepet = JSON.parse(
            localStorage.getItem("endureSepet") || "[]"
        );

        if (!Array.isArray(sepet)) sepet = [];
    } catch (hata) {
        sepet = [];
    }

    const mevcut = sepet.find(urun => urun.ad === ad);

    if (mevcut) {
        mevcut.adet++;
    } else {
        sepet.push({
            ad: ad,
            fiyat: fiyat,
            adet: 1,
            aciklama: aciklama
        });
    }

    localStorage.setItem(
        "endureSepet",
        JSON.stringify(sepet)
    );
    // Ürün sepete eklenince küçük bildirim göster
bildirimGoster(ad + " sepete eklendi! 🎒");
}

/* Normal ürünleri kaydet */

document.querySelectorAll(".add-to-cart-btn")
    .forEach(function (buton) {

        buton.addEventListener("click", function () {
            const kart = buton.closest(".product-card");

            const ad = kart.querySelector("h3")
                .textContent.trim();

            const fiyat = fiyatSayiyaCevir(
                kart.querySelector(".product-price").textContent
            );

            const aciklama = kart.querySelector(".product-text")
                .textContent.trim();

            sepetKaydinaEkle(ad, fiyat, aciklama);
        });
    });

/* Koleksiyon setlerini kaydet */

document.querySelectorAll(".collection-cart-btn")
    .forEach(function (buton) {

        buton.addEventListener("click", function () {
            const kart = buton.closest(".collection-card");

            const ad = kart.querySelector("h3")
                .textContent.trim();

            const fiyat = fiyatSayiyaCevir(
                kart.querySelector(".collection-price").textContent
            );

            const aciklama = Array.from(
                kart.querySelectorAll(".collection-items li")
            ).map(li => li.textContent.trim()).join(", ");

            sepetKaydinaEkle(ad, fiyat, aciklama);
        });
    });

    
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
