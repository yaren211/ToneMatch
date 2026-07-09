const button = document.getElementById("analyzeButton");
const result = document.getElementById("result");
const currentPreview = document.getElementById("currentPreview");
const desiredPreview = document.getElementById("desiredPreview");
const currentColorSelect = document.getElementById("currentColor");
const desiredColorSelect = document.getElementById("desiredColor");

const colorMap = {
    "Siyah (1.0)": "#1b1b1b",
    "Çok Koyu Kahve (2.0)": "#2d1b12",
    "Koyu Kahve (3.0)": "#4a2f24",
    "Orta Kahve (4.0)": "#6b4b3a",
    "Açık Kahve (5.0)": "#8c6242",
    "Koyu Kumral (6.0)": "#8b6a4d",
    "Kumral (7.0)": "#a57c52",
    "Küllü Kumral (7.1)": "#9a8f82",
    "Altın Kumral (7.3)": "#c49b54",
    "Bakır Kumral (7.4)": "#b95f33",
    "Açık Kumral (8.0)": "#c7a16a",
    "Küllü Açık Kumral (8.1)": "#c8c1b8",
    "Altın Açık Kumral (8.3)": "#e0c06d",
    "Çok Açık Kumral (9.0)": "#e8d4a2",
    "Çok Açık Küllü Sarı (9.1)": "#efe8da",
    "Altın Sarı (9.3)": "#f2d35d",
    "Platin Sarı (10.0)": "#faf7ef",
    "Bal Köpüğü": "#d7a25d",
    "Karamel": "#b9783c",
    "Mocha": "#6a4c3b",
    "Çikolata Kahve": "#5a3825",
    "Fındık Kabuğu": "#87603d",
    "Kestane": "#7c4129",
    "Tarçın": "#b56b3f",
    "Bakır": "#c76b3b",
    "Yoğun Bakır": "#b54d1f",
    "Kızıl": "#99213b",
    "Bordo": "#641b33",
    "Gümüş Gri": "#bfc4c8"
};

function estimateLevel(colorName) {
    const value = colorName.trim();
    const match = value.match(/\((\d+(?:\.\d+)?)\)/);

    if (match) {
        return parseFloat(match[1]);
    }

    const lower = value.toLowerCase();

    if (lower.includes("siyah")) return 1;
    if (lower.includes("çok koyu kahve")) return 2;
    if (lower.includes("koyu kahve")) return 3;
    if (lower.includes("orta kahve")) return 4;
    if (lower.includes("açık kahve")) return 5;
    if (lower.includes("koyu kumral")) return 6;
    if (lower.includes("kumral")) return 7;
    if (lower.includes("küllü açık kumral")) return 8.1;
    if (lower.includes("altın açık kumral")) return 8.3;
    if (lower.includes("çok açık kumral")) return 9;
    if (lower.includes("çok açık küllü sarı")) return 9.1;
    if (lower.includes("altın sarı")) return 9.3;
    if (lower.includes("platin sarı")) return 10;
    if (lower.includes("bal köpüğü")) return 7.5;
    if (lower.includes("karamel")) return 6.5;
    if (lower.includes("mocha")) return 6.2;
    if (lower.includes("çikolata kahve")) return 5.5;
    if (lower.includes("fındık kabuğu")) return 6.8;
    if (lower.includes("kestane")) return 6.3;
    if (lower.includes("tarçın")) return 6.7;
    if (lower.includes("yoğun bakır")) return 6.8;
    if (lower.includes("bakır")) return 7.2;
    if (lower.includes("kızıl")) return 6.4;
    if (lower.includes("bordo")) return 5.8;
    if (lower.includes("gümüş gri")) return 8.5;

    return 5;
}

function estimateTone(colorName) {
    const lower = colorName.toLowerCase();

    if (
        lower.includes("sarı") ||
        lower.includes("altın") ||
        lower.includes("bakır") ||
        lower.includes("kızıl") ||
        lower.includes("tarçın") ||
        lower.includes("kestane") ||
        lower.includes("bordo") ||
        lower.includes("karamel")
    ) {
        return "Sıcak";
    }

    if (lower.includes("gümüş") || lower.includes("küllü") || lower.includes("platin")) {
        return "Soğuk";
    }

    return "Nötr";
}

function getRisk(levelDifference) {
    if (levelDifference >= 5) return "Çok Yüksek";
    if (levelDifference >= 3) return "Yüksek";
    if (levelDifference >= 2) return "Orta";
    return "Düşük";
}

function getSessions(levelDifference) {
    if (levelDifference >= 6) return "3-4 Seans";
    if (levelDifference >= 4) return "2-3 Seans";
    if (levelDifference >= 2) return "1-2 Seans";
    return "Tek Seans";
}

function getDuration(levelDifference) {
    if (levelDifference >= 6) return "5-7 Saat";
    if (levelDifference >= 4) return "3-5 Saat";
    if (levelDifference >= 2) return "2-3 Saat";
    return "45-90 Dakika";
}

function getDifficulty(levelDifference) {
    if (levelDifference >= 6) return "⭐⭐⭐⭐⭐";
    if (levelDifference >= 4) return "⭐⭐⭐⭐";
    if (levelDifference >= 2) return "⭐⭐⭐";
    if (levelDifference >= 1) return "⭐⭐";
    return "⭐";
}

function getDeveloper(levelDifference) {
    if (levelDifference >= 4) {
        return "Profesyonel kuaför tarafından uygulanması önerilir.";
    }

    if (levelDifference >= 2) {
        return "Tecrübeli kişiler tarafından uygulanması daha güvenlidir.";
    }

    return "Evde uygulanabilir ancak mutlaka saçın küçük bir bölümünde test yapılmalıdır.";
}

function createAnalysis(currentColor, desiredColor) {
    const currentLevel = estimateLevel(currentColor);
    const desiredLevel = estimateLevel(desiredColor);
    const levelDifference = desiredLevel - currentLevel;
    const currentTone = estimateTone(currentColor);
    const desiredTone = estimateTone(desiredColor);
    const risk = getRisk(levelDifference);
    const damage = levelDifference >= 5 ? "Yüksek" : levelDifference >= 3 ? "Orta" : "Düşük";
    const oxidant = levelDifference >= 5 ? "40 Vol" : levelDifference >= 3 ? "30 Vol" : levelDifference >= 1 ? "20 Vol" : "10 Vol";
    const session = levelDifference >= 5 ? "3 Seans" : levelDifference >= 3 ? "2 Seans" : "1 Seans";
    const sessions = getSessions(levelDifference);
    const duration = getDuration(levelDifference);
    const difficulty = getDifficulty(levelDifference);
    const developer = getDeveloper(levelDifference);

    return `
        <h2>🔍 Profesyonel Analiz</h2>
        <p><strong>Mevcut Renk:</strong> ${currentColor}</p>
        <p><strong>Hedef Renk:</strong> ${desiredColor}</p>
        <hr>
        <p>📈 <strong>Seviye farkı:</strong> ${Math.abs(levelDifference).toFixed(1)}</p>
        <p>🎨 <strong>Mevcut Alt Ton:</strong> ${currentTone}</p>
        <p>🎨 <strong>Hedef Alt Ton:</strong> ${desiredTone}</p>
        <p>⚠️ <strong>Risk:</strong> ${risk}</p>
        <p>💥 <strong>Hasar Riski:</strong> ${damage}</p>
        <p>🧴 <strong>Önerilen Oksidan:</strong> ${oxidant}</p>
        <p>⏱ <strong>Tahmini Seans:</strong> ${session}</p>
        <p>🗓 <strong>Toplam Tahmini Süre:</strong> ${duration}</p>
        <p>⭐ <strong>Zorluk:</strong> ${difficulty}</p>
        <p>👨‍🔧 <strong>Tavsiye:</strong> ${developer}</p>
        <p>💡 İşlem öncesinde saçın küçük bir bölümünde test yapılması önerilir.</p>
    `;
}

function updatePreview(selectElement, previewElement) {
    const color = selectElement.value;
    const hex = colorMap[color] || "#ffffff";
    previewElement.style.backgroundColor = hex;
    previewElement.textContent = color ? "" : "Seçim bekleniyor";
    previewElement.style.color = isDarkColor(hex) ? "#fff" : "#000";
}

function isDarkColor(hex) {
    if (!hex || hex[0] !== "#") return false;
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 140;
}

button.addEventListener("click", () => {
    const currentColor = currentColorSelect.value;
    const desiredColor = desiredColorSelect.value;

    if (!currentColor || !desiredColor) {
        result.innerHTML = "<p>Lütfen hem mevcut hem hedef rengi seçin.</p>";
        return;
    }

    result.innerHTML = createAnalysis(currentColor, desiredColor);
});

currentColorSelect.addEventListener("change", () => updatePreview(currentColorSelect, currentPreview));
desiredColorSelect.addEventListener("change", () => updatePreview(desiredColorSelect, desiredPreview));

updatePreview(currentColorSelect, currentPreview);
updatePreview(desiredColorSelect, desiredPreview);
