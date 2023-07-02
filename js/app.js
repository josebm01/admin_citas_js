//* Campos del formulario
const mascotaInput = document.querySelector('#mascota')
const propietarioInput = document.querySelector('#propietario')
const telefonoInput = document.querySelector('#telefono')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')

//* UI
const formulario = document.querySelector('#nueva-cita') // Formulario de nuevas citas
const contenedorCitas = document.querySelector('#citas') // Contenedor para las citas

let editando = false


//* Definiendo clases
class Citas {
    constructor(){
        this.citas = []
    }

    agregarCita( cita ) {
        // Se agrega una copia del arreglo anterior y la nueva cita
        this.citas = [ ...this.citas, cita ]
        console.log(this.citas)
    }

    eliminarCita( id ) {
        // Filtrando el arreglo para mostrar todos menos el id de la cita que se quiere borrar
        this.citas = this.citas.filter( cita => cita.id !== id )
    }

    editarCita( citaActualizada ) {
        // Asignando el valor
        // Si corresponde al id se sobreescribe sobre ese registro, sino retorna la cita actual para mantener las que se tengan
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
    }
}


class UI {

    //? Se definen funciones globales de la clase     
    mostrarAlerta( mensaje, tipo ){
        // Creando div 
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12')

        // Agregar clase en base al tipo de mensaje
        if ( tipo === 'error' ){
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        // Mensaje de error
        divMensaje.textContent = mensaje

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))

        // Quitar alerta después de 5 segundos
        setTimeout(() => {
            divMensaje.remove()
        }, 2000);
    }


    // Desestructurando el argumento citas del objeto recibido 
    imprimirCitas({ citas }) {

        this.limpiarHTML()
        
        citas.forEach( cita => {
            const { id, mascota, propietario, telefono, fecha, hora, sintomas } = cita

            const divCita = document.createElement('div')
            divCita.classList.add('cita', 'p-3')
            divCita.dataset.id = id // Atributo personalizado

            //? Scripting de los elementos de la cita
            // - Mascota
            const mascotaParrafo = document.createElement('h2')
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder')
            mascotaParrafo.textContent = mascota

            // - Propietario
            const PropietarioParrafo = document.createElement('p')
            PropietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`

            // - Teléfono
            const TelefonoParrafo = document.createElement('p')
            TelefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span> ${telefono}`
            
            // - Fecha
            const FechaParrafo = document.createElement('p')
            FechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`
    
            // - Hora
            const HoraParrafo = document.createElement('p')
            HoraParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`
            
            // - Sintomas
            const SintomasParrafo = document.createElement('p')
            SintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span> ${sintomas}`


            //? Botón para eliminar 
            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
            btnEliminar.onclick = () => eliminarCita(id)


            //? Añade botón para editar
            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-info')
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>`
            btnEditar.onclick = () => cargarEdicion(cita)


            //? Agregar los párrafos al divCita 
            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(PropietarioParrafo)
            divCita.appendChild(TelefonoParrafo)
            divCita.appendChild(FechaParrafo)
            divCita.appendChild(HoraParrafo)
            divCita.appendChild(SintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            //? Agregar citas (con los elementos agregados anteriormente) al HTML
            contenedorCitas.appendChild(divCita)

        })

    }


    //* Remueve lo que contenga el contenedor para mostrar solo la cita agredada y no duplicar otra
    limpiarHTML() {
        while( contenedorCitas.firstChild ){
            // Eliminando cada uno de los hijos
            contenedorCitas.removeChild( contenedorCitas.firstChild )
        }
    } 

}



//* Instancia de la clase
const ui = new UI()
const administrarCitas = new Citas()


//* Objeto principal con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '', 
    hora: '',
    sintomas: ''
}

//* Registrar eventos
const eventListeners = () => {
    // Escuchadores de los input del formulario
    mascotaInput.addEventListener('input', datosCita)
    propietarioInput.addEventListener('input', datosCita)
    telefonoInput.addEventListener('input', datosCita)
    fechaInput.addEventListener('input', datosCita)
    horaInput.addEventListener('input', datosCita)
    sintomasInput.addEventListener('input', datosCita)

    // Escuchador en el botón de Crear Cita
    formulario.addEventListener('submit', nuevaCita)
}


//* Funciones 
//? Agrega datos escritos en el formulario al objeto de cita
const datosCita = (e) => {
    //* Buscando la propiedad del objeto por medio del name del formulario y asignandole el valor escrito dentro del formulario
    citaObj[e.target.name] = e.target.value
}


//? Valida y agrega nueva cita a la clase de Citas
const nuevaCita = (e) => {

    e.preventDefault()

    //* Extraer información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj

    // Validar que los inputs tengan información
    if ( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ){
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error')
        return
    }

    // Validación para identifica si es nueva o actualizar cita
    if ( editando ) {
        // console.log('Modo edición')

        //* Mensaje de agreado correctamente
        ui.mostrarAlerta('Se editó correctamente la cita')

        //* Pasar el objeto de la cita a edición
        administrarCitas.editarCita({ ...citaObj })

        //* Regresando el texto del botón a su título original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita'
        
        //* Quitar modo edición
        editando = false

    } else {
        // console.log('Modo nueva cita')

        //* Generar id
        citaObj.id = Date.now()
    
        /**
         * Creando nueva cita por medio de la función que tiene la instancia la Clase Citas
         * Pasando una copia del objeto y no todo porque se agrega el último la cantidad de registros que tuviera
         */
        administrarCitas.agregarCita({ ...citaObj })

        //* Mensaje de agreado correctamente
        ui.mostrarAlerta('Se agregó correctamente la cita')
    }


    // Reiniciar el objeto para la validación
    reiniciarObj()

    // Reiniciar formulario
    formulario.reset()

    /**
     * Mostrar HTML de la cita creada
     * Se le pasa el arreglo de las citas 
     */
    ui.imprimirCitas(administrarCitas)

}


//?  Reinicia valores del formulario 
const reiniciarObj = () => {
    citaObj.mascota = ''
    citaObj.propietario = ''
    citaObj.telefono = ''
    citaObj.fecha = ''
    citaObj.hora = ''
    citaObj.sintomas = ''
}


//? Eliminar cita
const eliminarCita = (id) => {

    //* Limpiar formularios
    formulario.reset()

    //* Eliminar cita
    administrarCitas.eliminarCita(id)

    //* Muestra un mensaje
    ui.mostrarAlerta('La cita se eliminó correctamente')

    //* Refresca las citas
    ui.imprimirCitas(administrarCitas)

}


//? Cargar los datos y el modo edición
const cargarEdicion = ( cita ) => {
    // Extrayendo las propiedades del objeto
    const { mascota, propietario, telefono, fecha, hora, sintomas } = cita

    // Llenar los inputs
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas

    // Llenar valores en el objeto
    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas


    // Cambiar el texto del botón cuando se quiera editar
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios'

    editando = true

}





eventListeners()