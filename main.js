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
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition">
            <div class="flex justify-between mb-4"><span class="text-[10px] font-bold text-slate-300">${p.id}</span></div>
            <h2 class="text-xl font-bold mb-1">${p.producto}</h2>
            <p class="text-2xl font-black text-blue-600 mb-6 font-mono">$${p.precio}</p>
            <div class="grid grid-cols-2 gap-2">
                <button onclick="api('${p.id}', 'VENTA')" class="bg-slate-900 text-white py-2 rounded-lg text-xs font-bold">Venta</button>
                <button onclick="api('${p.id}', 'REPOSICION')" class="bg-slate-100 py-2 rounded-lg text-xs font-bold">Surtir</button>
                <button onclick="prepararEdit('${p.id}')" class="border py-2 rounded-lg text-xs font-bold text-blue-500">Editar</button>
                <button onclick="api('${p.id}', 'ELIMINAR')" class="text-red-400 py-2 rounded-lg text-xs font-bold">Borrar</button>
            </div>
        </div>
    `).join('');
}

window.api = async (id, accion, extra = {}) => {
    await fetch(URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ token: TOKEN, accion, id, ...extra }) });
    setTimeout(fetchInv, 1200);
};

window.prepararEdit = (id) => {
    const p = cache.find(i => i.id == id);
    document.getElementById('f-id').value = p.id;
    document.getElementById('f-id').disabled = true;
    document.getElementById('f-nom').value = p.producto;
    document.getElementById('f-cat').value = p.categoria;
    document.getElementById('f-stk').value = p.stock;
    document.getElementById('f-pre').value = p.precio;
    editando = true;
};

window.enviarForm = async () => {
    const d = { id: document.getElementById('f-id').value, producto: document.getElementById('f-nom').value, categoria: document.getElementById('f-cat').value, stock: document.getElementById('f-stk').value, precio: document.getElementById('f-pre').value };
    await window.api(d.id, editando ? 'EDITAR' : 'CREAR', d);
    location.reload();
};

fetchInv();
