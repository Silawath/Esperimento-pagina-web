const EXPERIMENT_SEQUENCE = [
  
    { file: 'anagrafica.html', phase: 'ANAGRAFICA', context: 0, label: 'Dati Anagrafici' },
  
    { file: 'kss.html', phase: 'PRE', context: 1, label: 'KSS Pre-Test' },               // Step 1
    { file: 'gvas.html', phase: 'PRE', context: 1, label: 'GVAS Pre-Test' },             // Step 2
    
 
    { file: 'task_instruction.html', phase: 'INSTR', context: 1, label: 'Istruzioni Compito' }, // Step 3
    { file: 'task_manager.html', phase: 'TASK', context: 1, label: 'Esecuzione Compiti' },      // Step 4
    
    { file: 'kss.html', phase: 'POST', context: 1, label: 'KSS Post-Test' },             // Step 5
    { file: 'gvas.html', phase: 'POST', context: 1, label: 'GVAS Post-Test' },           // Step 6
    { file: 'vds.html', phase: 'POST', context: 1, label: 'VDS Post-Test' },             // Step 7

   
    { file: 'pause.html', phase: 'PAUSE', context: 0, label: 'Pausa' },

    
    { file: 'kss.html', phase: 'PRE', context: 2, label: 'KSS Pre-Test' },               // Step 9
    { file: 'gvas.html', phase: 'PRE', context: 2, label: 'GVAS Pre-Test' },             // Step 10
    

    { file: 'task_instruction.html', phase: 'INSTR', context: 2, label: 'Istruzioni Compito' }, // Step 11
    { file: 'task_manager.html', phase: 'TASK', context: 2, label: 'Esecuzione Compiti' },      // Step 12
    
    { file: 'kss.html', phase: 'POST', context: 2, label: 'KSS Post-Test' },             // Step 13
    { file: 'gvas.html', phase: 'POST', context: 2, label: 'GVAS Post-Test' },           // Step 14
    { file: 'vds.html', phase: 'POST', context: 2, label: 'VDS Post-Test' },             // Step 15

 
    { file: 'interview.html', phase: 'INT', context: 0, label: 'Intervista Finale' },

    { file: 'end.html', phase: 'END', context: 0, label: 'Fine' }
];


function getCurrentLightName() {
    const stepIndex = parseInt(localStorage.getItem('stepIndex') || 0);
    const step = EXPERIMENT_SEQUENCE[stepIndex];

    if (!step || step.context === 0) return "Generico"; 

    if (step.context === 1) return localStorage.getItem('light1_name');
    if (step.context === 2) return localStorage.getItem('light2_name');
    return "ND";
}

function initPage() {

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