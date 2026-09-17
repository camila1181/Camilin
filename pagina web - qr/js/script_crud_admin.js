// ===================
// CARGAR USUARIOS
// ===================
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


// ===================
// LISTAR
// ===================
function listarUsuarios(){

    let tabla = document.getElementById("tablaUsuarios");
    if(!tabla) return; // evita error si no existe

    tabla.innerHTML = "";

    usuarios.forEach(u => {

        tabla.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarUsuario(${u.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}


// ===================
// CREAR
// ===================
function crearUsuario(e){

    e.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let campoPass = document.getElementById("password");
    let password = campoPass ? campoPass.value : "";

    // Genera un id nuevo aunque se hayan borrado usuarios antes
    let id = usuarios.length > 0
        ? Math.max(...usuarios.map(u => u.id)) + 1
        : 1;

    usuarios.push({ id, nombre, correo, password, rol: "cliente" });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario creado");

    window.location.href = "dashboard_admin.html";
}


// ===================
// EDITAR
// ===================
function editarUsuario(id){

    localStorage.setItem("usuarioEditar", id);

    window.location.href = "editar_usuario.html";
}


// ===================
// CARGAR EDITAR
// ===================
function cargarUsuarioEditar(){

    let id = localStorage.getItem("usuarioEditar");

    let usuario = usuarios.find(u => u.id == id);

    if(usuario){
        document.getElementById("idUsuario").value = usuario.id;
        document.getElementById("nombreUsuario").value = usuario.nombre;
        document.getElementById("correoUsuario").value = usuario.correo;
    }
}


// ===================
// GUARDAR CAMBIOS
// ===================
function guardarUsuarioEditado(e){

    e.preventDefault();

    let id = document.getElementById("idUsuario").value;
    let nombre = document.getElementById("nombreUsuario").value;
    let correo = document.getElementById("correoUsuario").value;
    let campoPass = document.getElementById("passwordUsuario");
    let nuevaPassword = campoPass ? campoPass.value : "";

    let index = usuarios.findIndex(u => u.id == id);

    usuarios[index].nombre = nombre;
    usuarios[index].correo = correo;

    // Solo cambia la contraseña si el campo no se dejó vacío
    if (nuevaPassword) {
        usuarios[index].password = nuevaPassword;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Actualizado correctamente");

    window.location.href = "dashboard_admin.html";
}


// ===================
// ELIMINAR
// ===================
function eliminarUsuario(id){

    if(confirm("¿Eliminar usuario?")){
        usuarios = usuarios.filter(u => u.id != id);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        listarUsuarios();
    }
}


// ===================
// EXPORTAR EXCEL
// ===================
function exportarExcel(){

    let contenido = "ID,Nombre,Correo\n";

    usuarios.forEach(u => {
        contenido += `${u.id},${u.nombre},${u.correo}\n`;
    });

    let blob = new Blob([contenido], { type: "text/csv" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "usuarios.csv";
    a.click();
}


// ===================
// EXPORTAR WORD
// ===================
function exportarWord(){

    let contenido = "<h2>Usuarios</h2><table border='1'><tr><th>ID</th><th>Nombre</th><th>Correo</th></tr>";

    usuarios.forEach(u => {
        contenido += `<tr><td>${u.id}</td><td>${u.nombre}</td><td>${u.correo}</td></tr>`;
    });

    contenido += "</table>";

    let blob = new Blob(['\ufeff', contenido], { type: 'application/msword' });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "usuarios.doc";
    a.click();
}


// ===================
// EXPORTAR PDF
// ===================
function exportarPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;

    doc.text("Reporte de Usuarios", 10, y);
    y += 10;

    usuarios.forEach(u => {
        doc.text(`${u.id} - ${u.nombre} - ${u.correo}`, 10, y);
        y += 10;
    });

    doc.save("usuarios.pdf");
}