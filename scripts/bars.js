
document.getElementById('stock-symbol').addEventListener('change', function() {
    let symbol = this.value;
    fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${'000K24DJRNTQ09ZT'}`)
        .then(response => response.json())
        .then(data => {
            let quarters = data.quarterlyReports.slice(0, 4).reverse();
            let categories = quarters.map(report => `${report.fiscalDateEnding.slice(0, 4)} Q${Math.floor((new Date(report.fiscalDateEnding).getMonth() + 3) / 3)}`);
            let revenues = quarters.map(report => report.totalRevenue / 1000000000);
            let grossProfits = quarters.map(report => report.grossProfit / 1000000000);
            let operatingIncomes = quarters.map(report => report.operatingIncome / 1000000000);

            createChart(symbol, categories, revenues, grossProfits, operatingIncomes);
        })
        .catch(error => console.error('Error:', error));
});

function createChart(symbol, categories, revenues, grossProfits, operatingIncomes) {
    Highcharts.chart('container2', {
        chart: {
            width:600,
            height:600,
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
}