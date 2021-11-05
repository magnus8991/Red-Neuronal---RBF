import { Capa } from "./capa";

export class CapaIntermedia extends Capa {
    numeroNeuronas: any;

    constructor(numeroNeuronas: any, funcionActivacion: any) {
        super(funcionActivacion);
        this.numeroNeuronas = numeroNeuronas;
    }
}
