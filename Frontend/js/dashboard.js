let charts = {
    steps: null,
    heartRate: null,
    sleep: null
};

// Fetch Data from Backend API using AJAX (XMLHttpRequest)
function fetchData(endpoint, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/health-dashboard/backend/api/${endpoint}.php`, true);
    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.response);
        } else {
            callback(`Error: ${xhr.status}`, null);
        }
    };

    xhr.onerror = function () {
        callback('Request failed', null);
    };

    xhr.send();
}

// Initialize All Charts
function initializeDashboard() {
    let stepsData, heartData, sleepData;

    fetchData('steps', (err, data) => {
        if (err) {
            console.error('Error fetching steps data:', err);
            showError();
        } else {
            stepsData = data;
            createCharts();
        }
    });

    fetchData('heartrate', (err, data) => {
        if (err) {
            console.error('Error fetching heart rate data:', err);
            showError();
        } else {
            heartData = data;
            createCharts();
        }
    });

    fetchData('sleep', (err, data) => {
        if (err) {
            console.error('Error fetching sleep data:', err);
            showError();
        } else {
            sleepData = data;
            createCharts();
        }
    });

    function createCharts() {
        if (stepsData && heartData && sleepData) {
            // Hide Loading Message & Show Dashboard
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';

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
        }
    }
}

// Show Error Message if Data Fetch Fails
function showError() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.innerHTML = '<div class="alert alert-danger">Failed to load data</div>';
}

// Start Dashboard
document.addEventListener('DOMContentLoaded', initializeDashboard);
