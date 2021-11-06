import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfiguracionRed } from 'src/app/RBF/Modelos/configuracionRed';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-configuracion-red',
  templateUrl: './step-configuracion-red.component.html',
  styleUrls: ['./step-configuracion-red.component.css']
})
export class StepConfiguracionRedComponent implements OnInit, AfterViewInit {
  formConfiguracionRed: FormGroup;
  funcionesActivacionCapaOculta = ['Sigmoide', 'Gausiana', 'Tangente Hiperbolica'];
  funcionesActivacionCapaSalida = ['Sigmoide', 'Gausiana', 'Tangente Hiperbolica', 'Lineal'];
  configuracionRed: ConfiguracionRed;
  @Output() reloadTraining = new EventEmitter<unknown>();
  @Output() updateNetworkConfig = new EventEmitter<unknown>();

  constructor(private builder: FormBuilder) { }

  ngAfterViewInit() {
    this.actualizarStepConfiguracionRed();
  }

  ngOnInit(): void {
    this.configuracionRed = new ConfiguracionRed(1,1,0,0);
    this.formConfiguracionRed = this.builder.group({
      numeroCentrosRadiales: [this.configuracionRed.numeroEntradas, Validators.required],
      funcionActivacionCapaSalida: [0, Validators.required],
    });
  }

  // Operaciones de reinicio y actualizacion de valores

  actualizarConfiguracionRed(configuracionRed) {
    this.configuracionRed = new ConfiguracionRed(configuracionRed.numeroCentrosRadiales,configuracionRed.numeroEntradas,
      configuracionRed.valorMaximo, configuracionRed.valorMinimo);
    if (configuracionRed.numeroCentrosRadiales != this.numeroCentrosRadiales.value) 
      this.numeroCentrosRadiales.setValue(configuracionRed.numeroCentrosRadiales);
  }

  actualizarStepConfiguracionRed() {
    this.updateNetworkConfig.emit();
  }

  generarCentrosRadiales(numeroCentrosRadiales) {
    if (this.configuracionRed.numeroCentrosRadiales != this.numeroCentrosRadiales.value) {
    const numeroEntradas = this.configuracionRed.numeroEntradas;
    const valorMaximo = this.configuracionRed.valorMaximo;
    const valorMinimo = this.configuracionRed.valorMinimo;
    this.configuracionRed = new ConfiguracionRed(numeroCentrosRadiales,numeroEntradas,valorMaximo,valorMinimo);
    }
  }

  // Eventos de reinicio y actualizacion de valores

  reiniciarEntrenamiento() {
    this.reloadTraining.emit();
  }

  // Obtencion de los controles del formulario

  get numeroCentrosRadiales() { return this.formConfiguracionRed.get('numeroCentrosRadiales'); }
  get funcionActivacionCapaSalida() { return this.formConfiguracionRed.get('funcionActivacionCapaSalida'); }
}
