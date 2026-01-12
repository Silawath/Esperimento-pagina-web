// --- FLOW.JS --- GESTIONE SEQUENZA ESPERIMENTO

// 1. CONFIGURAZIONE DELLA SCALETTA (SEQUENZA)
const EXPERIMENT_SEQUENCE = [
    // --- STEP 0: ANAGRAFICA ---
    { file: 'anagrafica.html', phase: 'ANAGRAFICA', context: 0, label: 'Dati Anagrafici' },
    
    // --- STEP 1-7: BLOCCO PRIMA LUCE (Fase 1) ---
    { file: 'kss.html', phase: 'PRE', context: 1, label: 'KSS Pre-Test' },               // Step 1
    { file: 'gvas.html', phase: 'PRE', context: 1, label: 'GVAS Pre-Test' },             // Step 2
    
    // ISTRUZIONI + CRONOMETRI
    { file: 'task_instruction.html', phase: 'INSTR', context: 1, label: 'Istruzioni Compito' }, // Step 3
    { file: 'task_manager.html', phase: 'TASK', context: 1, label: 'Esecuzione Compiti' },      // Step 4
    
    { file: 'kss.html', phase: 'POST', context: 1, label: 'KSS Post-Test' },             // Step 5
    { file: 'gvas.html', phase: 'POST', context: 1, label: 'GVAS Post-Test' },           // Step 6
    { file: 'vds.html', phase: 'POST', context: 1, label: 'VDS Post-Test' },             // Step 7

    // --- STEP 8: PAUSA ---
    { file: 'pause.html', phase: 'PAUSE', context: 0, label: 'Pausa' },

    // --- STEP 9-15: BLOCCO SECONDA LUCE (Fase 2) ---
    { file: 'kss.html', phase: 'PRE', context: 2, label: 'KSS Pre-Test' },               // Step 9
    { file: 'gvas.html', phase: 'PRE', context: 2, label: 'GVAS Pre-Test' },             // Step 10
    
    // ISTRUZIONI + CRONOMETRI
    { file: 'task_instruction.html', phase: 'INSTR', context: 2, label: 'Istruzioni Compito' }, // Step 11
    { file: 'task_manager.html', phase: 'TASK', context: 2, label: 'Esecuzione Compiti' },      // Step 12
    
    { file: 'kss.html', phase: 'POST', context: 2, label: 'KSS Post-Test' },             // Step 13
    { file: 'gvas.html', phase: 'POST', context: 2, label: 'GVAS Post-Test' },           // Step 14
    { file: 'vds.html', phase: 'POST', context: 2, label: 'VDS Post-Test' },             // Step 15

    // --- STEP 16: INTERVISTA FINALE ---
    { file: 'interview.html', phase: 'INT', context: 0, label: 'Intervista Finale' },

    // --- STEP 17: FINE ---
    { file: 'end.html', phase: 'END', context: 0, label: 'Fine' }
];

// 2. FUNZIONI DI UTILITÀ

// Recupera il nome della luce attuale (per salvare i dati col nome giusto)
function getCurrentLightName() {
    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    const step = EXPERIMENT_SEQUENCE[stepIndex];

    if (!step || step.context === 0) return "Generico"; 

    if (step.context === 1) return localStorage.getItem('light1_name');
    if (step.context === 2) return localStorage.getItem('light2_name');
    return "ND";
}

// Chiamata al caricamento di ogni pagina per impostare titoli e bloccare il tasto "Indietro"
function initPage() {
    // Blocco Tasto Indietro del browser
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    
    // Controllo di sicurezza: se l'indice non è valido
    if (stepIndex < 0) return; 

    // Se abbiamo finito gli step e non siamo già alla fine, vai alla fine
    if (stepIndex >= EXPERIMENT_SEQUENCE.length && !window.location.href.includes('end.html')) {
        window.location.replace('end.html');
        return;
    }

    const step = EXPERIMENT_SEQUENCE[stepIndex];

    // Aggiorna titoli dinamici nella pagina (h1 id="dynamic-title")
    const titleEl = document.getElementById('dynamic-title');
    const subtitleEl = document.getElementById('dynamic-subtitle');
    
    if (titleEl && step) {
        titleEl.innerText = step.label;
        // Nascondi il sottotitolo se presente, per pulizia
        if(subtitleEl) {
            subtitleEl.innerText = ""; 
            subtitleEl.style.display = "none";
        }
    }
}

// Funzione principale per passare alla pagina successiva
function nextStep() {
    let stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    stepIndex++;
    
    // Salviamo il nuovo indice
    localStorage.setItem('stepIndex', stepIndex);

    // Controlliamo se abbiamo finito la sequenza
    if (stepIndex >= EXPERIMENT_SEQUENCE.length) {
        window.location.replace('end.html');
        return;
    }

    // Carichiamo il file successivo
    const nextFile = EXPERIMENT_SEQUENCE[stepIndex].file;
    window.location.replace(nextFile);
}

// Avvia initPage automaticamente quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initPage);