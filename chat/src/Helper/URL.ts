// URL.ts

export const createURLFriendlyString = (str: string): string => {
    return str
        // Türkçe karakterleri değiştir
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ş/g, 'S')
        .replace(/İ/g, 'I')
        .replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C')
        // Boşlukları tire ile değiştir
        .replace(/\s+/g, '-')
        // Özel karakterleri kaldır
        .replace(/[^a-zA-Z0-9-]/g, '')
        // Birden fazla tireyi tek tireye dönüştür
        .replace(/-+/g, '-')
        // Baştaki ve sondaki tireleri kaldır
        .replace(/^-+|-+$/g, '')
        // Küçük harfe çevir
        .toLowerCase();
};

// Kullanım örneği:
// createURLFriendlyString("Merhaba Dünya!") => "merhaba-dunya"
// createURLFriendlyString("İstanbul'da Güzel Bir Gün") => "istanbulda-guzel-bir-gun"
