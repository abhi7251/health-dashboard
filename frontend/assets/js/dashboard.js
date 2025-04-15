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

function createDetailChart(canvasId, labels, data, color, type = 'bar') {
    if (!canvasId) {
        console.error(`Canvas element with id '${canvasId}' not found.`);
        return;
    }
    const ctx = document.getElementById(canvasId).getContext('2d');
    let backgroundGradient = null;

    if (type === 'line') {
        const height = ctx.canvas.clientHeight || 300; // fallback to 300
        backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, color + '66'); // top (semi-opaque)
        backgroundGradient.addColorStop(1, color + '00'); // bottom (transparent)
    }
    

    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: type === 'bar' ? color : backgroundGradient,
                borderColor: color,
                borderWidth: 3,
                fill: type === 'line', // only fill under line chart
                tension: type === 'line' ? 0.4 : 0,
                pointRadius: 3,
                pointBackgroundColor: color,
                borderRadius: type === 'bar' ? 10 : 0,
                barThickness: type === 'bar' ? 15 : undefined
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            
            scales: {
                y: {
                    beginAtZero: false,
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
let currentChartType = 'bar';

const titleMap = {
    'steps': 'Steps History',
    'calories': 'Calories Burned History',
    'heartRate': 'Heart Rate History',
    'water': 'Water Intake History',
    'sleep': 'Sleep History',
    'weight': 'Weight History'
};

let chartData = {
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
    });
    updateCharts();
}

function updateCharts() {
    if(!document.getElementById('dashboard')) return;

    Object.entries(chartData).forEach(([id, data]) => {
        const valueSpan = document.querySelector(`#${id}ChartContainer .chart-value`);
        if (valueSpan) {
            valueSpan.textContent = data.value + (
                id === 'water' ? ' L' :
                id === 'sleep' ? ' hrs' :
                id === 'weight' ? ' kg' :
                id === 'heartRate' ? ' bpm' :
                id === 'calories' ? ' cal' : 
                ''
            );
        }
        //update chart value in the doughnut chart
        const chart = Chart.getChart(id + "Chart");
        if (chart) {
            chart.data.datasets[0].data[0] = data.value;
            chart.update();
        }
    });
}

async function loadData() {
    fetch('backend/api/get_today_data.php')
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
            updateCharts();
        })
        .catch(error => showAlert("Error loading data: " + error, "danger", 2000));
        
}

function setMetric(metric = null) {
    if (metric){
        if(currentMetric === metric) return;
        currentMetric = metric;
    } 

    $('.chart-container').removeClass('active');
    $(`#${currentMetric}ChartContainer`).addClass('active');

    updateDetailChartTitle();
    fetchHistoryData(currentMetric, currentTimeRange);
}

function updateDetailChartTitle() {
    document.getElementById('detailChartTitle').textContent = titleMap[currentMetric] || 'Activity History';
}

labels = [], values = [];
function createBigChart() {
    if(!document.getElementById('dashboard')) return;

    Chart.getChart("fitnessChart")?.destroy();
    createDetailChart('fitnessChart', labels, values, chartData[currentMetric].color,currentChartType);
}


function updateTimeRange(range) {
    currentTimeRange = range;
    document.getElementById('weeklyBtn').classList.toggle('active', range === 'weekly');
    document.getElementById('monthlyBtn').classList.toggle('active', range === 'monthly');

    fetchHistoryData(currentMetric, currentTimeRange);
}

function setChartType(type) {   
    currentChartType = type;
    document.getElementById('lineChartBtn').classList.toggle('active', type === 'line');
    document.getElementById('barChartBtn').classList.toggle('active', type === 'bar');
    fetchHistoryData(currentMetric, currentTimeRange);
}

async function fetchHistoryData() {
    metric = currentMetric, range = currentTimeRange;
    console.log(`Fetching history data for metric: ${metric}, range: ${range}`);
    
    fetch(`backend/api/get_history_data.php?metric=${metric}&range=${range}`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data.values)) {
                console.error("Invalid historical data format.");
                return;
            }
            if(data.labels && data.labels.length > 0){
                labels = data.labels;
            }
            if(data.values && data.values.length > 0){
                values = data.values;
            }
            
            createBigChart();
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

async function syncData() {
    showAlert("Syncing data...", "info",30000);   
    fetch('backend/api/fitbit_data_fetch.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
           showAlert("Error fetching data: " + data.error, "danger", 3000);
            return;
        }
       
       loadData();
       fetchHistoryData();
       showAlert("Data synced successfully!", "success", 2000);
       
    })
    .catch(error => showAlert("Error syncing data: " + error, "danger", 3000));
}


async function resetChartData(){
    labels = [], values = [];
    //reset chartData data
    Object.values(chartData).forEach((data) => {
        data.value = 0;
    });
    updateCharts();
    createBigChart();
}

setInterval(syncData, 5 * 60 * 1000);



