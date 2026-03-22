const URL = import.meta.env.VITE_SCRIPT_URL;
const TOKEN = import.meta.env.VITE_APP_TOKEN;
let cache = [];
let editando = false;

async function fetchInv() {
    const r = await fetch(URL);
    cache = await r.json();
    render(cache);
}

function render(data) {
    const g = document.getElementById('grid-productos');
    g.innerHTML = data.map(p => `
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div class="flex justify-between mb-4">
                <span class="text-[10px] font-bold text-slate-300 tracking-widest">${p.id}</span>
                <span class="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase">${p.categoria}</span>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-1">${p.producto}</h2>
            <p class="text-2xl font-black text-slate-900 mb-4">$${p.precio}</p>
            <p class="text-xs font-bold mb-4 ${p.stock <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'}">STOCK: ${p.stock}</p>
            
            <div class="grid grid-cols-2 gap-2 mb-2">
                <button onclick="api('${p.id}', 'VENTA')" class="bg-slate-900 text-white py-2 rounded-lg text-xs font-bold">Venta</button>
                <button onclick="api('${p.id}', 'REPOSICION')" class="bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold">Surtir</button>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button onclick="prepararEdicion('${p.id}')" class="border border-blue-200 text-blue-600 py-2 rounded-lg text-xs font-bold">Editar</button>
                <button onclick="api('${p.id}', 'ELIMINAR')" class="text-red-400 py-2 rounded-lg text-xs font-bold">Eliminar</button>
            </div>
        </div>
    `).join('');
}

window.api = async (id, accion, extra = {}) => {
    if(accion === 'ELIMINAR' && !confirm('¿Eliminar producto?')) return;
    await fetch(URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ token: TOKEN, accion, id, ...extra })
    });
    setTimeout(fetchInv, 1200);
};

window.prepararEdicion = (id) => {
    const p = cache.find(item => item.id == id);
    document.getElementById('f-id').value = p.id;
    document.getElementById('f-id').disabled = true;
    document.getElementById('f-nom').value = p.producto;
    document.getElementById('f-cat').value = p.categoria;
    document.getElementById('f-stk').value = p.stock;
    document.getElementById('f-pre').value = p.precio;
    editando = true;
};

window.procesarForm = async () => {
    const data = {
        producto: document.getElementById('f-nom').value,
        categoria: document.getElementById('f-cat').value,
        stock: parseInt(document.getElementById('f-stk').value),
        precio: parseFloat(document.getElementById('f-pre').value),
        id: document.getElementById('f-id').value
    };
    await window.api(data.id, editando ? 'EDITAR' : 'CREAR', data);
    limpiarForm();
};

window.limpiarForm = () => {
    document.querySelectorAll('input').forEach(i => i.value = '');
    document.getElementById('f-id').disabled = false;
    editando = false;
};

fetchInv();
