export class CentroRadial {
    valores: number[] = [];

    constructor(numeroEntradas, valorMaximo, valorMinimo) {
        this.valores = this.generarValoresRandom(numeroEntradas, valorMaximo, valorMinimo);
    }

    generarValoresRandom(numeroEntradas, valorMaximo, valorMinimo): number[] {
        const valores = [];
        for (let i = 0; i < numeroEntradas; i++) {
            valores.push(Math.random() * (valorMaximo - (valorMinimo)) + (valorMinimo));
        }
        return valores;
    }
}