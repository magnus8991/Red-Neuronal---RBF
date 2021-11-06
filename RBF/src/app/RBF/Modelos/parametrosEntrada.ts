import { Patron } from './patron';

export class ParametrosEntrada {
    encabezados: string[] = ['#', 'X1', 'X2', 'YD1'];
    numeroEntradas: any = 'N/A';
    numeroSalidas: any = 'N/A';
    numeroPatrones: any = 'N/A';
    error: boolean = false;
    patrones: Patron[] = [];
    valorMaximo: number = 0;
    valorMinimo: number = 0;

    constructor() {
        for (let i = 0; i < 100; i++) { this.patrones.push(new Patron(i + 1, ['N/A', 'N/A', 'N/A'])); }
    }
}
