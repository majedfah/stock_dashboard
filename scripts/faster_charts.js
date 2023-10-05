
let cache = {};
let timeoutId = null;
const DEBOUNCE_DELAY = 500; // 500ms delay

document.getElementById('stock-symbol').addEventListener('change', function() {
    let symbol = this.value;

    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
        // Check if the data is in the cache
        if (symbol in cache) {
            handleData(cache[symbol], symbol);
        } else {
            // Fetch the data and store it in the cache
            fetchData(symbol).then(data => {
                cache[symbol] = data;
                handleData(data, symbol);
            });
        }
    }, DEBOUNCE_DELAY);
});

function fetchData(symbol) {
    let apiKey = '000K24DJRNTQ09ZT';
    // let apiKey = 'V22X2VE3TYMV657P';

    // Define URLs
    // const stockPricesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
    const stockPricesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
    const incomeStatementUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`;
    const earningsUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`;

    // Fetch data in parallel
    return Promise.all([
        fetch(stockPricesUrl).then(response => response.json()),
        fetch(incomeStatementUrl).then(response => response.json()),
        fetch(earningsUrl).then(response => response.json())
    ]);
}

function handleData([stockPricesData, incomeStatementData1, earningsData], symbol) {
     // Check if data objects are not undefined
    if (!stockPricesData || !incomeStatementData1 || !earningsData) {
        console.error('One of the data objects is undefined:', { stockPricesData, incomeStatementData1, earningsData });
        return; // Exit the function if any data object is undefined
    }
    console.log('stockPricesData:', stockPricesData);
    console.log('incomeStatementData1:', incomeStatementData1);
    console.log('earningsData:', earningsData);


    // Check if 'Time Series (Daily)' property exists in stockPricesData
    if (!stockPricesData['Time Series (Daily)']) {
        console.error('Time Series (Daily) property is missing in stockPricesData:', stockPricesData);
        return; // Exit the function if 'Time Series (Daily)' property is missing
    }
    console.log(stockPricesData, incomeStatementData1, earningsData);

    // Handle the data...
    // This is where you would put the rest of your existing code that handles the fetched data.
    // Make sure to replace all instances of 'this.value' with 'symbol' in your existing code.
    // Handle stock prices
    const jsonData = Object.entries(stockPricesData['Time Series (Daily)']).map(([key, value]) => {
        const date = new Date(key).getTime();
        const price = parseFloat(value['4. close']);
                return [date, price];
            }).reverse();
        // Here you can put the chart code for the stock prices
        Highcharts.stockChart('container1', {
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
              tooltip:{
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b><br/>',
                valueDecimals: 2
              },
        
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
        // Handle margins 
        let quarters = incomeStatementData1.quarterlyReports.slice(0, 19).reverse();
        let grossMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.grossProfit / report.totalRevenue) * 100]);
        let operatingMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.operatingIncome / report.totalRevenue) * 100]);
        let profitMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.netIncome / report.totalRevenue) * 100]);
        // Here you can put the chart code for the income statement
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

        // Handle income statement
        // Handel bars 
        let quartersBars = incomeStatementData1.quarterlyReports.slice(0, 4).reverse();
        let categories = quartersBars.map(report => `${report.fiscalDateEnding.slice(0, 4)} Q${Math.floor((new Date(report.fiscalDateEnding).getMonth() + 3) / 3)}`);
        let revenues = quartersBars.map(report => report.totalRevenue / 1000000000);
        let grossProfits = quartersBars.map(report => report.grossProfit / 1000000000);
        let operatingIncomes = quartersBars.map(report => report.operatingIncome / 1000000000);
        // Here you can put the chart code for the income statement

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

        // Handle stacked bars
        const rawData = incomeStatementData1.quarterlyReports.slice(0, 4).reverse();
        const categories2 = rawData.map(report => report.fiscalDateEnding);
        const researchAndDevelopment = rawData.map(report => parseInt(report.researchAndDevelopment) / 1e9);
        const sgAndA = rawData.map(report => parseInt(report.sellingGeneralAndAdministrative) / 1e9);
        const operatingExpenses = rawData.map(report => parseInt(report.operatingExpenses) / 1e9);
        // stacked bar chart code 
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
                categories: categories2,
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


        // Handle EPS data
        const epsData = earningsData.quarterlyEarnings.map(earning => {
        const date = new Date(earning.fiscalDateEnding).getTime();
        const eps = parseFloat(earning.reportedEPS);
                return [date, eps];
            }).reverse();
        // Here you can put the chart code for the EPS data

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
        yAxis: {
            labels:{
                formatter: function(){
                    return "$" + this.value;
                }
            }
        },
        tooltip:{
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b><br/>',
            valueDecimals: 2
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
}
