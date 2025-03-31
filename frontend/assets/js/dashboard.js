
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
                cutout: '80%',
                rotation: -90,
                circumference: 180,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    } else {
        console.error(`Canvas element with id '${chartId}' not found.`);
    }
}


document.addEventListener('DOMContentLoaded', function () {
        if(document.getElementById("dashboard")){
            console.log("set");
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