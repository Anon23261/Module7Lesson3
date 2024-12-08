// API Configuration
const API_BASE_URL = '';  // Use relative paths

// DOM Elements
const forms = {
    email: document.getElementById('emailForm'),
    number: document.getElementById('numberForm'),
    date: document.getElementById('dateForm'),
    range: document.getElementById('rangeForm'),
    color: document.getElementById('colorForm')
};

const navButtons = document.querySelectorAll('.nav-btn');
const formSections = document.querySelectorAll('.form-section');
const notification = document.getElementById('notification');
const notificationMessage = notification.querySelector('.notification-message');

// Charts
let charts = {};

// Charts Configuration
const chartColors = [
    '#6366f1', '#4f46e5', '#22c55e', '#eab308', '#ef4444',
    '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6', '#f97316'
];

// Initialize Charts
function initializeCharts() {
    const chartConfigs = {
        email: {
            type: 'pie',
            data: {
                labels: ['Personal', 'Work', 'Other'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: chartColors.slice(0, 3)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Email Types Distribution',
                        color: '#1e293b'
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: '#1e293b' }
                    }
                }
            }
        },
        number: {
            type: 'bar',
            data: {
                labels: ['0-25', '26-50', '51-75', '76-100'],
                datasets: [{
                    label: 'Submissions',
                    data: [0, 0, 0, 0],
                    backgroundColor: chartColors[0]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Number Distribution',
                        color: '#1e293b'
                    },
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { color: '#1e293b' }
                    },
                    x: {
                        ticks: { color: '#1e293b' }
                    }
                }
            }
        },
        date: {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions',
                    data: [],
                    borderColor: chartColors[0],
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Submissions Over Time',
                        color: '#1e293b'
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { color: '#1e293b' }
                    },
                    x: {
                        ticks: { color: '#1e293b' }
                    }
                }
            }
        },
        range: {
            type: 'bar',
            data: {
                labels: ['0-25', '26-50', '51-75', '76-100'],
                datasets: [{
                    label: 'Values',
                    data: [0, 0, 0, 0],
                    backgroundColor: chartColors[0]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Range Distribution',
                        color: '#1e293b'
                    },
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { color: '#1e293b' }
                    },
                    x: {
                        ticks: { color: '#1e293b' }
                    }
                }
            }
        },
        color: {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Color Distribution',
                        color: '#1e293b'
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: '#1e293b' }
                    }
                }
            }
        }
    };

    // Initialize all charts
    ['email', 'number', 'date', 'range', 'color'].forEach(type => {
        const canvas = document.getElementById(`${type}Chart`);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            charts[type] = new Chart(ctx, chartConfigs[type]);
        }
    });
}

// Update Charts with New Data
function updateChartsWithData(data) {
    // Update statistics
    document.getElementById('emailStats').textContent = data.emails.length;
    document.getElementById('numberStats').textContent = data.numbers.length;
    document.getElementById('dateStats').textContent = data.dates.length;
    document.getElementById('rangeStats').textContent = data.ranges.length;
    document.getElementById('colorStats').textContent = data.colors.length;

    // Update email chart
    const emailTypes = {'personal': 0, 'work': 0, 'other': 0};
    data.emails.forEach(entry => emailTypes[entry.type]++);
    charts.email.data.datasets[0].data = Object.values(emailTypes);
    charts.email.update();

    // Update number chart
    const numberRanges = [0, 0, 0, 0]; // 0-25, 26-50, 51-75, 76-100
    data.numbers.forEach(entry => {
        const value = parseInt(entry.number);
        const index = Math.floor(value / 25);
        if (index >= 0 && index < 4) numberRanges[index]++;
    });
    charts.number.data.datasets[0].data = numberRanges;
    charts.number.update();

    // Update date chart
    const dateLabels = [...new Set(data.dates.map(entry => 
        new Date(entry.date).toLocaleDateString()
    ))].sort();
    const dateCounts = dateLabels.map(label => 
        data.dates.filter(entry => 
            new Date(entry.date).toLocaleDateString() === label
        ).length
    );
    charts.date.data.labels = dateLabels;
    charts.date.data.datasets[0].data = dateCounts;
    charts.date.update();

    // Update range chart
    const rangeRanges = [0, 0, 0, 0]; // 0-25, 26-50, 51-75, 76-100
    data.ranges.forEach(entry => {
        const value = parseInt(entry.range);
        const index = Math.floor(value / 25);
        if (index >= 0 && index < 4) rangeRanges[index]++;
    });
    charts.range.data.datasets[0].data = rangeRanges;
    charts.range.update();

    // Update color chart
    const uniqueColors = [...new Set(data.colors.map(entry => entry.color))];
    const colorCounts = uniqueColors.map(color => 
        data.colors.filter(entry => entry.color === color).length
    );
    charts.color.data.labels = uniqueColors;
    charts.color.data.datasets[0].data = colorCounts;
    charts.color.data.datasets[0].backgroundColor = uniqueColors;
    charts.color.update();
}

// Form Submission Handlers
async function handleFormSubmit(formType, data) {
    try {
        const response = await fetch(`/api/submit/${formType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('success', result.message);
            // Update charts with new data
            if (result.data) {
                updateChartsWithData(result.data);
            }
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error(`Error submitting ${formType}:`, error);
        showNotification('error', `Failed to submit ${formType}: ${error.message}`);
    }
}

// Form Event Listeners
forms.email.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        email: e.target.email.value,
        email_type: e.target['email-type'].value
    };
    await handleFormSubmit('email', formData);
    e.target.reset();
});

forms.number.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        number: e.target.number.value
    };
    await handleFormSubmit('number', formData);
    e.target.reset();
});

forms.date.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        date: e.target.date.value
    };
    await handleFormSubmit('date', formData);
    e.target.reset();
});

forms.range.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        range: e.target.range.value
    };
    await handleFormSubmit('range', formData);
    e.target.reset();
});

forms.color.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        color: e.target.color.value
    };
    await handleFormSubmit('color', formData);
    e.target.reset();
});

// Load Initial Data
async function loadInitialData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateChartsWithData(data);
    } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('error', 'Failed to load initial data');
    }
}

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.dataset.section;
        
        navButtons.forEach(btn => btn.classList.remove('active'));
        formSections.forEach(section => section.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${targetSection}-section`).classList.add('active');
    });
});

// Number Input Enhancement
const quantity = document.getElementById('quantity');
const quantityRange = document.getElementById('quantity-range');
const numberBtns = document.querySelectorAll('.number-btn');

if (quantity && quantityRange) {
    // Sync number input with range
    quantity.addEventListener('input', () => {
        quantityRange.value = quantity.value;
    });

    quantityRange.addEventListener('input', () => {
        quantity.value = quantityRange.value;
    });

    // Number buttons
    numberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const currentValue = parseInt(quantity.value) || 0;
            
            if (action === 'increase') {
                quantity.value = Math.min(currentValue + 1, 100);
            } else {
                quantity.value = Math.max(currentValue - 1, 0);
            }
            
            quantityRange.value = quantity.value;
        });
    });
}

// Range Input Enhancement
const range = document.getElementById('range');
const rangeValue = document.getElementById('rangeValue');
const rangeFeedback = document.querySelector('.range-feedback .feedback-text');

if (range && rangeValue) {
    const updateRangeFeedback = (value) => {
        rangeValue.textContent = value;
        
        const feedbackText = value <= 3 ? 'Poor' :
                           value <= 5 ? 'Average' :
                           value <= 8 ? 'Good' : 'Excellent';
        
        rangeFeedback.textContent = feedbackText;
    };

    range.addEventListener('input', () => updateRangeFeedback(range.value));
}

// Color Input Enhancement
const colorInput = document.getElementById('color');
const colorPreview = document.getElementById('colorPreview');
const colorPresets = document.querySelectorAll('.color-preset');
const hexValue = document.querySelector('.hex-value');
const rgbValue = document.querySelector('.rgb-value');

if (colorInput && colorPreview) {
    const updateColorValues = (color) => {
        colorPreview.style.backgroundColor = color;
        hexValue.textContent = `HEX: ${color.toUpperCase()}`;
        
        // Convert HEX to RGB
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        rgbValue.textContent = `RGB: ${r}, ${g}, ${b}`;
    };

    colorInput.addEventListener('input', () => updateColorValues(colorInput.value));
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            colorInput.value = color;
            updateColorValues(color);
        });
    });
}

// Statistics Update
async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        // Update stats values
        Object.keys(stats).forEach(type => {
            const statsElement = document.getElementById(`${type}Stats`);
            if (statsElement) {
                statsElement.textContent = stats[type];
            }
        });
        
        // Update charts
        Object.keys(charts).forEach(type => {
            if (stats[type]) {
                const chartData = charts[type].data;
                chartData.labels = Object.keys(stats[type]);
                chartData.datasets[0].data = Object.values(stats[type]);
                charts[type].update();
            }
        });
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Notification System
function showNotification(type, message) {
    notification.className = 'notification';
    notification.classList.add(type);
    notificationMessage.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initializeCharts();
    await loadInitialData();
    updateStats();
});

// Real-time form validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('input', () => {
        const validationFeedback = emailInput.parentElement.querySelector('.validation-feedback');
        if (emailInput.validity.valid) {
            validationFeedback.textContent = '✓ Valid email address';
            validationFeedback.className = 'validation-feedback success';
        } else {
            validationFeedback.textContent = '✗ Please enter a valid email address';
            validationFeedback.className = 'validation-feedback error';
        }
    });
}

// Periodic stats update
setInterval(updateStats, 30000); // Update every 30 seconds
