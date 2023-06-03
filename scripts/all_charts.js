document.getElementById('stock-symbol').addEventListener('change', function() {
    let symbol = this.value;
    let apiKey = '000K24DJRNTQ09ZT';

    // Fetch stock prices
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // Handle stock prices
        const jsonData = Object.entries(data['Time Series (Daily)']).map(([key, value]) => {
        const date = new Date(key).getTime();
        const price = parseFloat(value['4. close']);
            return [date, price];
        }).reverse();

        const chart = Highcharts.stockChart('container1', {
            chart: {
                style: {
                  fontFamily: 'Roboto'
                }
              },
        
              title: {
                useHTML: true,
                text: `${symbol} Stock Price`
              },
        
              rangeSelector: {
                selected: 1
              },
        
              series: [{
                name: `${symbol} stock price`,
                data: jsonData,
                type: 'area',
                color: 'rgba(19,97,3,255)',
                fillColor: 'rgba(206,229,202,255)',
                threshold: null,
                tooltip: {
                  valueDecimals: 2
                }
              }],
        
              navigator: {
                series: {
                  color: 'rgba(170,170,170,255)',
                  fillColor: 'rgba(170,170,170,255)'
                },
                maskFill: 'rgba(237,236,236,255)',
                xAxis: {
                  labels: {
                    y: 23,
                    style: {
                      fontWeight: 'bold'
                    }
                  },
                  title: {
                    text: 'Date Range',
                    style: {
                      fontWeight: 'bold'
                    }
                  }
                }
              },
        
              responsive: {
                rules: [{
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    chart: {
                      height: 300
                    },
                    subtitle: {
                      text: null
                    },
                    navigator: {
                      enabled: false
                    }
                  }
                }]
              },
        
              credits: {
                enabled: true,
                text: 'Made by Majed',
                href: '',
                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    x: -30,
                    y:-560
                },
                style: {
                    fontSize: '14px',
                    color: '#333'
                }
              }
        });

        // Fetch income statement
        return fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`);
    })
    .then(response => response.json())
    .then(data => {
        // Handle margins
        let quarters = data.quarterlyReports.slice(0, 20).reverse();
        let grossMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.grossProfit / report.totalRevenue) * 100]);
        let operatingMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.operatingIncome / report.totalRevenue) * 100]);
        let profitMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.netIncome / report.totalRevenue) * 100]);

        Highcharts.stockChart('container3', {
            // ... rest of the chart configuration remains the same
            chart: {
                type: 'line',
                style: {
                    fontFamily: 'Roboto'
                }
            },
            navigator: {
                series: {
                    fillColor: 'rgba(170,170,170,255)'  // Change this to the color you want
                }
            },
            title: {
                useHTML: true,
                text: `${symbol} Margins`
            },
            xAxis: {
                type: 'datetime',
                opposite: false // Move the x-axis to the left
            },
            yAxis: {
                title: {
                    text: 'Margin (%)'
                },
                labels: {
                    formatter: function () {
                        return this.value + '%';
                    }
                },
                opposite: false // Move the y-axis to the left
            },
            tooltip: {
                valueDecimals: 1,
                valueSuffix: '%'
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                layout: 'horizontal',
                enabled:true
            },
            series: [{
                name: 'Gross Margin',
                data: grossMargins,
                color: 'rgba(198,92,89,255)',
                lineWidth: 3 // Make the line thicker
            }, {
                name: 'Operating Margin',
                data: operatingMargins,
                color: 'rgba(71,121,178,255)',
                lineWidth: 3 // Make the line thicker
            }, {
                name: 'Profit Margin',
                data: profitMargins,
                color: 'rgba(227,176,95,255)',
                lineWidth: 3 // Make the line thicker
            }],
            credits: {
                enabled: true,
                text: 'Made by Majed',
                href: '',
                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    x: -30,
                    y:-560
                },
                style: {
                    fontSize: '14px',
                    color: '#333'
                }
            },
            rangeSelector: { // Customize the range selector buttons
                buttons: [{
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 1
            }
        });

        // Handle bars
        let quartersBars = data.quarterlyReports.slice(0, 4).reverse();
        let categories = quartersBars.map(report => `${report.fiscalDateEnding.slice(0, 4)} Q${Math.floor((new Date(report.fiscalDateEnding).getMonth() + 3) / 3)}`);
        let revenues = quartersBars.map(report => report.totalRevenue / 1000000000);
        let grossProfits = quartersBars.map(report => report.grossProfit / 1000000000);
        let operatingIncomes = quartersBars.map(report => report.operatingIncome / 1000000000);

        Highcharts.chart('container2', {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Roboto'
                }
            },
            title: {
                useHTML: true,
                text: ` ${symbol} Indicators`
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Amount (in Billions)'
                },
                labels: {
                    formatter: function () {
                        return '$' + this.value + 'B';
                    }
                }
            },
            plotOptions: {
                series: {
                    borderRadiusTopLeft: '10%',
                    borderRadiusTopRight: '10%',
                }
            },
            tooltip: {
                valueDecimals: 3,
                valuePrefix: '$',
                valueSuffix: 'B'
            },
            legend: {
                align: 'center',
                verticalAlign: 'top'
            },
            series: [{
                name: 'Revenue',
                data: revenues,
                color: 'rgba(117,181,103,255)'
            }, {
                name: 'Gross Profit ',
                data: grossProfits,
                color: 'rgba(227,176,95,255)'
            }, {
                name: 'Operating Income',
                data: operatingIncomes,
                color: 'rgba(71,121,178,255)'
            }],
            credits: {
                enabled: true,
                text: 'Made by Majed',
                href: '',
                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    x: -40,
                    y: -560
                },
                style: {
                    fontSize: '14px',
                    color: '#333'
                }
            }
        });
        // Fetch income statement for operating expenses
        return fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`);
    })
    .then(response => response.json())
    .then(data => {
        // Prepare data for Highcharts
        const rawData = data.quarterlyReports.slice(0, 4).reverse();
        const categories = rawData.map(report => report.fiscalDateEnding);
        const researchAndDevelopment = rawData.map(report => parseInt(report.researchAndDevelopment) / 1e9);
        const sgAndA = rawData.map(report => parseInt(report.sellingGeneralAndAdministrative) / 1e9);
        const operatingExpenses = rawData.map(report => parseInt(report.operatingExpenses) / 1e9);


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            },
            credits: {
                enabled: true,
                text: 'Made by Majed',
                href: '',
                position: {
                align: 'right',
                verticalAlign: 'bottom',
                x: -40,
                y: -560
                },
                style: {
                    fontSize: '14px',
                    color: '#333'
                }
            }
        });

        Highcharts.chart('container4', {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Roboto'
                }
            },
            title: {
                useHTML: true,
                text: `${symbol} Expenses`
            },
            xAxis: {
                categories: categories,
                crosshair: true,
                labels: {
                    style: {
                        fontWeight: 'bold' // Make x-axis labels bold
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Expenses (in Billions USD)'
                },
                labels: {
                    formatter: function () {
                        return '$' + this.value + 'B';
                    }
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'black'
                    },
                    formatter: function () {
                        return '$' + Highcharts.numberFormat(this.total, 2) + 'B';
                    }
                }
            },
            tooltip: {
                pointFormat: '<span>{series.name}</span>: <b>$' + '{point.y:.2f}B</b> (total)<br/>', // Add $ and B to the hover information
                shared: true
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                floating: false,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
                shadow: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointPadding: 0.2, // Decrease bar width
                    groupPadding: 0.2, // Decrease bar width
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return '$' + Highcharts.numberFormat(this.y, 2) + 'B';
                        }
                    }
                }
            },
            series: [{
                name: 'Research and Development',
                data: researchAndDevelopment,
                color:'rgba(198,92,89,255)',
            }, {
                name: 'Selling, General and Administrative',
                data: sgAndA,
                color:'rgba(227,176,95,255)',
            },
            {
                name: 'Operating Expenses',
                data: operatingExpenses,
                color:'rgba(117,181,103,255)',
            }
        ]
        });
    })
    .catch(error => console.error('Error:', error));

    // Fetch EPS data
fetch(`https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Handle EPS data
    const epsData = data.quarterlyEarnings.map(earning => {
        const date = new Date(earning.fiscalDateEnding).getTime();
        const eps = parseFloat(earning.reportedEPS);
        return [date, eps];
    }).reverse();

    Highcharts.stockChart('container5', {
        chart: {
            style: {
              fontFamily: 'Roboto'
            }
        },

        title: {
            useHTML: true,
            text: `${symbol} Earnings Per Share (EPS)`
        },
        rangeSelector: {
            buttons: [{
                type: 'ytd',
                text: 'YTD'
            }, {
                type: 'all',
                text: 'All'
            }],
            selected: 1 // This selects the 'YTD' button by default
        },

        series: [{
            name: `${symbol} EPS`,
            data: epsData,
            type: 'line',
            lineWidth:3,
            color: 'rgba(19,97,3,255)',
            tooltip: {
              valueDecimals: 2
            }
        }],

        navigator: {
            series: {
              color: 'rgba(170,170,170,255)',
              fillColor: 'rgba(170,170,170,255)'
            },
            maskFill: 'rgba(237,236,236,255)',
            xAxis: {
              labels: {
                y: 23,
                style: {
                  fontWeight: 'bold'
                }
              },
              title: {
                text: 'Date Range',
                style: {
                  fontWeight: 'bold'
                }
              }
            }
        },

        responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                chart: {
                  height: 300
                },
                subtitle: {
                  text: null
                },
                navigator: {
                  enabled: false
                }
              }
            }]
        },

        credits: {
            enabled: true,
            text: 'Made by Majed',
            href: '',
            position: {
                align: 'right',
                verticalAlign: 'bottom',
                x: -30,
                y:-560
            },
            style: {
                fontSize: '14px',
                color: '#333'
            }
        }
    });
})
.catch(error => console.error('Error:', error));
// Fetch income statement
fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`)
.then(response => response.json())
.then(data => {
    // Handle revenue data
    let quarters = data.quarterlyReports.slice(0, 20).reverse();
    let revenues = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), report.totalRevenue / 1e9]);

    Highcharts.stockChart('container6', {
        chart: {
            style: {
                fontFamily: 'Roboto'
            }
        },

        title: {
            useHTML: true,
            text: `${symbol} Revenue Trends`
        },

        rangeSelector: {
            buttons: [{
                type: 'ytd',
                text: 'YTD'
            }, {
                type: 'all',
                text: 'All'
            }],
            selected: 1 // This selects the 'YTD' button by default
        },

        series: [{
            name: `${symbol} Revenue`,
            data: revenues,
            type: 'line',
            lineWidth:3,
            color: 'rgba(19,97,3,255)',
            tooltip: {
                valueDecimals: 2
            }
        }],

        navigator: {
            series: {
                color: 'rgba(170,170,170,255)',
                fillColor: 'rgba(170,170,170,255)'
            },
            maskFill: 'rgba(237,236,236,255)',
            xAxis: {
                labels: {
                    y: 23,
                    style: {
                        fontWeight: 'bold'
                    }
                },
                title: {
                    text: 'Date Range',
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        },
        tooltip: {
            valueDecimals: 3,
            valuePrefix: '$',
            valueSuffix: 'B'
        },

        credits: {
            enabled: true,
            text: 'Made by Majed',
            href: '',
            position: {
                align: 'right',
                verticalAlign: 'bottom',
                x: -30,
                y:-560
            },
            style: {
                fontSize: '14px',
                color: '#333'
            }
        }
    });
})
.catch(error => console.error('Error:', error));
});
