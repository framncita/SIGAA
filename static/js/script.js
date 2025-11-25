/* =========================
   UTILIDADES LOCAL STORAGE
========================= */
function LS(key, value) {
  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    return JSON.parse(localStorage.getItem(key) || "null");
  }
}

const USERS_KEY = "sigaa_users";
const NOTES_KEY = "sigaa_notes";
const SEGS_KEY  = "sigaa_segs";

/* =========================
   VALIDACIONES
========================= */
function correoValido(email) {
  return email.includes("@") && (email.includes(".com") || email.includes(".cl"));
}

function notaValida(nota) {
  const n = parseFloat(nota);
  return !isNaN(n) && n >= 1.0 && n <= 7.0;
}

function existeUsuarioId(id) {
  const users = LS(USERS_KEY) || [];
  return users.some(u => u.id === id);
}

/* =========================
   ADMIN - USUARIOS
========================= */
function crearUsuario() {
  const nombre   = document.getElementById("uNombre")?.value.trim();
  const apellido = document.getElementById("uApellido")?.value.trim();
  const email    = document.getElementById("uEmail")?.value.trim();
  const rol      = document.getElementById("uRol")?.value;

  if (!nombre || !apellido || !email || !rol) {
    alert("⚠️ Completa todos los campos.");
    return;
  }

  if (!correoValido(email)) {
    alert("⚠️ El correo debe tener @ y terminar en .com o .cl");
    return;
  }

  const users = LS(USERS_KEY) || [];

  users.push({
    id: Date.now(),
    nombre,
    apellido,
    email,
    rol
  });

  LS(USERS_KEY, users);
  renderUsuarios();
}

/* =========================
   RENDER USUARIOS
========================= */
function renderUsuarios() {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  if (!tbody) return;

  const users = LS(USERS_KEY) || [];
  tbody.innerHTML = "";

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre} ${u.apellido}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td><button onclick="eliminarUsuario(${u.id})">❌</button></td>
      </tr>
    `;
  });
}

function eliminarUsuario(id) {
  let users = LS(USERS_KEY) || [];
  users = users.filter(u => u.id !== id);
  LS(USERS_KEY, users);
  renderUsuarios();
}

/* =========================
   DOCENTE - NOTAS
========================= */
function guardarNota() {
  const usuario_id = Number(document.getElementById("docUsuarioId")?.value);
  const asignatura = document.getElementById("docAsignatura")?.value.trim();
  const nota       = document.getElementById("docNota")?.value;

  if (!usuario_id || !asignatura || !nota) {
    alert("⚠️ Completa todos los campos.");
    return;
  }

  if (!existeUsuarioId(usuario_id)) {
    alert("⚠️ El ID no existe.");
    return;
  }

  if (!notaValida(nota)) {
    alert("⚠️ La nota debe estar entre 1.0 y 7.0");
    return;
  }

  const notas = LS(NOTES_KEY) || [];

  notas.unshift({
    id: Date.now(),
    usuario_id,
    asignatura,
    nota
  });

  LS(NOTES_KEY, notas);
  renderNotasDoc();
}

/* =========================
   RENDER NOTAS DOCENTE
========================= */
function renderNotasDoc() {
  const tbody = document.querySelector("#tablaNotasDoc tbody");
  if (!tbody) return;

  const notas = LS(NOTES_KEY) || [];
  tbody.innerHTML = "";

  notas.forEach(n => {
    tbody.innerHTML += `
      <tr>
        <td>${n.usuario_id}</td>
        <td>${n.asignatura}</td>
        <td>${n.nota}</td>
      </tr>
    `;
  });
}

/* =========================
   SEGUIMIENTO
========================= */
function cargarSelectsEstudiantes() {
  const users = LS(USERS_KEY) || [];
  const selects = [
    document.getElementById("segEstudiante"),
    document.getElementById("selectEstudiante")
  ];

  selects.forEach(select => {
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione estudiante</option>';

    users
      .filter(u => u.rol === "estudiante")
      .forEach(u => {
        select.innerHTML += `<option value="${u.id}">
          ${u.nombre} ${u.apellido}
        </option>`;
      });
  });
}

function guardarSeguimiento() {
  const id = Number(document.getElementById("segEstudiante")?.value);
  const comentario = document.getElementById("segComentario")?.value.trim();

  if (!id || !comentario) {
    alert("⚠️ Completa los datos.");
    return;
  }

  if (!existeUsuarioId(id)) {
    alert("⚠️ El ID no existe.");
    return;
  }

  const segs = LS(SEGS_KEY) || [];

  segs.unshift({
    id: Date.now(),
    estudianteId: id,
    comentario,
    fecha: new Date().toLocaleDateString()
  });

  LS(SEGS_KEY, segs);
  document.getElementById("segComentario").value = "";

  renderSeguimientos();
}

/* =========================
   PORTAL ESTUDIANTE
========================= */
function renderSeguimientos() {
  const cont = document.getElementById("listaSeguimientos");
  if (!cont) return;

  const segs = LS(SEGS_KEY) || [];
  const users = LS(USERS_KEY) || [];

  cont.innerHTML = "";

  segs.forEach(s => {
    const est = users.find(u => u.id === s.estudianteId);
    const nombre = est ? `${est.nombre} ${est.apellido}` : "Desconocido";

    cont.innerHTML += `
      <div class="card">
        <h4>${nombre}</h4>
        <p>${s.comentario}</p>
        <small>${s.fecha}</small>
      </div>
    `;
  });
}

function mostrarDashboardEstudiante() {
  const id = Number(document.getElementById("selectEstudiante")?.value);
  const dash = document.getElementById("estudianteDashboard");

  if (!id || !dash) return;

  dash.style.display = "block";

  const users = LS(USERS_KEY) || [];
  const notas = LS(NOTES_KEY) || [];
  const segs = LS(SEGS_KEY) || [];

  const est = users.find(u => u.id === id);
  if (!est) return;

  document.getElementById("nombreEstudiante").textContent =
    `${est.nombre} ${est.apellido}`;

  /* Notas */
  const tbody = document.querySelector("#tablaNotas tbody");
  tbody.innerHTML = "";

  notas
    .filter(n => n.usuario_id === id)
    .forEach(n => {
      tbody.innerHTML += `
        <tr><td>${n.asignatura}</td><td>${n.nota}</td></tr>
      `;
    });

  /* Seguimiento */
  const lista = document.getElementById("listaSeguimiento");
  lista.innerHTML = "";

  segs
    .filter(s => s.estudianteId === id)
    .forEach(s => {
      lista.innerHTML += `<li>${s.fecha} - ${s.comentario}</li>`;
    });
}

/* =========================
   CERTIFICADOS (SIMULADOS)
========================= */
function generarCertificado(tipo) {
  const id = Number(document.getElementById("selectEstudiante")?.value);
  const users = LS(USERS_KEY) || [];
  const est = users.find(u => u.id === id);
  if (!est) return;

  alert(`${tipo} generado para ${est.nombre} ${est.apellido}`);
}

/* =========================
   DOM INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  /* Admin */
  document.getElementById("btnCrearUsuario")?.addEventListener("click", crearUsuario);
  renderUsuarios();

  /* Docente */
  document.getElementById("btnGuardarNota")?.addEventListener("click", guardarNota);
  renderNotasDoc();

  /* Seguimiento */
  document.getElementById("btnAgregarSeguimiento")?.addEventListener("click", guardarSeguimiento);

  /* Estudiante */
  document.getElementById("selectEstudiante")?.addEventListener("change", mostrarDashboardEstudiante);

  /* Certificados */
  document.getElementById("btnCertAlumno")?.addEventListener("click",
    () => generarCertificado("Certificado Alumno Regular")
  );
  document.getElementById("btnCertNotas")?.addEventListener("click",
    () => generarCertificado("Certificado de Notas")
  );

  cargarSelectsEstudiantes();
  renderSeguimientos();
});
