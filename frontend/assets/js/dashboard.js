function createChart(chartId, value, maxValue, color) {
    const canvas = document.getElementById(chartId);

    if (canvas) {
        const ctx = canvas.getContext('2d');

        let remainingValue = maxValue - value; // Ensure value does not exceed maxValue
        if(value > maxValue){
            remainingValue = 0;
        }
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
                cutout: '85%', // Inner cutout for the doughnut
                rotation: -90, // Start from the top of the circle
                circumference: 180, // Half doughnut
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    } else {
        console.error(`Canvas element with id '${chartId}' not found.`);
    }
}


function createDetailChart(canvasId, labels, data, barColor) {
    // Get the context of the canvas element
    var ctx = document.getElementById(canvasId).getContext('2d');

    // Create the bar chart
    new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
            labels: labels, // X-axis labels
            datasets: [{
                data: data,  // Y-axis values
                backgroundColor: barColor, // Bar color
                borderRadius: 10,  // Round corners of bars
                borderWidth: 1,  // Thin border
                barThickness: 15  // Thin bars
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,  // Ensure the Y-axis starts from 0
                    grid: {
                        display: false  // Hide Y-axis grid lines
                    }
                },
                x: {
                    grid: {
                        display: false  // Hide X-axis grid lines
                    }
                }
            },
            plugins: {
                legend: {
                    display: false  // Hide the legend
                }
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
    steps: { value: 4500, maxValue: 8000, color: '#4caf50' },
    calories: { value: 1200, maxValue: 2500, color: '#ff9800' },
    heartRate: { value: 195, maxValue: 220, color: '#f44336' },
    water: { value: 1.5, maxValue: 3, color: '#2196f3' },
    sleep: { value: 6, maxValue: 9, color: '#9c27b0' },
    weight: { value: 70, maxValue: 120, color: '#795548' }
};

function createCharts() {
    // Prevent duplicate chart creation
    $('canvas').each(function () {
        Chart.getChart(this)?.destroy();
    });

    // Loop through the dictionary and create charts
    Object.entries(chartData).forEach(([id, data]) => createChart(id+"Chart", data.value, data.maxValue, data.color));
}


function showDetailChart(metric=null) {
    if(metric){
        currentMetric = metric;
    }

    $('.chart-container').removeClass('active');
    $(`#${currentMetric}ChartContainer`).addClass('active');

  
    updateDetailChartTitle();
    updateTimeRange(currentTimeRange);
}



function updateDetailChartTitle() {
    document.getElementById('detailChartTitle').textContent = titleMap[currentMetric] || 'Activity History';
}



function updateTimeRange(range) {
       
    if (range === 'weekly') {
        document.getElementById('monthlyBtn').classList.remove('active', 'btn-primary');
        document.getElementById('monthlyBtn').classList.add('btn-outline-primary');
        document.getElementById('weeklyBtn').classList.remove('btn-outline-primary');
        document.getElementById('weeklyBtn').classList.add('btn-primary', 'active');
    } else {
        document.getElementById('weeklyBtn').classList.remove('active', 'btn-primary');
        document.getElementById('weeklyBtn').classList.add('btn-outline-primary');
        document.getElementById('monthlyBtn').classList.remove('btn-outline-primary');
        document.getElementById('monthlyBtn').classList.add('btn-primary', 'active');
    }
    currentTimeRange = range;

    $('#fitnessChart').each(function () {
        Chart.getChart(this)?.destroy();
    });
    createDetailChart(
        'fitnessChart',                // ID of the canvas element
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],  // X-axis labels
        [20, 35, 50, 40, 60, 75, 90], // Y-axis values
        chartData[currentMetric].color                     // Bar color (green)
    );
}




function updateChart(chartId, value, maxValue) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error(`Canvas element with id '${chartId}' not found.`);
        return;
    }

    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
        chartInstance.data.datasets[0].data = [value, maxValue - value]; // Update data
        chartInstance.update(); // Refresh chart
    } else {
        console.warn(`No existing chart found for '${chartId}', creating a new one.`);
        createChart(chartId, value, maxValue, color);
    }
}

function syncData(){
    showAlert("Syncing data...", "info", 1000);
}
