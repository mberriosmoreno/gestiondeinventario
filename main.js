const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN;

let productosLocal = []; // Para filtrar sin volver a consultar a Google

// 1. Cargar productos
async function cargarInventario() {
  const res = await fetch(SCRIPT_URL);
  productosLocal = await res.json();
  renderizar(productosLocal);
}

// 2. Dibujar tarjetas en pantalla
function renderizar(lista) {
  const grid = document.getElementById('grid-productos');
  grid.innerHTML = lista.map(p => `
    <div class="bg-white p-5 rounded-xl shadow-md border-t-4 ${p.stock < 5 ? 'border-red-500' : 'border-blue-500'}">
      <div class="flex justify-between mb-2">
        <span class="text-xs font-bold text-gray-400">${p.id}</span>
        <span class="px-2 py-1 text-[10px] bg-gray-100 rounded text-gray-600 uppercase font-bold">${p.categoría}</span>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-1">${p.producto}</h3>
      <p class="text-2xl font-black text-blue-600 mb-4">$${p.precio}</p>
      
      <div class="flex items-center justify-between mt-4">
        <span class="text-sm font-medium ${p.stock < 5 ? 'text-red-600 animate-pulse' : 'text-gray-500'}">
          Stock: ${p.stock} unid.
        </span>
        <button onclick="registrarVenta('${p.id}')" 
          class="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-black transition active:scale-95">
          Vender -1
        </button>
      </div>
    </div>
  `).join('');
}

// 3. Registrar Venta
window.registrarVenta = async (id) => {
  const confirmar = confirm(`¿Confirmar venta del producto ${id}?`);
  if (!confirmar) return;

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        token: APP_TOKEN,
        accion: "VENTA",
        id: id
      })
    });
    alert("Venta enviada. Actualizando...");
    setTimeout(cargarInventario, 1500); // Pausa para que Google procese
  } catch (err) {
    alert("Error de conexión");
  }
};

// 4. Buscador en tiempo real
document.getElementById('buscador').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtrados = productosLocal.filter(p => 
    p.producto.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
  );
  renderizar(filtrados);
});

// Iniciar
cargarInventario();
