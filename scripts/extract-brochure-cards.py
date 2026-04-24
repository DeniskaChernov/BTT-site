from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "media" / "catalog" / "pdf-pages"
OUT = ROOT / "public" / "media" / "catalog" / "brochure-cards"
OUT.mkdir(parents=True, exist_ok=True)

# Crops tuned for 2048x1365 page renders from scripts.
X = [50, 518, 986, 1454]
Y = [116, 390]
W = 435
H = 326

MAP = {
    "page-01.png": [
        ("semi-1708", 0, 0),
        ("semi-0609", 1, 0),
        ("semi-0510", 2, 0),
        ("semi-1704", 3, 0),
        ("semi-1706", 0, 1),
        ("semi-1710", 1, 1),
        ("semi-2305", 2, 1),
    ],
    "page-02.png": [
        ("twisted-0038k", 0, 0),
        ("twisted-0080k", 1, 0),
        ("twisted-2310k", 2, 0),
        ("twisted-1710k", 3, 0),
        ("twisted-1770k", 0, 1),
        ("twisted-0099k", 1, 1),
        ("twisted-3333k", 2, 1),
    ],
    "page-03.png": [
        ("semi-5830", 0, 0),
        ("semi-2310", 1, 0),
        ("semi-2708-light", 2, 0),
        ("semi-2809", 3, 0),
        ("semi-2708", 0, 1),
        ("semi-0310", 1, 1),
        ("semi-3034", 2, 1),
    ],
    "page-04.png": [
        ("semi-3045", 0, 0),
        ("semi-0630", 1, 0),
        ("semi-2332", 2, 0),
        ("semi-2333", 3, 0),
        ("semi-0330", 0, 1),
        ("semi-2030", 1, 1),
        ("semi-2910", 2, 1),
        ("semi-6630", 3, 1),
    ],
}


def main() -> None:
    for page_name, items in MAP.items():
        page_path = SRC / page_name
        img = Image.open(page_path)
        for slug, col, row in items:
            x0 = X[col]
            y0 = Y[row]
            card = img.crop((x0, y0, x0 + W, y0 + H))
            card.save(OUT / f"{slug}.png")
    print(f"Saved cards: {sum(len(v) for v in MAP.values())}")


if __name__ == "__main__":
    main()
