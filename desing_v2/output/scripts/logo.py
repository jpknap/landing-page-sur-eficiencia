"""Deriva los recursos de logo de ambas propuestas desde ../../logo.png (archivo WebP del cliente).

Genera, en <propuesta>/img/:
  logo.png          logotipo completo apilado (isotipo + nombre + bajada), recortado
  logo-isotipo.png  solo el isotipo (hexágono)
  logo-nombre.png   solo el nombre «SUR EFICIENCIA», para la versión horizontal del encabezado
  favicon.png       isotipo 64 × 64

Uso: python3 -I scripts/logo.py   (desde desing_v1/output)
"""
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[3]
FUENTE = RAIZ / "logo.png"
SALIDA = [Path(__file__).resolve().parents[1] / p / "img" for p in ("propuesta-01", "propuesta-02")]

# Cajas medidas sobre el canal alfa del original (1448 × 1086).
ISOTIPO = (495, 135, 954, 658)
NOMBRE = (96, 705, 1352, 830)
COMPLETO = (96, 135, 1352, 900)


def ajustar(img, alto=None, ancho=None):
    if alto:
        return img.resize((round(img.width * alto / img.height), alto), Image.LANCZOS)
    return img.resize((ancho, round(img.height * ancho / img.width)), Image.LANCZOS)


def main():
    logo = Image.open(FUENTE).convert("RGBA")
    piezas = {
        "logo.png": ajustar(logo.crop(COMPLETO), ancho=640),
        "logo-isotipo.png": ajustar(logo.crop(ISOTIPO), alto=160),
        "logo-nombre.png": ajustar(logo.crop(NOMBRE), alto=72),
    }
    iso = logo.crop(ISOTIPO)
    lado = max(iso.size)
    cuadro = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    cuadro.paste(iso, ((lado - iso.width) // 2, (lado - iso.height) // 2))
    piezas["favicon.png"] = cuadro.resize((64, 64), Image.LANCZOS)

    for carpeta in SALIDA:
        for nombre, img in piezas.items():
            img.save(carpeta / nombre, optimize=True)
    for nombre, img in piezas.items():
        print(f"{nombre}: {img.size[0]}×{img.size[1]}")


if __name__ == "__main__":
    main()
