// ============================================
// CHARTS & ANALYTICS MODULE
// ============================================

import { getCategoryColor, getMonthName } from './ui.js';
import { formatCurrency } from './firebase.js';

let charts = {
    expenseChart: null,
    comparisonChart: null,
    categoryChart: null,
    trendChart: null
};

/**
 * Initialize expense distribution chart (Doughnut)
 */
export function initExpenseChart(categoryData) {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts.expenseChart) {
        charts.expenseChart.destroy();
    }

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const backgroundColors = labels.map(label => getCategoryColor(label));

    charts.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(15, 23, 42, 0.8)',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true
                    },
                    onHover: (event, legendItem) => {
                        event.native.target.style.cursor = 'pointer';
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize monthly comparison chart (Bar)
 */
export function initComparisonChart(incomeData, expenseData, months) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts.comparisonChart) {
        charts.comparisonChart.destroy();
    }

    charts.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(16, 185, 129, 0.7)'
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(239, 68, 68, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: undefined,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize category distribution chart
 */
export function initCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts.categoryChart) {
        charts.categoryChart.destroy();
    }

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const backgroundColors = labels.map(label => getCategoryColor(label));

    charts.categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount Spent',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(15, 23, 42, 0.8)',
                borderWidth: 2,
                borderRadius: 6,
                hoverBorderWidth: 3
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Amount: ' + formatCurrency(context.parsed.x);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize trend chart
 */
export function initTrendChart(trendData) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts.trendChart) {
        charts.trendChart.destroy();
    }

    const labels = trendData.labels;
    const incomeData = trendData.income;
    const expenseData = trendData.expense;

    charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Process transactions for trend analysis
 */
export function processTrendData(transactions) {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const trendData = {
        labels: [],
        income: [],
        expense: []
    };

    for (let day = 1; day <= daysInMonth; day++) {
        trendData.labels.push(`Day ${day}`);
        trendData.income.push(0);
        trendData.expense.push(0);
    }

    transactions.forEach(t => {
        const date = new Date(t.date);
        const day = date.getDate() - 1;

        if (t.type === 'income') {
            trendData.income[day] += t.amount;
        } else {
            trendData.expense[day] += t.amount;
        }
    });

    return trendData;
}

/**
 * Destroy all charts
 */
export function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    charts = {
        expenseChart: null,
        comparisonChart: null,
        categoryChart: null,
        trendChart: null
    };
}

/**
 * Get chart colors
 */
export function getChartColors() {
    return {
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4',
        purple: '#8b5cf6',
        pink: '#ec4899',
        text: '#e2e8f0',
        secondary: '#cbd5e1'
    };
}
