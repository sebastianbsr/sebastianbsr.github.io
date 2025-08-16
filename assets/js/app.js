
const pesosInput = document.getElementById("pesos");
const monedaSelect = document.getElementById("moneda");
const resultadoDiv = document.getElementById("resultado");
const ctx = document.getElementById("grafico").getContext("2d");
let chart;

// Cargar datos desde API o JSON local
async function obtenerDatos() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        if (!res.ok) throw new Error("Falla en la API");
        return await res.json();
    } catch (e) {
        const res = await fetch("mindicador.json");
        return await res.json();
    }
}

// Cargar opciones al select
async function cargarMonedas() {
    const data = await obtenerDatos();

    // Filtrar las monedas que tienen "valor" y no sean índices porcentuales o estadísticas
    const monedasValidas = Object.keys(data).filter(key => {
        const item = data[key];
        return item && item.valor && typeof item.valor === "number"
            && item.unidad_medida.toLowerCase() !== "porcentaje";
    });

    // Limpiar el select antes de agregar opciones nuevas
    monedaSelect.innerHTML = '<option value="" disabled selected>Selecciona moneda</option>';

    monedasValidas.forEach(key => {
        const item = data[key];
        const option = document.createElement("option");
        option.value = key;
        option.textContent = item.nombre;
        monedaSelect.appendChild(option);
    });
}

// Generar gráfico
async function cargarGrafico(codigo) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${codigo}`);
        const data = await res.json();
        const ultimos = data.serie.slice(0, 10).reverse();

        const labels = ultimos.map(d => new Date(d.fecha).toLocaleDateString());
        const valores = ultimos.map(d => d.valor);

        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Valor últimos 10 días",
                    data: valores,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                }]
            }
        });
    } catch (e) {
        console.error("Error al cargar gráfico:", e);
    }
}

// Convertir moneda
async function convertirMoneda() {
    const pesos = Number(pesosInput.value);
    const moneda = monedaSelect.value;
    if (!pesos || !moneda) return alert("Completa los campos");

    const data = await obtenerDatos();
    const valorMoneda = data[moneda].valor;
    const resultado = (pesos / valorMoneda).toFixed(2);
    resultadoDiv.textContent = `Resultado: $${resultado} ${data[moneda].nombre}`;

    cargarGrafico(moneda);
}

document.getElementById("convertir").addEventListener("click", convertirMoneda);
cargarMonedas();