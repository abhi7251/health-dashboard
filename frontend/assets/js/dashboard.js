
function createSemiCircleChart(chartId, value, maxValue, color) {
    const canvas = document.getElementById(chartId);
   
    if (canvas) {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, maxValue - value],
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
    } else {
        console.error(`Canvas element with id '${chartId}' not found.`);
    }
}


let currentMetric = 'steps';
let currentTimeRange = 'weekly';

function showDetailChart(metric) {
    $('.chart-container').removeClass('active');
    $(event.target.closest('.chart-container')).addClass('active'); // Finds the nearest container

    currentMetric = metric;
    updateDetailChartTitle();
    updateChart();
}


function updateTimeRange(range) {
    document.getElementById('weeklyBtn').classList.remove('active', 'btn-primary');
    document.getElementById('monthlyBtn').classList.remove('active', 'btn-primary');
    document.getElementById('weeklyBtn').classList.add('btn-outline-primary');
    document.getElementById('monthlyBtn').classList.add('btn-outline-primary');
    
    if (range === 'weekly') {
        document.getElementById('weeklyBtn').classList.remove('btn-outline-primary');
        document.getElementById('weeklyBtn').classList.add('btn-primary', 'active');
    } else {
        document.getElementById('monthlyBtn').classList.remove('btn-outline-primary');
        document.getElementById('monthlyBtn').classList.add('btn-primary', 'active');
    }
    currentTimeRange = range;
    updateChart();
}

function updateDetailChartTitle() {
    const titleMap = {
        'steps': 'Steps History',
        'calories': 'Calories Burned History',
        'heartRate': 'Heart Rate History',
        'water': 'Water Intake History',
        'sleep': 'Sleep History',
        'weight': 'Weight History'
    };
    document.getElementById('detailChartTitle').textContent = titleMap[currentMetric] || 'Activity History';
}

function updateChart() {
    console.log(`Updating chart for ${currentMetric} with ${currentTimeRange} time range`);
}

$(document).ready(function () {
    const observer = new MutationObserver(() => {
        if ($("#dashboard").length) {
            createCharts();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function createCharts() {
        // Prevent duplicate chart creation by clearing previous ones
        $('canvas').each(function () {
            const chartInstance = Chart.getChart(this);
            if (chartInstance) {
                chartInstance.destroy();
            }
        });

        createSemiCircleChart('stepsChart', 4500, 10000, '#4caf50');
        createSemiCircleChart('caloriesChart', 1200, 2500, '#ff9800');
        createSemiCircleChart('heartRateChart', 75, 200, '#f44336');
        createSemiCircleChart('waterChart', 1.5, 3, '#2196f3');
        createSemiCircleChart('sleepChart', 6, 8, '#9c27b0');
        createSemiCircleChart('weightChart', 70, 100, '#795548');
    }
});



function syncData(){
    showAlert("Syncing data...", "info", 1000);
}