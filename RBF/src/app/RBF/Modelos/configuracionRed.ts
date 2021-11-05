import { CapaIntermedia } from "./capaIntermedia";
import { CapaSalida } from "./capaSalida";

export class ConfiguracionRed {
    numeroCapasIntermedias: any;
    capasIntermedias: CapaIntermedia[];
    capaSalida: CapaSalida;

    constructor(numeroCapasIntermedias, capasIntermedias: CapaIntermedia[], capaSalida: CapaSalida) {
        this.numeroCapasIntermedias = numeroCapasIntermedias;
        this.capasIntermedias = capasIntermedias;
        this.capaSalida = capaSalida;
    }

    funcionSigmoide(salidaSoma) {
        return 1 / (1 + Math.exp(-salidaSoma));
    }

    funcionGausiana(salidaSoma) {
        return Math.exp(Math.pow(-salidaSoma,2));
    }

    funcionTanhHyp(salidaSoma) {
        return (2 / (1 + Math.exp(-2*salidaSoma))) - 1;
    }

    funcionLineal(salidaSoma) {
        return salidaSoma;
    }
}