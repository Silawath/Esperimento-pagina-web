// --- FLOW.JS --- GESTIONE SEQUENZA ESPERIMENTO

// 1. CONFIGURAZIONE DELLA SCALETTA (SEQUENZA)
const EXPERIMENT_SEQUENCE = [
    // --- STEP 0: ANAGRAFICA ---
    { file: 'anagrafica.html', phase: 'ANAGRAFICA', context: 0, label: 'Dati Anagrafici' },
    
    // --- BLOCCO PRIMA LUCE (Fase 1) ---
    { file: 'kss.html', phase: 'PRE', context: 1, label: 'KSS Pre-Test' },
    { file: 'gvas.html', phase: 'PRE', context: 1, label: 'GVAS Pre-Test' },
    
    // ISTRUZIONI + CRONOMETRI
    { file: 'task_instruction.html', phase: 'INSTR', context: 1, label: 'Istruzioni Compito' },
    { file: 'task_manager.html', phase: 'TASK', context: 1, label: 'Esecuzione Compiti' },
    
    { file: 'kss.html', phase: 'POST', context: 1, label: 'KSS Post-Test' },
    { file: 'gvas.html', phase: 'POST', context: 1, label: 'GVAS Post-Test' },
    { file: 'vds.html', phase: 'POST', context: 1, label: 'VDS Post-Test' },

    // --- NUOVO STEP: ISTRUZIONI FINE FASE 1 ---
    // (Inserito prima della pausa come richiesto)
    { file: 'instruction.html', phase: 'INFO', context: 0, label: 'Fine Fase 1' },

    // --- PAUSA ---
    { file: 'pause.html', phase: 'PAUSE', context: 0, label: 'Pausa' },

    // --- BLOCCO SECONDA LUCE (Fase 2) ---
    { file: 'kss.html', phase: 'PRE', context: 2, label: 'KSS Pre-Test' },
    { file: 'gvas.html', phase: 'PRE', context: 2, label: 'GVAS Pre-Test' },
    
    // ISTRUZIONI + CRONOMETRI
    { file: 'task_instruction.html', phase: 'INSTR', context: 2, label: 'Istruzioni Compito' },
    { file: 'task_manager.html', phase: 'TASK', context: 2, label: 'Esecuzione Compiti' },
    
    { file: 'kss.html', phase: 'POST', context: 2, label: 'KSS Post-Test' },
    { file: 'gvas.html', phase: 'POST', context: 2, label: 'GVAS Post-Test' },
    { file: 'vds.html', phase: 'POST', context: 2, label: 'VDS Post-Test' },

    // --- NUOVO STEP: ISTRUZIONI FINE ESPERIMENTO ---
    // (Inserito prima dell'intervista come richiesto)
    { file: 'instruction2.html', phase: 'INFO', context: 0, label: 'Conclusione Test' },

    // --- INTERVISTA FINALE ---
    { file: 'interview.html', phase: 'INT', context: 0, label: 'Intervista Finale' },

    // --- FINE ---
    { file: 'end.html', phase: 'END', context: 0, label: 'Fine' }
];

// 2. FUNZIONI DI UTILITÀ

// Recupera il nome della luce attuale
function getCurrentLightName() {
    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    const step = EXPERIMENT_SEQUENCE[stepIndex];

    if (!step || step.context === 0) return "Generico"; 

    if (step.context === 1) return localStorage.getItem('light1_name');
    if (step.context === 2) return localStorage.getItem('light2_name');
    return "ND";
}

function initPage() {
    // Blocco Tasto Indietro
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    
    if (stepIndex < 0) return; 

    if (stepIndex >= EXPERIMENT_SEQUENCE.length && !window.location.href.includes('end.html')) {
        window.location.replace('end.html');
        return;
    }

    const step = EXPERIMENT_SEQUENCE[stepIndex];

    // Aggiorna titoli dinamici
    const titleEl = document.getElementById('dynamic-title');
    const subtitleEl = document.getElementById('dynamic-subtitle');
    
    if (titleEl && step) {
        titleEl.innerText = step.label;
        if(subtitleEl) {
            subtitleEl.innerText = ""; 
            subtitleEl.style.display = "none";
        }
    }
}

function nextStep() {
    let stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    stepIndex++;
    
    localStorage.setItem('stepIndex', stepIndex);

    if (stepIndex >= EXPERIMENT_SEQUENCE.length) {
        window.location.replace('end.html');
        return;
    }

    const nextFile = EXPERIMENT_SEQUENCE[stepIndex].file;
    window.location.replace(nextFile);
}

document.addEventListener('DOMContentLoaded', initPage);