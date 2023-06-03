
document.getElementById('stock-symbol').addEventListener('change', function() {
    let symbol = this.value;
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=000K24DJRNTQ09ZT`)
    .then(response => response.json())
    .then(data => {
      if (!data['Time Series (Daily)']) {
        console.error('Failed to fetch data from Alpha Vantage API:', data);
        return;
      }
  
      const jsonData = Object.entries(data['Time Series (Daily)']).map(([key, value]) => {
        const date = new Date(key).getTime();
        const price = parseFloat(value['4. close']);
        return [date, price];
      }).reverse(); // Alpha Vantage returns data in reverse chronological order, so we need to reverse it
  
      // Now you can create the chart with the fetched data...
      const chart = Highcharts.stockChart('container1', {
        // ... rest of the chart configuration remains the same
                // ... rest of the chart configuration remains the same
                chart: {
                    width:600,
                    height:600,
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
    });
  });
  