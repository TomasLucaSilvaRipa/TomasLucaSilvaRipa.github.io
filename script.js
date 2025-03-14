class Tarea {
    constructor(ID, Nombre, Fecha, Estado) {
        this.ID = ID;
        this.Nombre = Nombre;
        this.Fecha = Fecha;
        this.Estado = Estado;
        this.informacion = `${ID} - ${Nombre} - ${Fecha} - ${Estado}`;
    }

    verTarea() {
        console.log(this.informacion);
    }
}

const container = document.querySelector(".container_Tareas");
let documentFragment = document.createDocumentFragment();
let botonBorrar; 
let nombreDeArchivo = "";

let inputNombreLista = document.querySelector(".inputNuevoArchivo");
inputNombreLista.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        crearToDoList(inputNombreLista.value);
    }
})
let checkIcon = document.querySelector(".checkIcon");
checkIcon.addEventListener("click",()=>{
    crearToDoList(inputNombreLista.value);
});

function crearToDoList(nombreDeLista){
    if(!nombreDeLista){
        alert("Asigne un nombre a la lista");
        return;
    }
    let listas = JSON.parse(localStorage.getItem("listas")) || [];
    if(listas.includes(nombreDeLista)){
        alert("Ya existe un archivo con ese nombre!!");
        return;
    }
    listas.push(nombreDeLista);
    localStorage.setItem("listas",JSON.stringify(listas));
    localStorage.setItem(nombreDeLista,JSON.stringify([]));
    console.log("Archivo creado correctamente");
    mostrarListas();
    inputNombreLista.value = "";
}

let fragmentoListas = document.createDocumentFragment();

function mostrarListas(){
    let listas = JSON.parse(localStorage.getItem("listas")) || [];
    let interfaz = document.querySelector(".listaDeArchivos");
    interfaz.innerHTML = "";
    listas.forEach((nombreLista,index) => {
        let divLista = document.createElement("DIV");
        divLista.classList.add("divLista");
        divLista.innerHTML = nombreLista;
        let deleteIcon = document.createElement("IMG");
        deleteIcon.alt = "Eliminar Lista";
        deleteIcon.src = "TrashV2/trash-2.svg";
        deleteIcon.classList.add("TrashIcon");
        deleteIcon.addEventListener("click",()=> {eliminarLista(nombreLista,divLista)});
        divLista.appendChild(deleteIcon);
        divLista.addEventListener("click",()=> { abrir(nombreLista)})
        fragmentoListas.appendChild(divLista);
    });
    interfaz.appendChild(fragmentoListas);
}
mostrarListas();

function eliminarLista(nombreDeLista, divLista){
    let listas = JSON.parse(localStorage.getItem("listas")) || [];
    listas = listas.filter(lista => lista != nombreDeLista);
    localStorage.setItem("listas",JSON.stringify(listas));
    localStorage.removeItem(nombreDeLista);
    divLista.remove();
    console.log("lista eliminada");
    mostrarListas();
}


function crearTarea(t){
    let div = document.createElement("DIV");
    div.classList.add("tarea");
    let tarea = new Tarea(t.ID, t.Nombre, t.Fecha, t.Estado);
    tarea.verTarea();
    let linea = document.createElement("HR");
    div.appendChild(linea);
    for(const key in tarea ){
        if(key !== "informacion" && key !== "Estado"){
            let div_hijo = document.createElement("DIV");
            div_hijo.classList.add(`atributo_${key}`,"div_atributo");
            div_hijo.innerHTML =`${tarea[key]}` ;
            div.appendChild(div_hijo); 
        }
        else if(key === "Estado"){
            let div_hijo = document.createElement("DIV");
            div_hijo.classList.add(`atributo_${key}`,"div_atributo");
            let checkBox = document.createElement("INPUT");
            checkBox.type = "checkbox";
            checkBox.classList.add("input_checkboxTarea");
            div_hijo.appendChild(checkBox);
            CargarEstado(checkBox,t,linea,div);
            checkBox.addEventListener("change",function(){ 
                if(checkBox.checked == true || checkBox.checked == false){
                    CambiarEstado(checkBox,t,linea,div);
                }
            });
            div.appendChild(div_hijo); 
        } 
    }
    div_botonBorrar = document.createElement("DIV");
    div_botonBorrar.classList.add("div_botonBorrar");
    botonBorrar = document.createElement("BUTTON");
    botonBorrar.classList.add("botonBorrar");
    botonBorrar.innerHTML = "Eliminar";
    botonBorrar.addEventListener("click", ()=> BorrarTarea(tarea,div));
    div_botonBorrar.appendChild(botonBorrar);
    div.appendChild(div_botonBorrar);
    div.classList.add("animacionCaidaLista");
    documentFragment.appendChild(div);
}

function abrir(nombreArchivo) {
    nombreDeArchivo = nombreArchivo;
    let tareasGuardadas = localStorage.getItem(nombreArchivo);
    container.innerHTML = "";
    if (!tareasGuardadas) {
        localStorage.setItem(nombreArchivo, JSON.stringify([]));
        console.log("Archivo To Do List creado exitosamente");
    } 
    else if (tareasGuardadas && tareasGuardadas.length > 2) { // Para evitar el caso de '[]'
        try {
            let tareas = JSON.parse(tareasGuardadas);
            tareas = OrganizarIDs(tareas);
            console.log("Tareas guardadas:");
            tareas.forEach(t => {
                crearTarea(t);
            });
            container.appendChild(documentFragment);
        } 
        catch (error) {
            console.error("Error al leer el archivo JSON:", error);
        }
    } 
    else {
        console.log("El archivo está vacío.");
        let mensaje = document.createElement("DIV");
        mensaje.classList.add("mensaje");
        mensaje.innerHTML = "No hay tareas pendientes";
        mensaje.classList.add("animacionCaidaLista");
        container.appendChild(mensaje);
    }
}

function AgregarTarea(nuevaTarea){
    if(nombreDeArchivo == ""){
        nombreDeArchivo = `ToDoList-${new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}`;
        crearToDoList(nombreDeArchivo)
    }
    let tareas = JSON.parse(localStorage.getItem(nombreDeArchivo) || []);
    tareas.push(nuevaTarea);
    tareas = OrganizarIDs(tareas);
    localStorage.setItem(nombreDeArchivo,JSON.stringify(tareas))
    let mensajeExistente = document.querySelector(".mensaje");
    if(mensajeExistente){
        mensajeExistente.remove();
    }
    crearTarea(nuevaTarea);
    container.appendChild(documentFragment);
}


const entrada = document.querySelector(".input_tareas");
const botonAgregarTarea = document.querySelector(".boton_Agregar");

botonAgregarTarea.addEventListener("click",(e)=>{
    let fechaActual = new Date().toISOString().slice(0,10);
    if(entrada.value != ""){
        if(entrada.value.length < 52){
            let nuevaTarea = new Tarea(1,entrada.value,fechaActual,'Activa') 
            console.clear();
            AgregarTarea(nuevaTarea);
            entrada.value = "";
        }
        else{
            console.log("Limite de texto sobrepasado");
        }
    }
    else{
        console.log("La tarea esta vacia");
    }
})

entrada.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        let fechaActual = new Date().toISOString().slice(0,10);
        if(entrada.value != ""){
            if(entrada.value.length < 52){
                let nuevaTarea = new Tarea(1,entrada.value,fechaActual,'Activa') 
                console.clear();
                AgregarTarea(nuevaTarea);
                entrada.value = "";
            }
            else{
                console.log("Limite de texto sobrepasado");
            }
        }
        else{
            console.log("La tarea esta vacia");
        }
    }
})


function BorrarTarea(t,divTarea){
    divTarea.classList.add("fadeOut");
    divTarea.addEventListener("animationend",()=>{
        divTarea.remove();
    })
    let tareasGuardadas  = JSON.parse(localStorage.getItem(nombreDeArchivo) || []);
    let index = tareasGuardadas.findIndex(tarea => tarea.ID === t.ID);
    tareasGuardadas.splice(index,1);
    let tareasDOM = container.children;
   
    for(let i = index + 1; i <= tareasGuardadas.length; i++){
        tareasDOM[i].classList.add("reordenarTareas");
        tareasDOM[i].addEventListener("animationend",()=>{
            tareasDOM[i].classList.remove("reordenarTareas");
        })
    } 
    tareasGuardadas =  OrganizarIDs(tareasGuardadas);
    localStorage.setItem(nombreDeArchivo,JSON.stringify(tareasGuardadas));
    
    console.log("Borrado exitoso");
    if (tareasGuardadas.length === 0) {
        mensaje = document.createElement("DIV");
        mensaje.classList.add("mensaje");
        mensaje.innerHTML = "No hay tareas pendientes";
        mensaje.classList.add("animacionCaidaLista");
        container.appendChild(mensaje);
    }
    abrir(nombreDeArchivo);
}

function OrganizarIDs(tareas){
    let id = 1;
    for(let t of tareas){
        t.ID = id;
        id++;
    }
    return tareas;
}

function CambiarEstado(checkBox,t,linea,div){
    let CheckBox = document.createElement("input");
    CheckBox = checkBox;
    let tareas = JSON.parse(localStorage.getItem(nombreDeArchivo)) || [];
    let index = tareas.findIndex(tarea => tarea.ID === t.ID);
    linea.classList.add("Tachon");
    if(index !== -1) {
        linea.classList.remove("animarTachon", "desvanecerTachon");
        div.classList.remove("animarColorFinalizacion","animarColorActivacion")
        if(CheckBox.checked == true){
            tareas[index].Estado = "Finalizado";
            void linea.offsetWidth;
            linea.classList.add("animarTachon");
            div.classList.add("animarColorFinalizacion")
            let sonidoTachon = document.createElement("AUDIO");
            sonidoTachon.src = "lapizTachando.mp4";
            sonidoTachon.play();
        }
        else if(CheckBox.checked == false){
            tareas[index].Estado = "Activo";
            void linea.offsetWidth;
            linea.classList.add("desvanecerTachon");
            div.classList.add("animarColorActivacion");
            let sonidoBorrado = document.createElement("AUDIO");
            sonidoBorrado.src = "sonidoBorrar.mp4";
            sonidoBorrado.play();
        }
        localStorage.setItem(nombreDeArchivo,JSON.stringify(tareas)) 
        console.log("La tarea cambio de estado");
    }
}

function CargarEstado(checkBox,t,linea,div){
    let CheckBox = document.createElement("input");
    CheckBox = checkBox;
    linea.classList.remove("animarTachon", "desvanecerTachon");
    div.classList.remove("animarColorFinalizacion","animarColorActivacion")
    if(t.Estado == "Finalizado"){
        checkBox.checked = true;
        linea.classList.add("animarTachon");
        div.classList.add("animarColorFinalizacion")
    }
    else if(t.Estado == "Activo"){
        checkBox.checked = false;
    }
}
let menu = document.querySelector(".menu");
let menu_icon = document.querySelector(".menu_bar");

let isMenuOpen = false;
menu_icon.addEventListener("click",()=>{
    if(!isMenuOpen){
        menu.classList.remove("barraMenuHide");
        menu.classList.add("barraMenuShow");
        isMenuOpen = true;
        console.log("menu abierto");
    }
})

let cross_icon = document.querySelector(".crossIcon");
cross_icon.addEventListener("click",()=>{
    if(isMenuOpen){
        menu.classList.remove("barraMenuShow");
        menu.classList.add("barraMenuHide");
        isMenuOpen = false;
    }
})




