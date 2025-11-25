
# SIGAA - Prototipo (Flask + localStorage)

## Descripción
Prototipo funcional del Sistema Integrado de Gestión Académica y Administrativa (SIGAA).
- No usa base de datos real: los datos se guardan en `localStorage` del navegador.
- Servidor Flask sólo sirve las páginas y archivos estáticos.

## Cómo ejecutar
1. Instala dependencias:
pip install -r requirements.txt


2. Ejecuta la app:
python app.py 


3. Abre en el navegador:
http://127.0.0.1:5000


## Notas
- Admin demo: crea usuarios desde la interfaz `Administración`.
- Las notas que guarda `Docente` se guardan en `localStorage` y el `Estudiante` las verá.
- Para resetear los datos en el prototipo borra `localStorage` desde las devtools del navegador.
