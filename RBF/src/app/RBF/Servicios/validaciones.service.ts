import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CapaIntermedia } from '../Modelos/capaIntermedia';
import { CapaSalida } from '../Modelos/capaSalida';
import { ConfiguracionRed } from '../Modelos/configuracionRed';
import { MatrizPesosSinapticos } from '../Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from '../Modelos/parametrosEntrada';
import { Umbrales } from '../Modelos/umbrales';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  checkConfiguracionGeneralRed(parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales,
    checkDelta: boolean, checkDeltaModificada: boolean, numeroIteraciones: any, rataAprendizaje: any, errorMaximoPermitido: any,
    configuracionRed: ConfiguracionRed): boolean {
    return this.checkParametrosEntrada(parametrosEntrada) && this.checkAlgoritmTraining(checkDelta, checkDeltaModificada) &&
      this.checkParametrosEntrenamiento(numeroIteraciones, rataAprendizaje, errorMaximoPermitido) &&
      this.checkConfiguracionRed(configuracionRed) && this.checkPesosYUmbrales(pesosSinapticos, umbrales);
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

  checkAlgoritmTraining(checkDelta: boolean, checkDeltaModificada: boolean) {
    return checkDelta || checkDeltaModificada;
  }

  checkParametrosEntrenamiento(numeroIteraciones: any, rataAprendizaje: any, errorMaximoPermitido: any) {
    return this.checkNumeroIteraciones(numeroIteraciones) && this.checkRataAprendizaje(rataAprendizaje) &&
      this.checkErrorMaximoPermitido(errorMaximoPermitido);
  }

  checkNumeroIteraciones(numeroIteraciones: any) {
    return !(numeroIteraciones <= 0 || numeroIteraciones == null || false);
  }

  checkRataAprendizaje(rataAprendizaje: any) {
    return !(parseFloat(rataAprendizaje) <= 0 || parseFloat(rataAprendizaje) > 1 ||
      rataAprendizaje == null || false);
  }

  checkErrorMaximoPermitido(errorMaximoPermitido: any) {
    return !(parseFloat(errorMaximoPermitido) < 0 || errorMaximoPermitido == null || false);
  }

  checkConfiguracionRed(configuracionRed: ConfiguracionRed): boolean {
    return this.checkFuncionActivacionCapa(configuracionRed.capaSalida) && 
      this.checkNumeroCapasONeuronas(configuracionRed.numeroCapasIntermedias) &&
      this.checkConfiguracionCapasIntermedias(configuracionRed.capasIntermedias);
  }

  checkFuncionActivacionCapa(capa: CapaSalida | CapaIntermedia): boolean {
    return !(capa.funcionActivacion == 0 || capa.funcionActivacion == '0' || capa.funcionActivacion == null || false);
  }

  checkNumeroCapasONeuronas(valor: any): boolean {
    return !(valor <= 0 || valor == null || false);
  }

  checkConfiguracionCapasIntermedias(capasIntermedias: CapaIntermedia[]): boolean {
    let errores = 0;
    capasIntermedias.forEach(capaIntermedia => {
      errores += this.checkFuncionActivacionCapa(capaIntermedia) ? 0 : 1;
      errores += this.checkNumeroCapasONeuronas(capaIntermedia.numeroNeuronas) ? 0 : 1;
    });
    return errores == 0;
  }
}
