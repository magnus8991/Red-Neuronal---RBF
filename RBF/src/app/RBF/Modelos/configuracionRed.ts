import { CentroRadial } from "./centroRadial";

export class ConfiguracionRed {
    numeroCentrosRadiales: number;
    numeroEntradas: number;
    valorMaximo: number;
    valorMinimo: number;
    centrosRadiales: CentroRadial[] = [];

    constructor(numeroCentrosRadiales, numeroEntradas, valorMaximo, valorMinimo) {
        this.numeroCentrosRadiales = numeroCentrosRadiales;
        this.numeroEntradas = numeroEntradas;
        this.valorMaximo = valorMaximo;
        this.valorMinimo = valorMinimo;
        this.generarCentroRadiales();
    }

    generarCentroRadiales() {
        for (let i = 0; i < this.numeroCentrosRadiales; i++)
            this.centrosRadiales.push(new CentroRadial(this.numeroEntradas, this.valorMaximo, this.valorMinimo));
    }
}