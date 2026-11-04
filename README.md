# Market Structure Lab

Diario visual, local-first y open source para estudiar estructura de mercado, planificar riesgo y revisar decisiones de trading.

> Herramienta educativa. No constituye asesoramiento financiero ni ejecuta operaciones.

Laboratorio visual y local-first para documentar análisis de estructura de mercado.

## Funciones

- Carga de capturas de gráficos.
- Anotaciones visuales: BOS, CHOCH, liquidez, POI y notas.
- Contexto del setup, sesgo, sesión y nivel de confianza.
- Checklist de confirmaciones.
- Guardado automático en `localStorage`.
- Exportación e importación de análisis en JSON.
- Historial con búsqueda, filtros, edición y duplicado.
- Plan de entrada, stop y objetivo con cálculo automático de R:R.
- Revisión posterior con resultado en R, disciplina y aprendizaje.
- Dashboard con win rate, R promedio, sesiones y setups destacados.
- Zonas supply/demand dibujables, movibles y redimensionables.
- Revisión semanal exportable a Markdown o mediante impresión/PDF.
- Playbooks reutilizables con reglas y confirmaciones predefinidas.
- Registro de errores de ejecución y análisis de frecuencia.
- Calendario mensual con operaciones y resultado diario en R.

## Uso local

Es una aplicación estática sin dependencias. Serví la carpeta `dist` con cualquier servidor HTTP:

```powershell
python -m http.server 4173 --directory dist
```

Luego abrí `http://localhost:4173`.

## Arquitectura

La aplicación usa HTML, CSS y JavaScript sin dependencias ni proceso de compilación. Los análisis, imágenes y preferencias se guardan en `localStorage`; nada se transmite a un servidor.

## Desarrollo

```powershell
node --check dist/app.js
python -m http.server 4173 --directory dist
```

## Comunidad

Las contribuciones son bienvenidas. Consultá [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) y [SECURITY.md](SECURITY.md).

Licencia MIT.

## Privacidad

Los gráficos y análisis permanecen en el navegador. No se envían a ningún servidor.

