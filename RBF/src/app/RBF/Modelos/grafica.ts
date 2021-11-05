import * as ApexCharts from 'apexcharts';

export class Grafica {
    chart: ApexCharts;

    constructor(grafica: HTMLElement, title: string, nombreSeries: any[], datos: any[], categories: any[]) {
        const options = {
            series: this.getSeries(nombreSeries, datos),
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: title,
                align: 'center'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: categories,
            }
        };
        this.chart = new ApexCharts(grafica, options);
        this.chart.render();
    }

    getSeries(nombreSeries: string[], datos: any[]): any[] {
        const series = [];
        for (let i = 0; i < nombreSeries.length; i++) {
            const serie = {
                name: nombreSeries[i],
                data: datos[i]
            };
            series.push(serie);
        }
        return series;
    }

    actualizarDatos(nombreSeries: any[], datos: any[]) {
        this.chart.updateSeries(this.getSeries(nombreSeries, datos));
    }

    actualizarDatosYCategorias(nombreSeries: any[], datos: any[], categorias: number) {
        const options = {
            series: this.getSeries(nombreSeries, datos),
            xaxis: {
                categories: this.getCategorias(categorias),
            }
        };
        this.chart?.updateOptions(options);
    }

    getCategorias(categorias: number): any[] {
        const listaCategorias = [];
        for (let i = 0; i < categorias; i++) {
            listaCategorias.push(i + 1);
        }
        return listaCategorias;
    }
}
