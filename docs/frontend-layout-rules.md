# Reglas de layout frontend

Estas reglas guian el uso del espacio en desktop sin perder el enfoque mobile-first.

## Ancho general

- Home y pantallas principales: `max-w-[1440px]`.
- Herramientas clinicas con formulario y preview: `max-w-[1440px]`.
- Evitar `max-w-6xl` cuando la pantalla tiene formulario largo o preview lateral.

## Home

- Hero en ancho completo dentro del contenedor.
- En desktop usar dos columnas: contenido principal amplio y panel lateral compacto.
- Grid de herramientas:
  - mobile: 1 columna
  - tablet: 2 columnas
  - desktop: 3 columnas
  - xl: 4 columnas

## Herramientas con formulario

- Mobile: una sola columna.
- Desktop: dos columnas.
  - Formulario: 55% aproximadamente.
  - Preview/acciones: 45% aproximadamente.
- El panel de preview debe ser `sticky` en desktop cuando el formulario sea largo.

Ejemplo recomendado:

```tsx
<section className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-12">
```

## Preview panels

- Deben contener:
  - titulo breve;
  - texto de ayuda;
  - vista generada;
  - acciones principales: copiar, PDF, TXT, limpiar.
- En desktop usar:

```tsx
<aside className="lg:sticky lg:top-5 lg:self-start">
```

## Mobile-first

- Todo debe funcionar en una sola columna.
- Botones principales deben ocupar todo el ancho en mobile.
- Chips y categorias deben permitir scroll horizontal.

## Evitar

- Formularios largos en una sola columna en desktop.
- Preview debajo del formulario cuando hay espacio horizontal.
- Contenedores angostos para herramientas clinicas complejas.
- Acciones importantes fuera de vista en desktop.
