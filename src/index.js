import Chart from 'chart.js/auto';
import 'flowbite';


var parqueosEnFront = document.getElementById("parqueosEnFront");
const parqueos = new Array(30);
const TARIFA = 0.83;
var cantidadEntradas = 0;
var cantidadRechazados = 0;
var totalTarifaParqueo = 0;


class Vehiculo {
    constructor(placa, tiempo) {
        this.placa = placa;
        this.tiempo = tiempo;
    }
}

function generarPlaca() {
    var placa = "";
    var letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numeros = "0123456789";
    for (var i = 0; i < 3; i++) {
        placa += letras.charAt(Math.floor(Math.random() * letras.length));
        placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    return placa;
}

function generarTiempo() {
    var tiempo = Math.floor(Math.random() * 60) + 1;
    return tiempo;
}

function createVehiculo() {
    var vehiculo = new Vehiculo(generarPlaca(), generarTiempo());
    return vehiculo;
}

function insertarNuevoVehiculo() {
    var vehiculo = createVehiculo();
    var parqueo = parqueos.findIndex((parqueo) => parqueo == null);
    if (parqueo != -1) {
        parqueos[parqueo] = vehiculo;
        createNuevoHijoDeCuerpoTabla(parqueo, vehiculo.tiempo);
        cantidadEntradas++;
        totalTarifaParqueo += vehiculo.tiempo * TARIFA;
    } else {
        cantidadRechazados++;
    }
}

function createNuevoHijoDeCuerpoTabla(numerodeparqueo, tiempo) {
    var posicionentabla = document.getElementById('cuerpo');
    var row = document.createElement("tr");
    row.className = "border-b border-gray-200 dark:border-gray-700";
    posicionentabla.appendChild(row);
    var th1 = document.createElement("th");
    th1.className = "py-4 px-6 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800";
    th1.innerHTML = numerodeparqueo + 1;
    row.appendChild(th1);
    var td1 = document.createElement("td");
    td1.className = "py-4 px-6"
    var div1 = document.createElement("div");
    div1.className = "flex items-center";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
    checkbox.checked = true;
    div1.appendChild(checkbox);
    td1.appendChild(div1);
    row.appendChild(td1);
    var td2 = document.createElement("td");
    td2.className = "py-4 px-6 bg-gray-50 dark:bg-gray-800";
    td2.innerHTML = tiempo + " min";
    row.appendChild(td2);
    var td3 = document.createElement("td");
    td3.className = "py-4 px-6";
    td3.innerHTML = "RD$ " + (tiempo * TARIFA).toFixed(2);
    row.appendChild(td3);
}

//Elimnar un vehiculo del parqueo de manera aleatoria
function eliminarVehiculo() {
    var parqueo = parqueos.findIndex((parqueo) => parqueo != null);
    if (parqueo != -1) {
        parqueos[parqueo] = null;
        var posicionentabla = document.getElementById('cuerpo');
        posicionentabla.removeChild(posicionentabla.childNodes[parqueo]);
    }
}

function actualizarParqueos() {
    for (var i = 0; i < parqueos.length; i++) {
        if (parqueos[i] != null) {
            parqueos[i].tiempo--;
            if (parqueos[i].tiempo == 0) {
                parqueos[i] = null;
                var posicionentabla = document.getElementById('cuerpo');
                posicionentabla.removeChild(posicionentabla.childNodes[i]);
            }
        }
    }
}

function actualizarParqueosEnFront() {
    var parqueosOcupados = parqueos.filter((parqueo) => parqueo != null).length;
    parqueosEnFront.innerHTML = parqueosOcupados;
}

function actualizarGrafica() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Vehiculos que entraron', 'Vehiculos rechazados', 'Tarifa total'],
            datasets: [{
                label: 'Vehiculos que entraron',
                data: [cantidadEntradas],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            },
        {
            label: 'Vehiculos que fueron rechazados',
            data: [cantidadRechazados],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        },
        {
            label: 'Tarifa total',
            data: [totalTarifaParqueo],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Estadisticas de parqueos'
                }
            }
        }
    });
}

var comenzarSimulacion = setInterval(() => {
    insertarNuevoVehiculo();
}, 3000);

//pausar la simulacion con el boton de stop
var stop = document.getElementById("stop");
stop.addEventListener("click", () => {
    clearInterval(comenzarSimulacion);
    console.log("simulacion detenida");
});

//reanudar la simulacion con el boton de resume
var resume = document.getElementById("resume");
resume.addEventListener("click", () => {
    comenzarSimulacion = setInterval(() => {
        insertarNuevoVehiculo();
    }, 3000);
    console.log("simulacion reanudada");
});

//Remover la tabla con los vehiculos y mostrar la grafica final cuando se presione el boton de finish
var finish = document.getElementById("finish");
finish.addEventListener("click", () => {
    var tabla = document.getElementById("tabla");
    tabla.style.display = "none";
    var grafica = document.getElementById("myChart");
    grafica.style.display = "block";
    actualizarGrafica();
});

// const labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//   ];

//   const data = {
//     labels: labels,
//     datasets: [{
//       label: 'My First dataset',
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgb(255, 99, 132)',
//       data: [0, 10, 5, 2, 20, 30, 45],
//     }]
//   };

//   const config = {
//     type: 'line',
//     data: data,
//     options: {}
//   };

// var myChart = new Chart(
//     document.getElementById('myChart'),
//     config
// );

// myChart.update();