function createChart(chartId, value, maxValue, color) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error(`Canvas element with id '${chartId}' not found.`);
        return;
    }

    const ctx = canvas.getContext('2d');
    let remainingValue = value > maxValue ? 0 : maxValue - value;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, remainingValue],
                backgroundColor: [color, '#ddd'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            cutout: '85%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

function createDetailChart(canvasId, labels, data, barColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: barColor,
                borderRadius: 10,
                borderWidth: 1,
                barThickness: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

let currentMetric = 'steps';
let currentTimeRange = 'weekly';

const titleMap = {
    'steps': 'Steps History',
    'calories': 'Calories Burned History',
    'heartRate': 'Heart Rate History',
    'water': 'Water Intake History',
    'sleep': 'Sleep History',
    'weight': 'Weight History'
};

const chartData = {
    steps: { value: 0, maxValue: 10000, color: '#4caf50' },
    calories: { value: 0, maxValue: 2500, color: '#ff9800' },
    heartRate: { value: 0, maxValue: 220, color: '#f44336' },
    water: { value: 0, maxValue: 4, color: '#2196f3' },
    sleep: { value: 0, maxValue: 10, color: '#9c27b0' },
    weight: { value: 0, maxValue: 150, color: '#795548' }
};

async function createCharts() {
    $('canvas').each(function () {
        Chart.getChart(this)?.destroy();
    });


    Object.entries(chartData).forEach(([id, data]) => {
        createChart(id + "Chart", data.value, data.maxValue, data.color);

        const valueSpan = document.querySelector(`#${id}ChartContainer .chart-value`);
        if (valueSpan) {
            valueSpan.textContent = data.value + (
                id === 'water' ? ' L' :
                id === 'sleep' ? ' hrs' :
                id === 'weight' ? ' kg' :
                id === 'heartRate' ? ' bpm' :
                id === 'calories' ? ' kcal' : 
                ''
            );
        }
    });
}

function showDetailChart(metric = null) {
    if (metric) currentMetric = metric;

    $('.chart-container').removeClass('active');
    $(`#${currentMetric}ChartContainer`).addClass('active');

    updateDetailChartTitle();
    updateTimeRange(currentTimeRange);
}

function updateDetailChartTitle() {
    document.getElementById('detailChartTitle').textContent = titleMap[currentMetric] || 'Activity History';
}

function updateTimeRange(range) {
    currentTimeRange = range;

    document.getElementById('weeklyBtn').classList.toggle('active', range === 'weekly');
    document.getElementById('weeklyBtn').classList.toggle('btn-primary', range === 'weekly');
    document.getElementById('weeklyBtn').classList.toggle('btn-outline-primary', range !== 'weekly');

    document.getElementById('monthlyBtn').classList.toggle('active', range === 'monthly');
    document.getElementById('monthlyBtn').classList.toggle('btn-primary', range === 'monthly');
    document.getElementById('monthlyBtn').classList.toggle('btn-outline-primary', range !== 'monthly');

    fetchHistoryData(currentMetric, currentTimeRange);
}

function fetchHistoryData(metric, range) {
    fetch(`../backend/api/get_history_data.php?metric=${metric}&range=${range}`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data.values)) {
                console.error("Invalid historical data format.");
                return;
            }

            Chart.getChart("fitnessChart")?.destroy();
            createDetailChart('fitnessChart', data.labels, data.values, chartData[metric].color);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function updateChart(chartId, value, maxValue) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const chart = chart.getChart(canvas);
    if (chart) {
        chart.data.datasets[0].data = [value, maxValue - value];
        chart.update();
    }
}

async function loadData() {
    fetch('../backend/api/get_today_data.php')
    .then(response => response.json())
    .then(data => {
            if (data.error) {
                showAlert("Error fetching data: " + data.error, "danger", 2000);
                return;
            }
            
            chartData.steps.value = data.steps || 0;
            chartData.calories.value = data.calories || 0;
            chartData.heartRate.value = data.heartRate || 0;
            chartData.water.value = data.water || 0;
            chartData.sleep.value = data.sleep || 0;
            chartData.weight.value = data.weight || 0;
            
            showDetailChart(currentMetric);
            createCharts();
        })
        .catch(error => showAlert("Error loading data: " + error, "danger", 2000));
        
    }
    
async function syncData() {
<<<<<<< Updated upstream
    showAlert("Syncing data...", "info", 20000);   
=======
    showAlert("Syncing data...", "info", 60000);   
>>>>>>> Stashed changes

    fetch('../backend/api/fitbit_data_fetch.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
           showAlert("Error fetching data: " + data.error, "danger", 3000);
            return;
        }
       
       loadData();
       showAlert("Data synced successfully!", "success", 2000);
       
    })
    .catch(error => showAlert("Error syncing data: " + error, "danger", 3000));
}



