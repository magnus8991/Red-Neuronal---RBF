import { Component, OnInit, ViewChild } from '@angular/core';
import { StepEntradasComponent } from './secciones/step-entradas/step-entradas.component';
import { StepEntrenamientoComponent } from './secciones/step-entrenamiento/step-entrenamiento.component';
import { ValidacionesService } from '../../Servicios/validaciones.service';
import { ParametrosEntrada } from '../../Modelos/parametrosEntrada';
import { MatrizPesosSinapticos } from '../../Modelos/matrizPesosSinapticos';
import { ToastrService } from 'ngx-toastr';
import { Umbrales } from '../../Modelos/umbrales';
import { StepConfiguracionRedComponent } from './secciones/step-configuracion-red/step-configuracion-red.component';
import { ConfiguracionRed } from '../../Modelos/configuracionRed';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.css']
})
export class EntrenamientoComponent implements OnInit {
  @ViewChild(StepEntradasComponent) childStepEntradas: StepEntradasComponent;
  @ViewChild(StepConfiguracionRedComponent) childStepConfiguracionRed: StepConfiguracionRedComponent;
  @ViewChild(StepEntrenamientoComponent) childStepEntrenamiento: StepEntrenamientoComponent;

  constructor(private validaciones: ValidacionesService,
    private toastr: ToastrService) { }

  ngOnInit() { }

  // Operaciones de eventos (comunicación entre componentes)

  reiniciarParametrosYConfiguracion() {
    this.reiniciarEntrenamiento();
  }

  reiniciarEntrenamiento() {
    this.reiniciarStepEntradas();
    this.reiniciarStepEntrenamiento();
  }

  entrenar() {
    const errorMaximoPermitido = this.childStepEntradas.errorMaximoPermitido.value;
    const configuracionRed = this.childStepConfiguracionRed.configuracionRed;
    if (!this.isValidConfigYParametros(errorMaximoPermitido, this.childStepEntradas.parametrosEntrada, configuracionRed)) return;
    this.childStepEntrenamiento.entrenar(errorMaximoPermitido, this.childStepEntradas.parametrosEntrada, configuracionRed);
  }

  guardarPesosYUmbrales() {
    this.childStepEntrenamiento.guardarPesosYUmbrales();
  }

  actualizarParametrosEntrada() {
    this.actualizarStepConfiguracionRed();
    this.childStepEntrenamiento.actualizarGraficaSalidasDeseadas();
  }

  // Operaciones de reinicio de valores (comunicación entre componentes)

  reiniciarStepEntradas() {
    this.childStepEntradas.reiniciarStepEntradas();
  }

  reiniciarStepEntrenamiento() {
    this.childStepEntrenamiento.reiniciarStepEntrenamiento();
  }

  actualizarStepConfiguracionRed() {
    const parametrosEntrada = this.childStepEntradas.parametrosEntrada;
    const numeroEntradas = parametrosEntrada.numeroEntradas == 'N/A' ? 1 : parametrosEntrada.numeroEntradas;
    const configuracionRed = {
      numeroEntradas: numeroEntradas, numeroCentrosRadiales: numeroEntradas, valorMaximo:
        parametrosEntrada.valorMaximo, valorMinimo: parametrosEntrada.valorMinimo
    };
    this.childStepConfiguracionRed.actualizarConfiguracionRed(configuracionRed);
  }

  // Pre-validacion del entrenamiento

  isValidConfigYParametros(errorMaximoPermitido, parametrosEntrada: ParametrosEntrada, configuracionRed: ConfiguracionRed): boolean {
    if (!this.validaciones.checkConfiguracionGeneralRed(parametrosEntrada, errorMaximoPermitido, configuracionRed)) {
      this.toastr.warning(!this.validaciones.checkParametrosEntrada(parametrosEntrada) ?
        'Verifique el cargue y la configuración de los parámetros de entrada' : !this.validaciones.checkErrorMaximoPermitido(errorMaximoPermitido) ?
          'Verifique la configuración del error máximo permitido' : !this.validaciones.checkNumeroCentrosRadiales(configuracionRed.numeroCentrosRadiales,
            configuracionRed.numeroEntradas) ? 'Verifique el numero de centros radiales (mayor o igual al número de entradas)' :
            'Verifique la configuración de los pesos sinápticos y umbrales', '¡Advertencia!');
      return false;
    }
    return true;
  }
}
