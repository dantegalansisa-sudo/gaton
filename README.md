# GATÓN · Joyería & Fragancias — Demo Web

Demo de tienda online para **GATÓN** ([@gaton.do](https://instagram.com/gaton.do)) — joyería artesanal y fragancias de autor, Santo Domingo, RD.

Sitio estático (HTML + CSS + JS, sin dependencias ni build) con estética editorial de lujo, basado en los colores de marca (teal profundo + verde salvia + crema).

## Características

- **Hero en video** a pantalla completa con la pieza de marca.
- **Catálogo de joyería** con filtros por categoría (Collares, Anillos, Pulseras, Aretes, Personalizados).
- **Sección de fragancias** destacada sobre fondo oscuro.
- **Carrito de compra** deslizable con cantidades, total en RD$ y persistencia (`localStorage`).
- **Checkout por WhatsApp**: el pedido se arma como mensaje y abre WhatsApp automáticamente.
- **Formulario de contacto** que también envía por WhatsApp.
- Historia de marca, "¿Cómo pedir?", testimonios de clientes y footer completo.
- 100% responsive (desktop / tablet / móvil) con animaciones de scroll.

## ⚙️ Configuración

Antes de publicar, edita el número de WhatsApp del negocio en **`js/main.js`**:

```js
const WHATSAPP = "18494021457"; // formato internacional, sin signos ni espacios
```

Los productos de ejemplo (joyas y fragancias) están en el mismo archivo, en los arreglos `PRODUCTS` y `FRAGRANCES` — edita nombres, materiales y precios cuando tengas la data real.

## Imágenes

Las tarjetas usan el logo de la marca como placeholder de producto (no fotos reales aún):
- `assets/logo.png` — original.
- `assets/logo-mark.png` — logo a color con fondo transparente (superficies claras).
- `assets/logo-white.png` — logo en blanco (superficies oscuras).

Reemplaza por fotos reales editando el `src` de cada producto cuando estén disponibles.

## Ver localmente

Cualquier servidor estático sirve. Por ejemplo:

```bash
npx serve .
# o
python -m http.server 4321
```

Luego abre `http://localhost:4321`.

---

Diseño y desarrollo: demo de presentación · GATÓN © 2024–2026
