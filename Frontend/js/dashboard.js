// Initialize Charts
let charts = {
    steps: null,
    heartRate: null,
    sleep: null
};

// Fetch Data from Backend API
function fetchData(endpoint) {
    return $.ajax({
        url: `/health-dashboard/backend/api/${endpoint}.php`,
        method: 'GET',
        dataType: 'json'
    });
}

// Initialize All Charts
async function initializeDashboard() {
    try {
        // Fetch Data from APIs
        const [stepsData, heartData, sleepData] = await Promise.all([
            fetchData('steps'),
            fetchData('heartrate'),
            fetchData('sleep')
        ]);

        // Hide Loading Message
        $('#loading').hide();
        $('#dashboard').show();

        // Create Charts
        charts.steps = new Chart(document.getElementById('stepsChart'), {
            type: 'line',
            data: {
                labels: stepsData.dates,
                datasets: [{
                    label: 'Steps',
                    data: stepsData.values,
                    borderColor: '#4CAF50',
                    tension: 0.4
                }]
            }
        });

        charts.heartRate = new Chart(document.getElementById('heartRateChart'), {
            type: 'bar',
            data: {
                labels: heartData.dates,
                datasets: [{
                    label: 'BPM',
                    data: heartData.values,
                    backgroundColor: '#f44336'
                }]
            }
        });

        charts.sleep = new Chart(document.getElementById('sleepChart'), {
            type: 'doughnut',
            data: {
                labels: ['Deep Sleep', 'Light Sleep', 'REM', 'Awake'],
                datasets: [{
                    data: sleepData.values,
                    backgroundColor: ['#2196F3', '#03A9F4', '#00BCD4', '#B2EBF2']
                }]
            }
        });

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        $('#loading').html('<div class="alert alert-danger">Failed to load data</div>');
    }
}

// Start Dashboard
$(document).ready(function() {
    initializeDashboard();
});