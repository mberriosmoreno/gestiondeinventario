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
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="flex justify-between items-start mb-6">
                <span class="text-[10px] font-black text-slate-300 tracking-widest uppercase">${p.id}</span>
                <span class="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">${p.categoria}</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">${p.producto}</h2>
            <p class="text-3xl font-black text-blue-600 mb-8">$${p.precio}</p>
            
            <div class="pt-6 border-t border-slate-50">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-sm font-bold ${p.stock <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'} uppercase tracking-tight">
                        Stock: ${p.stock} unidades
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="enviarAccion('${p.id}', 'VENTA')" 
                        class="bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase hover:bg-red-600 transition-all active:scale-95">Vender</button>
                    <button onclick="enviarAccion('${p.id}', 'REPOSICION')" 
                        class="bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase hover:bg-blue-700 transition-all active:scale-95">Surtir</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.enviarAccion = async (id, tipo) => {
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
