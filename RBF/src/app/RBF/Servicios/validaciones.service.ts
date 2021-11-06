import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ConfiguracionRed } from '../Modelos/configuracionRed';
import { MatrizPesosSinapticos } from '../Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from '../Modelos/parametrosEntrada';
import { Umbrales } from '../Modelos/umbrales';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  checkConfiguracionGeneralRed(parametrosEntrada: ParametrosEntrada, errorMaximoPermitido: any, configuracionRed: ConfiguracionRed): boolean {
    return this.checkParametrosEntrada(parametrosEntrada) && this.checkErrorMaximoPermitido(errorMaximoPermitido) &&
      this.checkNumeroCentrosRadiales(configuracionRed.numeroCentrosRadiales,configuracionRed.numeroEntradas);
  }

  checkParametrosEntrada(parametrosEntrada: ParametrosEntrada) {
    return !(parametrosEntrada.numeroEntradas == 'N/A' || parametrosEntrada.numeroSalidas == 'N/A');
  }

  checkPesosYUmbrales(pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales) {
    return this.checkPesos(pesosSinapticos) && this.checkUmbrales(umbrales);
  }

  checkPesos(pesosSinapticos: MatrizPesosSinapticos) {
    return pesosSinapticos.filas[0].columnas[0] != 'N/A';
  }

  checkUmbrales(umbrales: Umbrales) {
    return umbrales.valores[0] != 'N/A';
  }

  checkErrorMaximoPermitido(errorMaximoPermitido: any) {
    return !(parseFloat(errorMaximoPermitido) < 0 || errorMaximoPermitido == null || false);
  }

  checkNumeroCentrosRadiales(valor: any, numeroEntradas: number): boolean {
    return !(valor < numeroEntradas || valor == null || false);
  }
}
