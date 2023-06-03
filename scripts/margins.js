

document.getElementById('stock-symbol').addEventListener('change', function() {
    let symbol = this.value;

    fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${'000K24DJRNTQ09ZT'}`)
    .then(response => response.json())
    .then(data => {
        let quarters = data.quarterlyReports.slice(0, 20).reverse(); // Get the last 20 quarters (5 years)
        let grossMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.grossProfit / report.totalRevenue) * 100]);
        let operatingMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.operatingIncome / report.totalRevenue) * 100]);
        let profitMargins = quarters.map(report => [(new Date(report.fiscalDateEnding)).getTime(), (report.netIncome / report.totalRevenue) * 100]);

        createChart(grossMargins, operatingMargins, profitMargins);
    })
    .catch(error => console.error('Error:', error));

});



function createChart(grossMargins, operatingMargins, profitMargins) {
    Highcharts.stockChart('container3', {
        chart: {
            width:600,
            height:600,
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
}