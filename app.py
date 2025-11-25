from flask import Flask, render_template
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/estudiante')
def estudiante():
    return render_template('estudiante.html')

@app.route('/docente')
def docente():
    return render_template('docente.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/gestion-academica')
def gestion_academica():
    return render_template('gestion_academica.html')

@app.route('/seguimiento')
def seguimiento():
    return render_template('seguimiento.html')

@app.route('/reportes')
def reportes():
    return render_template('reportes.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)

