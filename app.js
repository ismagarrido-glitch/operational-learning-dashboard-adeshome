document.addEventListener("DOMContentLoaded", () => {
    // Configuración global de Chart.js
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'ui-sans-serif, system-ui, sans-serif';

    // Data del Proyecto Adeshome Chile (Julio 2025 - Junio 2026)
    const meses = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const otifData = [92.3, 91.8, 90.7, 88.4, 86.2, 83.6, 90.2, 91.0, 89.8, 88.6, 87.5, 80.9];
    const pedidosData = [83500, 87200, 93400, 108600, 126800, 147900, 91200, 88500, 96800, 104900, 116700, 171400];
    
    // Presupuesto vs Real (MM CLP)
    const presupData = [1297, 1297, 1297, 1297, 1387.5, 1387.5, 1297, 1297, 1297, 1297, 1297, 1387.5];
    const realData = [1280, 1290, 1310, 1320, 1696.9, 1690.0, 1250, 1240, 1300, 1310, 1330, 1751.0];

    // 1. Chart Presupuesto vs Real
    const ctxPresupuesto = document.getElementById('chartPresupuesto').getContext('2d');
    new Chart(ctxPresupuesto, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'Presupuesto (MM CLP)',
                    data: presupData,
                    backgroundColor: '#475569',
                    borderRadius: 4
                },
                {
                    label: 'Gasto Real (MM CLP)',
                    data: realData,
                    backgroundColor: (context) => {
                        const index = context.dataIndex;
                        // Destacar picos de Nov (+22.3%), Dic (+21.8%) y Jun (+26.2%)
                        return [4, 5, 11].includes(index) ? '#ef4444' : '#6366f1';
                    },
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        afterBody: (context) => {
                            const index = context[0].dataIndex;
                            if (index === 4) return '⚠️ Peak Nov: +22,3% sobregasto';
                            if (index === 5) return '⚠️ Peak Dic: +21,8% sobregasto';
                            if (index === 11) return '🚨 Peak Jun: +26,2% sobregasto (OTIF 80,9%)';
                        }
                    }
                }
            },
            scales: {
                y: { grid: { color: '#334155' } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Chart OTIF vs Pedidos
    const ctxOtif = document.getElementById('chartOtif').getContext('2d');
    new Chart(ctxOtif, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'OTIF (%)',
                    data: otifData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Volumen Pedidos',
                    data: pedidosData,
                    borderColor: '#f59e0b',
                    borderDash: [5, 5],
                    yAxisID: 'y1',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    min: 75,
                    max: 100,
                    grid: { color: '#334155' },
                    title: { display: true, text: 'OTIF %' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { display: false },
                    title: { display: true, text: 'Cantidad de Pedidos' }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // 3. Chart Productividad Personal
    const ctxPersonal = document.getElementById('chartPersonal').getContext('2d');
    new Chart(ctxPersonal, {
        type: 'bar',
        data: {
            labels: ['Mano de Obra Regular', 'Última Milla', 'Transporte Primario', 'Reprocesos', 'Energía'],
            datasets: [{
                label: 'Desviación Acumulada ($ MM CLP)',
                data: [392.8, 287.6, 53.5, 43.8, 33.7],
                backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#6366f1', '#64748b'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: '#334155' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Interactividad: Botón Simular Peak Demand
    const btnSimular = document.getElementById('simular-peak');
    let simulated = false;

    btnSimular.addEventListener('click', () => {
        simulated = !simulated;
        const otifEl = document.getElementById('kpi-otif');
        const barOtif = document.getElementById('bar-otif');
        const statusEl = document.getElementById('live-status');

        if (simulated) {
            otifEl.textContent = '96.2%';
            otifEl.className = 'text-3xl font-extrabold mt-1 text-emerald-400';
            barOtif.style.width = '96.2%';
            barOtif.className = 'bg-emerald-500 h-2 rounded-full transition-all duration-500';
            btnSimular.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Restablecer Estado';
            statusEl.textContent = 'SIMULACIÓN OPTIMIZADA (OTIF ≥ 96%)';
            statusEl.className = 'text-xs font-semibold text-indigo-400';
        } else {
            otifEl.textContent = '80,9%';
            otifEl.className = 'text-3xl font-extrabold mt-1 text-red-400';
            barOtif.style.width = '80.9%';
            barOtif.className = 'bg-red-500 h-2 rounded-full transition-all duration-500';
            btnSimular.innerHTML = '<i class="fa-solid fa-bolt"></i> Simular Peak Demand';
            statusEl.textContent = 'EN TIEMPO REAL';
            statusEl.className = 'text-xs font-semibold text-emerald-400';
        }
    });
});