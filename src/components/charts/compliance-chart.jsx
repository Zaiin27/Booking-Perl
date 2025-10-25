import React from "react"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js"
import LineChartSkeleton from "../skeltons/LineChartSkeleton"

// Register Chart.js components once at module scope to avoid duplicate registrations
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const ComplianceChart = React.memo(
    ({ title = "Key Compliances Metrics", data: customData, options: customOptions }) => {
        // Data is now expected via props. Keep a local loading flag if custom options call for it.
        const isLoading = false

        // Default data if not provided
        const defaultMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]

        const defaultData = {
            labels: defaultMonths,
            datasets: [
                {
                    label: "Document Expirations",
                    data: Array(defaultMonths.length).fill(0),
                    borderColor: "rgba(150, 150, 150, 0.8)",
                    backgroundColor: "rgba(150, 150, 150, 0.1)",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0,
                },
                {
                    label: "Violations",
                    data: Array(defaultMonths.length).fill(0),
                    borderColor: "rgba(100, 200, 240, 0.8)",
                    backgroundColor: "rgba(100, 200, 240, 0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                },
            ],
        }

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,

                    border: {
                        display: false
                    },
                    ticks: {
                        stepSize: 1,
                        callback: (value) => + value,
                        font: {
                            size: 12,
                            family: "'Nunito', sans-serif"
                        },
                        color: '#666666'
                    },
                    grid: {
                        display: false,
                    },
                },
                x: {
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Nunito', sans-serif"
                        },
                        color: '#666666'
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 1
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#191D31',
                    bodyColor: '#666666',
                    titleFont: {
                        size: 12,
                        weight: 'bold',
                        family: "'Nunito', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Nunito', sans-serif"
                    },
                    padding: 12,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    displayColors: true,
                    callbacks: {
                        title: (tooltipItems) => tooltipItems[0].label,
                        label: (context) => `${context.dataset.label}: ${context.formattedValue}`
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }

        const Dynamic = customData || defaultData
        const chartOptions = customOptions || defaultOptions

        return (
            <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="flex md:flex-row flex-col gap-3 justify-between md:items-center mb-4">
                    <h3 className="text-lg font-semibold font-nunito text-primary">{title}</h3>
                    <div className="flex  items-center justify-end gap-4">
                        <div className="flex items-center gap-1">
                            <div className="">
                                <span className="h-[0.625rem] w-[0.625rem] flex rounded-full bg-gray-800"></span>
                            </div>
                            <span className="text-xs text-gray">Document Expirations</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="">
                                <span className="h-[0.625rem] w-[0.625rem] flex rounded-full bg-secondary"></span>
                            </div>
                            <span className="text-xs text-gray">Violations</span>
                        </div>
                    </div>
                </div>
                <div className="h-64">
                    {isLoading ? <>
                        <LineChartSkeleton />
                    </> : <>
                        <Line data={Dynamic} options={chartOptions} redraw datasetIdKey="label" />
                    </>}

                </div>
            </div>
        )
    },
)

ComplianceChart.displayName = "ComplianceChart"

export default ComplianceChart
