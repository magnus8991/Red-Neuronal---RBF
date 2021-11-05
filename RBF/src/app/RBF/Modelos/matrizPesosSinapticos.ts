import { Fila } from './fila';

export class MatrizPesosSinapticos {
    encabezados: string[] = ['#', '1', '2', '3'];
    filas: Fila[] = [];

    constructor() {
        for (let i = 1; i < 6; i++) {
            this.filas.push(new Fila(i, ['N/A', 'N/A', 'N/A']));
        }
    }
}
