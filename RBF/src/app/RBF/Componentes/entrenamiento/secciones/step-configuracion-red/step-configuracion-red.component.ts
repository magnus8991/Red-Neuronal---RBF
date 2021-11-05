import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfiguracionRed } from 'src/app/PerceptronMulticapa/Modelos/configuracionRed';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { CapaIntermedia } from 'src/app/PerceptronMulticapa/Modelos/capaIntermedia';
import { CapaSalida } from 'src/app/PerceptronMulticapa/Modelos/capaSalida';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-configuracion-red',
  templateUrl: './step-configuracion-red.component.html',
  styleUrls: ['./step-configuracion-red.component.css']
})
export class StepConfiguracionRedComponent implements OnInit {
  formConfiguracionRed: FormGroup;
  funcionesActivacionCapaIntermedia = ['Sigmoide', 'Gausiana', 'Tangente Hiperbolica'];
  funcionesActivacionCapaSalida = ['Sigmoide', 'Gausiana', 'Tangente Hiperbolica', 'Lineal'];
  configuracionRed: ConfiguracionRed;
  @Output() reloadTraining = new EventEmitter<unknown>();

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.configuracionRed = new ConfiguracionRed(1,[new CapaIntermedia(1,'')],new CapaSalida(''));
    this.formConfiguracionRed = this.builder.group({
      numeroCapasIntermedias: [1, Validators.required],
      funcionActivacionCapaSalida: [0, Validators.required],
      capasIntermedias: this.builder.array([])
    });
    this.generarCamposCapaIntermedia(1);
  }

  // Operaciones de controles y formulario

  generarCamposCapaIntermedia(numeroCapasIntermedias) {
    this.arrayConfiguracionCapasIntermedias.clear();
    for (let i = 0; i < numeroCapasIntermedias; i++) {
      this.arrayConfiguracionCapasIntermedias.push(this.nuevaCapaIntermedia());
    }
  }

  nuevaCapaIntermedia(): FormGroup {
    return this.builder.group({
      numeroNeuronas: [1, Validators.required],
      funcionActivacion: [0, Validators.required]
    });
  }

  onSubmit() {
    console.log(this.formConfiguracionRed.value);
  }

  // Operaciones de reinicio y actualizacion de valores

  reiniciarStepConfiguracionRed() {
    this.arrayConfiguracionCapasIntermedias.clear();
    this.generarCamposCapaIntermedia(1);
    this.numeroCapasIntermedias.setValue(1);
    this.funcionActivacionCapaSalida.setValue(0);
    this.configuracionRed = new ConfiguracionRed(1,[new CapaIntermedia(1,'')],new CapaSalida(''));
  }

  actualizarConfiguracionRed(): ConfiguracionRed {
    const capasIntermedias: CapaIntermedia[] = [];
    this.arrayConfiguracionCapasIntermedias.controls.forEach(capaIntermedia => {
      capasIntermedias.push(new CapaIntermedia(capaIntermedia.value.numeroNeuronas,
      capaIntermedia.value.funcionActivacion));
    });
    return new ConfiguracionRed(this.numeroCapasIntermedias.value,capasIntermedias,
      new CapaSalida(this.funcionActivacionCapaSalida.value));
  }

  // Eventos de reinicio y actualizacion de valores

  reiniciarEntrenamiento() {
    this.reloadTraining.emit();
  }

  // Obtencion de los controles del formulario

  get arrayConfiguracionCapasIntermedias() { return this.formConfiguracionRed.get('capasIntermedias') as FormArray; }
  get numeroCapasIntermedias() { return this.formConfiguracionRed.get('numeroCapasIntermedias'); }
  get funcionActivacionCapaSalida() { return this.formConfiguracionRed.get('funcionActivacionCapaSalida'); }
}
