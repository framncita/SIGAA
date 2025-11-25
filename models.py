# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = "usuario"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    rol = db.Column(db.String(20), nullable=False)  # 'estudiante', 'docente', 'admin'
    password = db.Column(db.String(200), nullable=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

class Matricula(db.Model):
    __tablename__ = "matricula"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    carrera = db.Column(db.String(150), nullable=False)
    anio = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(50), default='activa')

class Nota(db.Model):
    __tablename__ = "nota"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    asignatura = db.Column(db.String(120), nullable=False)
    nota = db.Column(db.Float, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

class Asistencia(db.Model):
    __tablename__ = "asistencia"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    asignatura = db.Column(db.String(120), nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    presente = db.Column(db.Boolean, default=False)

class Certificado(db.Model):
    __tablename__ = "certificado"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    tipo = db.Column(db.String(120), nullable=False)  # e.g., 'matricula', 'regular'
    generado_en = db.Column(db.DateTime, default=datetime.utcnow)
