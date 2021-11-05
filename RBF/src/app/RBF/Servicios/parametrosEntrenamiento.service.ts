import { Injectable, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatrizPesosSinapticos } from '../Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from '../Modelos/parametrosEntrada';
import { Umbrales } from '../Modelos/umbrales';

@Injectable({
  providedIn: 'root'
})
export class ParametrosEntrenamientoService {

  constructor(
    private toastr: ToastrService
  ) { }

  getParametrosEntrada(): ParametrosEntrada {
    let parametrosEntrada = localStorage.getItem('ParametrosEntrada');
    return parametrosEntrada ? JSON.parse(parametrosEntrada) : null;
  }

  postParametrosEntrada(parametrosEntrada: ParametrosEntrada) {
    localStorage.setItem('ParametrosEntrada', JSON.stringify(parametrosEntrada));
  }

  deleteParametrosEntrada() {
    localStorage.removeItem('ParametrosEntrada');
  }

  getPesosYUmbralesOptimos(): any {
    let pesosOptimos = localStorage.getItem('PesosOptimos');
    let umbrales = localStorage.getItem('UmbralesOptimos');
    let data = {
      pesosOptimos: JSON.parse(pesosOptimos),
      umbrales: JSON.parse(umbrales)
    };
    return !pesosOptimos ? null : !umbrales ? null : data;
  }

  postPesosOptimosYUmbrales(redEntrenada: boolean, pesosOptimos: MatrizPesosSinapticos, umbrales: Umbrales, tipoDato: string) {
    if (!redEntrenada) {
      this.toastr.warning('Debe entrenar la red primero', '¡Advertencia!');
      return;
    }
    localStorage.setItem('PesosOptimos', JSON.stringify(pesosOptimos));
    localStorage.setItem('UmbralesOptimos', JSON.stringify(umbrales));
    localStorage.setItem('TipoDato', tipoDato);
    this.toastr.info('Pesos óptimos y umbrales guardados correctamente (se almacenaron en localStorage)', '¡Operación exitosa!');
  }

  deletePesosOptimosYUmbrales() {
    let pesosOptimos = localStorage.getItem('PesosOptimos');
    if (!pesosOptimos) {
      this.toastr.error('No existen pesos óptimos para eliminar', '¡Oh no!');
      return;
    }
    localStorage.removeItem('PesosOptimos');
    this.toastr.info('Pesos óptimos eliminados correctamente', '¡Operación exitosa!');
    let umbrales = localStorage.getItem('UmbralesOptimos');
    if (!umbrales) {
      this.toastr.error('No existen umbrales óptimos para eliminar', '¡Oh no!');
      return;
    }
    localStorage.removeItem('UmbralesOptimos');
    this.toastr.info('Umbrales óptimos eliminados correctamente', '¡Operación exitosa!');
  }

  exportPesosYUmbralesOptimos(redEntrenada: boolean, data: any, tipoExport) {
    if (!redEntrenada) {
      this.toastr.warning('Debe entrenar la red primero', '¡Advertencia!');
      return;
    }
    let textoArchivo = tipoExport == 'pesos' ? this.obtenerTextoArchivoPesos(data) : this.obtenerTextoArchivoUmbrales(data);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textoArchivo));
    element.setAttribute('download', tipoExport == 'pesos' ? 'PesosOptimos.txt' : 'UmbralesOptimos.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.toastr.info(tipoExport == 'pesos' ? 'Pesos sinápticos exportados correctamente' :
      'Umbrales exportados correctamente', '¡Operación exitosa!');
  }

  obtenerTextoArchivoPesos(pesosOptimos: MatrizPesosSinapticos): string {
    let textoArchivo = '';
    pesosOptimos.filas.forEach(fila => {
      for (let i = 0; i < fila.columnas.length; i++) {
        textoArchivo += fila.columnas[i];
        textoArchivo += i == fila.columnas.length - 1 ? '' : ';';
      }
      if (pesosOptimos.filas.indexOf(fila) < pesosOptimos.filas.length - 1)  textoArchivo += '\n';
    });
    return textoArchivo;
  }

  obtenerTextoArchivoUmbrales(umbrales: Umbrales): string {
    let textoArchivo = '';
      for (let i = 0; i < umbrales.valores.length; i++) {
        textoArchivo += umbrales.valores[i];
        textoArchivo += i == umbrales.valores.length - 1 ? '' : ';';
      }
    return textoArchivo;
  }

  postPesosSinapticos(pesosOptimos: MatrizPesosSinapticos) {
    localStorage.setItem('PesosSinapticos', JSON.stringify(pesosOptimos));
  }

  getPesosSinapticos(): MatrizPesosSinapticos {
    let pesosOptimos = localStorage.getItem('PesosSinapticos');
    return pesosOptimos ? JSON.parse(pesosOptimos) : null;
  }

  postUmbrales(umbralesOptimos: Umbrales) {
    localStorage.setItem('Umbrales', JSON.stringify(umbralesOptimos));
  }

  getUmbrales(): Umbrales {
    let umbralesOptimos = localStorage.getItem('Umbrales');
    return umbralesOptimos ? JSON.parse(umbralesOptimos) : null;
  }

  getTipoDato(): string {
    return localStorage.getItem('TipoDato');
  }
}
