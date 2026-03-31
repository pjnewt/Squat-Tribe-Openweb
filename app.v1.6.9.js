// Main application logic for Squat Tribe
let totalReps = 0;
let effectiveLoad = 0;
let densityScore = 0;
let symmetry = 0;
let workoutActive = false;
let startTime = 0;
let sessionData = [];
let userSettings = {
    bodyweight: 0,
    sensorSensitivity: 'high',
    sensorReady: false
};

// DOM elements
const totalRepsElement = document.getElementById('totalReps');
const effectiveLoadElement = document.getElementById('effectiveLoad');
const densityScoreElement = document.getElementById('densityScore');
const symmetryElement = document.getElementById('symmetry');
const startWorkoutButton = document.getElementById('startWorkout');
const logSessionButton = document.getElementById('logSession');

// Initialize PWA
function initPWA() {
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
    
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem('squatSettings');
    if (savedSettings) {
        userSettings = JSON.parse(savedSettings);
    }
    
    // Set up event listeners
    startWorkoutButton.addEventListener('click', startWorkout);
    logSessionButton.addEventListener('click', logSession);
    
    // Initialize display
    updateDisplay();
}

// Start workout simulation
function startWorkout() {
    if (workoutActive) return;
    
    workoutActive = true;
    startTime = Date.now();
    totalReps = 0;
    effectiveLoad = 0;
    densityScore = 0;
    symmetry = 0;
    
    updateDisplay();
    
    // Simulate workout progress
    const workoutInterval = setInterval(() => {
        if (!workoutActive) {
            clearInterval(workoutInterval);
            return;
        }
        
        // Simulate metrics updates based on Pentagon Protocol
        const timeElapsed = (Date.now() - startTime) / 1000;
        totalReps += Math.floor(Math.random() * 3);
        
        // Calculate effective load with coefficients [8]
        const coefficient = 0.70; // Back squat coefficient [8]
        effectiveLoad = Math.random() * 200 + 50; // Random load between 50-250kg
        const bodyweight = userSettings.bodyweight || 70;
        const effectiveLoadValue = effectiveLoad + (bodyweight * coefficient);
        
        // Calculate density score [8]
        const totalRepsValue = totalReps;
        const ds = totalRepsValue > 0 ? effectiveLoadValue / totalRepsValue : 0;
        
        // Calculate symmetry
        symmetry = Math.random() * 20; // Random symmetry between 0-20%
        
        // Update display
        updateDisplay();
        
        // Store session data
        sessionData.push({
            timestamp: Date.now(),
            reps: totalReps,
            load: effectiveLoad,
            ds: ds,
            symmetry: symmetry
        });
    }, 1000);
    
    startWorkoutButton.textContent = 'Workout Active';
    startWorkoutButton.disabled = true;
}

// Update display with current metrics
function updateDisplay() {
    totalRepsElement.textContent = totalReps;
    effectiveLoadElement.textContent = Math.round(effectiveLoad) + ' kg';
    densityScoreElement.textContent = densityScore.toFixed(2);
    symmetryElement.textContent = symmetry.toFixed(1) + '%';
}

// Log session data
function logSession() {
    if (sessionData.length === 0) {
        alert('No workout data to log');
        return;
    }
    
    const session = {
        id: Date.now(),
        date: new Date().toISOString(),
        totalReps: totalReps,
        effectiveLoad: effectiveLoad,
        densityScore: densityScore,
        symmetry: symmetry,
        data: sessionData,
        bodyweight: userSettings.bodyweight
    };
    
    // Save to localStorage
    const storedSessions = JSON.parse(localStorage.getItem('squatSessions') || '[]');
    storedSessions.push(session);
    localStorage.setItem('squatSessions', JSON.stringify(storedSessions));
    
    alert('Session logged successfully!');
    sessionData = [];
    workoutActive = false;
    startWorkoutButton.textContent = 'Start Workout';
    startWorkoutButton.disabled = false;
}

// Sensor calibration functions
function runSensorCheck() {
    // Simulate sensor check
    userSettings.sensorReady = true;
    localStorage.setItem('squatSettings', JSON.stringify(userSettings));
    
    // Update UI to show sensor ready
    const sensorStatus = document.querySelector('.sensor-dot');
    if (sensorStatus) {
        sensorStatus.classList.add('ready');
    }
}

// Initialize the PWA
initPWA();
