import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Fila } from '../Modelos/fila';
import { MatrizPesosSinapticos } from '../Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from '../Modelos/parametrosEntrada';
import { Patron } from '../Modelos/patron';
import { Umbrales } from '../Modelos/umbrales';

@Injectable({
  providedIn: 'root'
})
export class GetterEntradasService {

  constructor(
    private toastr: ToastrService
  ) { }

  getParametrosEntrada(inputFile): any {
    const parametros = new ParametrosEntrada();
    parametros.numeroEntradas = this.getNumeroEntradas(inputFile);
    parametros.numeroSalidas = this.getNumeroSalidasDeseadas(inputFile);
    parametros.numeroPatrones = this.getNumberoPatrones(inputFile);
    parametros.encabezados = this.getEncabezados(parametros.numeroEntradas, parametros.numeroSalidas);
    const patronesYError = this.getPatronesYError(inputFile);
    parametros.patrones = patronesYError.patrones;
    parametros.error = patronesYError.error;
    parametros.valorMaximo = patronesYError.valorMaximo;
    parametros.valorMinimo = patronesYError.valorMinimo;
    return {parametrosEntrada: parametros };
  }

  getEncabezados(entradas: number, salidas: number): string[] {
    const encabezados: string[] = [];
    encabezados.push('#');
    for (let i = 1; i <= entradas; i++) { encabezados.push('X' + i); }
    for (let i = 1; i <= salidas; i++) { encabezados.push('YD' + i); }
    return encabezados;
  }

  getNumeroSalidasDeseadas(textFile): number {
    const primeraLinea = this.getPrimeraLinea(textFile);
    const salidas = this.getSalidas(primeraLinea);
    return salidas.length;
  }

  getNumeroEntradas(textFile): number {
    const primeraLinea = this.getPrimeraLinea(textFile);
    const entradas = this.getEntradas(primeraLinea);
    return entradas.length;
  }

  getNumberoPatrones(textFile): number {
    return textFile.split('\n').length;
  }

  getEntradas(linea): string[] {
    const entradas = linea.split('|')[0];
    return entradas.split(';');
  }

  getSalidas(linea): string[] {
    const salidas = linea.split('|')[1];
    return salidas.split(';');
  }

  getPrimeraLinea(textFile): string {
    return textFile.split('\n')[0];
  }

  getPatronesYError(textFile): any {
    let valorMaximo = 0;
    let valorMinimo = 0;
    let error = false;
    const patrones: Patron[] = [];
    const lineas: string[] = textFile.split('\n');
    let indice = 0;
    lineas.forEach(linea => {
      indice += 1;
      const valores: number[] = [];
      this.getEntradas(linea).forEach(entrada => {
        if (isNaN(+entrada)) error = true;
        let valor = Number.isInteger(entrada) ? parseInt(entrada) : parseFloat(entrada);
        valores.push(valor);
        valorMinimo = this.obtenerValorMinimo(indice, valorMinimo, valor);
        valorMaximo = this.obtenerValorMaximo(indice, valorMaximo, valor);
      });
      this.getSalidas(linea).forEach(salida => {
        if (isNaN(+salida))  error = true;
        let valor = Number.isInteger(salida) ? parseInt(salida) : parseFloat(salida);
        valores.push(valor);
        valorMinimo = this.obtenerValorMinimo(2, valorMinimo, valor);
        valorMaximo = this.obtenerValorMaximo(2, valorMaximo, valor);
      });
      patrones.push(new Patron(indice, valores));
    });
    return { patrones: patrones, error: error, valorMaximo: valorMaximo, valorMinimo: valorMinimo };
  }

  obtenerValorMinimo(indice, valorMinimo, valor): number {
    return indice == 1 ? valor : valor < valorMinimo ? valor : valorMinimo;
  }

  obtenerValorMaximo(indice, valorMaximo, valor): number {
    return indice == 1 ? valor : valor > valorMaximo ? valor : valorMaximo;
  }

  getPesosSinapticosFile(inputFile, numeroFilas: number, numeroColumnas: number): MatrizPesosSinapticos {
    const matrizPesosSinapticos = new MatrizPesosSinapticos();
    const lineas: string[] = inputFile.split('\n');
    if (lineas.length != numeroFilas || lineas[0].split(';').length != numeroColumnas) {
      this.toastr.warning('El numero de filas o columnas del archivo cargado no coincide con el numero de entradas o salidas', 'Advertencia');
      return matrizPesosSinapticos;
    }
    matrizPesosSinapticos.encabezados = [];
    matrizPesosSinapticos.filas = [];
    matrizPesosSinapticos.encabezados.push('#');
    let indiceFilas = 0;
    for (let i = 0; i < numeroColumnas; i++) { matrizPesosSinapticos.encabezados.push((i + 1).toString()); }
    lineas.forEach(linea => {
      indiceFilas += 1;
      const columnas: number[] = [];
      this.getEntradas(linea).forEach(columna => {
        columnas.push(parseFloat(columna));
      });
      matrizPesosSinapticos.filas.push(new Fila(indiceFilas, columnas));
    });
    return matrizPesosSinapticos;
  }

  getPesosSinapticosRandom(numeroFilas: number, numeroColumnas: number): MatrizPesosSinapticos {
    const matrizPesosSinapticos = new MatrizPesosSinapticos();
    matrizPesosSinapticos.encabezados = [];
    matrizPesosSinapticos.filas = [];
    matrizPesosSinapticos.encabezados.push('#');
    for (let i = 0; i < numeroColumnas; i++) { matrizPesosSinapticos.encabezados.push((i + 1).toString()); }
    for (let i = 0; i < numeroFilas; i++) { matrizPesosSinapticos.filas.push(new Fila(i + 1, [])); }
    matrizPesosSinapticos.filas.forEach(fila => {
      for (let i = 0; i < numeroColumnas; i++) {
        fila.columnas.push(Math.random() * (1 - (-1)) + (-1));
      }
    });
    return matrizPesosSinapticos;
  }

  getUmbralesFile(inputFile, numeroColumnas: number): Umbrales {
    const umbrales = new Umbrales();
    const valores: string[] = inputFile.split('\n')[0].split(';');
    if (valores.length !== numeroColumnas) {
      this.toastr.warning('El numero de columnas del archivo cargado no coincide con el numero de salidas', 'Advertencia');
      return umbrales;
    }
    umbrales.encabezados = [];
    umbrales.valores = [];
    for (let i = 0; i < numeroColumnas; i++) { umbrales.encabezados.push('U' + (i + 1).toString()); }
    valores.forEach(valor => {
      umbrales.valores.push(parseFloat(valor));
    });
    return umbrales;
  }

  getUmbralesRandom(numeroColumnas: number): Umbrales {
    const umbrales = new Umbrales();
    umbrales.encabezados = [];
    umbrales.valores = [];
    for (let i = 0; i < numeroColumnas; i++) {
      umbrales.encabezados.push('U' + (i + 1).toString());
      umbrales.valores.push(Math.random() * (1 - (-1)) + (-1));
    }
    return umbrales;
  }
}
