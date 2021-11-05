import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ParametrosEntrada } from 'src/app/PerceptronMulticapa/Modelos/parametrosEntrada';
import { ParametrosEntrenamientoService } from 'src/app/PerceptronMulticapa/Servicios/parametrosEntrenamiento.service';
import { GetterEntradasService } from 'src/app/PerceptronMulticapa/Servicios/getterEntradas.service';
import { Patron } from 'src/app/PerceptronMulticapa/Modelos/patron';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-entradas',
  templateUrl: './step-entradas.component.html',
  styleUrls: ['./step-entradas.component.css']
})
export class StepEntradasComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Patron>;
  formParametrosEntrada: FormGroup;
  formParametrosEntrenamiento: FormGroup;
  checkDelta = false;
  checkDeltaModificada = false;
  displayedColumns: string[];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  redEntrenada = false;
  parametrosEntrada: ParametrosEntrada;
  @Output() reloadStepPesos = new EventEmitter<unknown>();
  @Output() updateParametrosEntrada = new EventEmitter<ParametrosEntrada>();
  @Output() reloadParamsAndConfig = new EventEmitter<unknown>();
  @Output() reloadTraining = new EventEmitter<unknown>();
  constructor(private builder: FormBuilder,
    private getterEntradas: GetterEntradasService,
    private parametrosEntrenamientoService: ParametrosEntrenamientoService,
    private toastr: ToastrService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    const data = this.parametrosEntrenamientoService.getParametrosEntrada();
    this.parametrosEntrada = data ? data : new ParametrosEntrada();
    this.formParametrosEntrada = this.builder.group({
      numeroEntradas: [0, Validators.required],
      numeroSalidas: [0, Validators.required],
      numeroPatrones: [0, Validators.required]
    });
    this.formParametrosEntrenamiento = this.builder.group({
      numeroIteraciones: [1, Validators.required],
      rataAprendizaje: [0.1, Validators.required],
      errorMaximoPermitido: [0.1, Validators.required]
    });
    this.mostrarContenidoEntradas();
  }

  // Cargue del archivo de los parametros de entrada

  crearArchivo(event) {
    if (event.target.files.length > 0) {
      const inputFile = <HTMLInputElement>document.getElementById('file-0');
      const fileName = <HTMLSpanElement>document.getElementById('iborrainputfile');
      if (!inputFile.files[0].name.includes('.txt')) {
        this.toastr.warning('Debe subir un archivo de texto plano (.txt)', '¡Advertencia!');
        inputFile.value = '';
        fileName.innerHTML = 'Cargar Archivo';
        return;
      }
      fileName.innerHTML = inputFile.files[0].name;
      this.convertirATexto(event.target.files[0]);

    }
  }

  convertirATexto(inputFile) {
    const reader = new FileReader;
    reader.onloadend = () => {
      this.parametrosEntrada = this.getterEntradas.getParametrosEntrada(reader.result);
      if (this.parametrosEntrada.tipoDato == null) {
        this.parametrosEntrada = new ParametrosEntrada();
        this.toastr.warning('Verifique que todos los valores ingresados estén correctos según el entrenamiento deseado', '¡Advertencia!');
        this.reiniciarParametrosYConfiguracion();
      }
      this.mostrarContenidoEntradas();
      this.parametrosEntrenamientoService.postParametrosEntrada(this.parametrosEntrada);
      this.actualizarParametrosEntrada();
      this.reiniciarStepPesos();
    };
    reader.readAsText(inputFile, 'ISO-8859-1');
  }

  // Visualizacion del contenido de los parametros de entrada y de los pesos sinapticos

  mostrarContenidoEntradas() {
    this.displayedColumns = this.parametrosEntrada.encabezados;
    this.dataSource = new MatTableDataSource<Patron>(this.parametrosEntrada.patrones);
    this.numeroEntradas.setValue(this.parametrosEntrada.numeroEntradas);
    this.numeroSalidas.setValue(this.parametrosEntrada.numeroSalidas);
    this.numeroPatrones.setValue(this.parametrosEntrada.numeroPatrones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Operaciones de los slide toggles de la funcion de activacion

  toggleDelta(event) {
    if (event) { this.checkDeltaModificada = false; }
    this.actualizarParametrosEntrada();
  }

  toggleDeltaModificada(event) {
    if (event) { this.checkDelta = false; }
    this.actualizarParametrosEntrada();
  }

  // Operaciones de reinicio de valores

  reiniciarStepEntradas() {
    this.parametrosEntrada = new ParametrosEntrada();
    this.mostrarContenidoEntradas();
    this.parametrosEntrenamientoService.deleteParametrosEntrada();
    this.checkDelta = false;
    this.checkDeltaModificada = false;
    this.numeroIteraciones.setValue(1);
    this.rataAprendizaje.setValue(0.1);
    this.errorMaximoPermitido.setValue(0.1);
    const inputFile = <HTMLInputElement>document.getElementById('file-0');
    const fileName = <HTMLSpanElement>document.getElementById('iborrainputfile');
    inputFile.value = '';
    fileName.innerHTML = 'Cargar Archivo';
    this.actualizarParametrosEntrada();
  }

  // Eventos de reinicio y actualizacion de valores

  reiniciarStepPesos() {
    this.reloadStepPesos.emit();
  }

  actualizarParametrosEntrada() {
    this.updateParametrosEntrada.emit();
  }

  reiniciarParametrosYConfiguracion() {
    this.reloadParamsAndConfig.emit();
  }

  reiniciarEntrenamiento() {
    this.reloadTraining.emit();
  }

  // Obtencion de los controles del formulario

  get numeroEntradas() { return this.formParametrosEntrada.get('numeroEntradas'); }
  get numeroSalidas() { return this.formParametrosEntrada.get('numeroSalidas'); }
  get numeroPatrones() { return this.formParametrosEntrada.get('numeroPatrones'); }
  get numeroIteraciones() { return this.formParametrosEntrenamiento.get('numeroIteraciones'); }
  get rataAprendizaje() { return this.formParametrosEntrenamiento.get('rataAprendizaje'); }
  get errorMaximoPermitido() { return this.formParametrosEntrenamiento.get('errorMaximoPermitido'); }
}
