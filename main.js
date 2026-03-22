const URL = import.meta.env.VITE_SCRIPT_URL;
const TOKEN = import.meta.env.VITE_APP_TOKEN;
let cache = [];

async function fetchInv() {
    const r = await fetch(URL);
    cache = await r.json();
    render(cache);
}

function render(data) {
    const g = document.getElementById('grid-productos');
    g.innerHTML = data.map(p => `
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-xl">
            <div class="flex justify-between items-start mb-6">
                <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">${p.id}</span>
                <span class="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-bold">${p.categoria}</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">${p.producto}</h2>
            <p class="text-3xl font-black text-blue-600 mb-8">$${p.precio}</p>
            <div class="pt-6 border-t border-slate-50">
                <p class="text-sm font-bold mb-4 ${p.stock <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'}">Stock: ${p.stock} unid.</p>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="accion('${p.id}', 'VENTA')" class="bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-red-600 transition">Vender</button>
                    <button onclick="accion('${p.id}', 'REPOSICION')" class="bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Surtir</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.accion = async (id, tipo) => {
    await fetch(URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ token: TOKEN, accion: tipo, id: id })
    });
    setTimeout(fetchInv, 1200);
};

document.getElementById('buscador').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    render(cache.filter(p => p.producto.toLowerCase().includes(val) || p.id.toLowerCase().includes(val)));
});

fetchInv();
