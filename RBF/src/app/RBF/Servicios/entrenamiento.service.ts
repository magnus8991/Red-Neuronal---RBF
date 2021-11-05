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

  obtenerPesosYUmbralesNuevos(parametrosEntrada: ParametrosEntrada, pesosYUmbrales, rataAprendizaje: number, rataDinamica: number,
    erroresLineales: number[], entradas: number[], checkDelta: boolean): any {
    for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) {
      let indiceEntradas = 0;
      pesosYUmbrales.pesosOptimos.filas.forEach(fila => {
        const pesoNuevo = fila.columnas[i] + (rataAprendizaje * erroresLineales[i] * entradas[indiceEntradas]) + (checkDelta ? 0 :
          rataDinamica * (fila.columnas[i] - pesosYUmbrales.pesosAnteriores.filas[indiceEntradas].columnas[i]));
        pesosYUmbrales.pesosAnteriores.filas[indiceEntradas].columnas[i] = fila.columnas[i];
        fila.columnas[i] = pesoNuevo;
        indiceEntradas += 1;
      });
      const umbralNuevo = pesosYUmbrales.umbrales.valores[i] + (rataAprendizaje * erroresLineales[i] * entradas[0]) + (checkDelta ? 0 :
        rataDinamica * (pesosYUmbrales.umbrales.valores[i] - pesosYUmbrales.umbralesAnteriores.valores[i]));
      pesosYUmbrales.umbralesAnteriores.valores[i] = pesosYUmbrales.umbrales.valores[i];
      pesosYUmbrales.umbrales.valores[i] = umbralNuevo;
    }
    return { pesosOptimos: pesosYUmbrales.pesosOptimos, umbrales: pesosYUmbrales.umbrales,
      pesosAnteriores: pesosYUmbrales.pesosAnteriores, umbralesAnteriores: pesosYUmbrales.umbralesAnteriores };
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
      const salidaRed = this.funcionActivacion(salidaSoma, parametrosEntrada.tipoDato);
      salidasRed.push(salidaRed);
      erroresLineales.push(salidaDeseada - salidaRed);
    }
    return { erroresLineales: erroresLineales, salidas: salidasRed };
  }

  funcionActivacion(salidaSoma: number, tipoDato: string): number {
    return this.funcionEscalon1(salidaSoma, tipoDato);
  }

  funcionEscalon1(salidaSoma: number, tipoDato: string): number {
    return salidaSoma >= 0 ? 1 : tipoDato === 'binario' ? 0 : -1;
  }

  funcionEscalon2(salidaSoma: number, tipoDato: string): number {
    return salidaSoma > 0 ? 1 : tipoDato === 'binario' ? 0 : -1;
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
