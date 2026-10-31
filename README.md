# Market Structure Lab

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

## Uso local

Es una aplicación estática sin dependencias. Serví la carpeta `dist` con cualquier servidor HTTP:

```powershell
python -m http.server 4173 --directory dist
```

Luego abrí `http://localhost:4173`.

## Privacidad

Los gráficos y análisis permanecen en el navegador. No se envían a ningún servidor.

