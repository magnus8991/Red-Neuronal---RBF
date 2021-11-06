import { Injectable } from '@angular/core';
import { MatrizPesosSinapticos } from '../Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from '../Modelos/parametrosEntrada';
import { Patron } from '../Modelos/patron';
import { Umbrales } from '../Modelos/umbrales';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {

  constructor() { }

  obtenerPesosYUmbralesNuevos(parametrosEntrada: ParametrosEntrada, pesosYUmbrales, erroresLineales: number[], entradas: number[]): any {
    for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) {
      let indiceEntradas = 0;
      pesosYUmbrales.pesosOptimos.filas.forEach(fila => {
        const pesoNuevo = fila.columnas[i] + (erroresLineales[i] * entradas[indiceEntradas]) + (
          (fila.columnas[i] - pesosYUmbrales.pesosAnteriores.filas[indiceEntradas].columnas[i]));
        pesosYUmbrales.pesosAnteriores.filas[indiceEntradas].columnas[i] = fila.columnas[i];
        fila.columnas[i] = pesoNuevo;
        indiceEntradas += 1;
      });
      const umbralNuevo = pesosYUmbrales.umbrales.valores[i] + (erroresLineales[i] * entradas[0]) + (
        (pesosYUmbrales.umbrales.valores[i] - pesosYUmbrales.umbralesAnteriores.valores[i]));
      pesosYUmbrales.umbralesAnteriores.valores[i] = pesosYUmbrales.umbrales.valores[i];
      pesosYUmbrales.umbrales.valores[i] = umbralNuevo;
    }
    return {
      pesosOptimos: pesosYUmbrales.pesosOptimos, umbrales: pesosYUmbrales.umbrales,
      pesosAnteriores: pesosYUmbrales.pesosAnteriores, umbralesAnteriores: pesosYUmbrales.umbralesAnteriores
    };
  }

  calcularErroresLineales(parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales,
    patron: Patron): any {
    const erroresLineales: number[] = [];
    const salidasRed: number[] = [];
    for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) {
      const salidaDeseada = patron.valores[parametrosEntrada.numeroEntradas + i];
      let indicePatrones = 0;
      let salidaSoma = 0;
      pesosSinapticos.filas.forEach(fila => {
        salidaSoma += patron.valores[indicePatrones] * fila.columnas[i];
        indicePatrones += 1;
      });
      salidaSoma = salidaSoma - umbrales.valores[i];
      const salidaRed = this.funcionBaseRadial(salidaSoma);
      salidasRed.push(salidaRed);
      erroresLineales.push(salidaDeseada - salidaRed);
    }
    return { erroresLineales: erroresLineales, salidas: salidasRed };
  }

  funcionBaseRadial(theta: number): number {
    return Math.pow(theta,2) * Math.log(theta);
  }

  errorPatron(erroresLineales: number[], numeroSalidas: number) {
    return (erroresLineales.reduce((sum, current) => sum + Math.abs(current), 0)) / numeroSalidas;
  }

  errorRMS(erroresPatrones: number[]) {
    return (erroresPatrones.reduce((sum, current) => sum + current, 0)) / erroresPatrones.length;
  }

  getSalidasDeseadas(patrones: Patron[], numeroEntradas: number, numeroSalidas: number): any[] {
    const listaSalidas: any[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      const salidas: number[] = [];
      patrones.forEach(patron => {
        salidas.push(patron.valores[numeroEntradas + i]);
      });
      listaSalidas.push(salidas);
    }
    return listaSalidas;
  }

  getInitSalidasRed(numeroSalidas: number): any[] {
    const listaSalidas: any[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      const salidas: number[] = [];
      listaSalidas.push(salidas);
    }
    return listaSalidas;
  }

  clone(obj: any) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = this.clone(obj[key]);
    }

    return temp;
  }
}
