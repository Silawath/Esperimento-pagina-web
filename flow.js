// flow.js

// CONFIGURAZIONE DELLA SCALETTA (SEQUENZA)
const EXPERIMENT_SEQUENCE = [
    // --- ANAGRAFICA (Step 0) ---
    { file: 'anagrafica.html', phase: 'ANAGRAFICA', context: 0, label: 'Dati Anagrafici' },
    
    // --- BLOCCO PRIMA LUCE ---
    { file: 'kss.html', phase: 'PRE', context: 1, label: 'KSS Pre-Test' },
    { file: 'gvas.html', phase: 'PRE', context: 1, label: 'GVAS Pre-Test' },
    { file: 'task_instruction.html', phase: 'TASK', context: 1, label: 'Esecuzione Compito' },
    { file: 'kss.html', phase: 'POST', context: 1, label: 'KSS Post-Test' },
    { file: 'gvas.html', phase: 'POST', context: 1, label: 'GVAS Post-Test' },
    { file: 'vds.html', phase: 'POST', context: 1, label: 'VDS Post-Test' },

    // --- PAUSA ---
    { file: 'pause.html', phase: 'PAUSE', context: 0, label: 'Pausa' },

    // --- BLOCCO SECONDA LUCE ---
    { file: 'kss.html', phase: 'PRE', context: 2, label: 'KSS Pre-Test' },
    { file: 'gvas.html', phase: 'PRE', context: 2, label: 'GVAS Pre-Test' },
    { file: 'task_instruction.html', phase: 'TASK', context: 2, label: 'Esecuzione Compito' },
    { file: 'kss.html', phase: 'POST', context: 2, label: 'KSS Post-Test' },
    { file: 'gvas.html', phase: 'POST', context: 2, label: 'GVAS Post-Test' },
    { file: 'vds.html', phase: 'POST', context: 2, label: 'VDS Post-Test' },

    // --- FINE ---
    { file: 'end.html', phase: 'END', context: 0, label: 'Fine' }
];

// Funzione per ottenere il nome della luce attuale
function getCurrentLightName() {
    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    const step = EXPERIMENT_SEQUENCE[stepIndex];

    if (!step || step.context === 0) return ""; 

    if (step.context === 1) return localStorage.getItem('light1_name');
    if (step.context === 2) return localStorage.getItem('light2_name');
}

// Funzione chiamata al caricamento di ogni pagina
function initPage() {
    // --- 1. BLOCCO TASTO INDIETRO (Soluzione di Sicurezza) ---
    // Inserisce uno stato fittizio nella cronologia
    history.pushState(null, null, location.href);
    // Se l'utente preme indietro, lo rimandiamo avanti forzatamente
    window.onpopstate = function () {
        history.go(1);
    };
    // ---------------------------------------------------------

    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    
    // Controllo di sicurezza: se l'indice è fuori scala, manda alla fine o all'inizio
    if (stepIndex < 0) return; // Siamo nel setup o intro
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

// Funzione per andare avanti
function nextStep() {
    let stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    stepIndex++;
    
    // Salviamo il nuovo indice
    localStorage.setItem('stepIndex', stepIndex);

    // Controlliamo se abbiamo finito
    if (stepIndex >= EXPERIMENT_SEQUENCE.length) {
        // Usa replace invece di href per non lasciare traccia nella cronologia
        window.location.replace('end.html');
        return;
    }

    // Reindirizziamo alla pagina successiva
    const nextFile = EXPERIMENT_SEQUENCE[stepIndex].file;
    
    // --- 2. USO DI REPLACE (Soluzione Principale) ---
    // Questo sostituisce la pagina corrente invece di aggiungerne una nuova.
    // L'utente non può tornare indietro perché la pagina precedente "non esiste più" nella cronologia.
    window.location.replace(nextFile);
}

// Avvia initPage quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initPage);