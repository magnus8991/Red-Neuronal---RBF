import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatrizPesosSinapticos } from 'src/app/PerceptronMulticapa/Modelos/matrizPesosSinapticos';
import { Fila } from 'src/app/PerceptronMulticapa/Modelos/fila';
import { ValidacionesService } from 'src/app/PerceptronMulticapa/Servicios/validaciones.service';
import { ParametrosEntrenamientoService } from 'src/app/PerceptronMulticapa/Servicios/parametrosEntrenamiento.service';
import { GetterEntradasService } from 'src/app/PerceptronMulticapa/Servicios/getterEntradas.service';
import { ParametrosEntrada } from 'src/app/PerceptronMulticapa/Modelos/parametrosEntrada';
import { Umbrales } from 'src/app/PerceptronMulticapa/Modelos/umbrales';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-pesos-y-umbrales',
  templateUrl: './step-pesos-y-umbrales.component.html',
  styleUrls: ['./step-pesos-y-umbrales.component.css']
})
export class StepPesosYUmbralesComponent implements OnInit, AfterViewInit {
  dataSourcePesos: MatTableDataSource<Fila>;
  dataSourceUmbrales: MatTableDataSource<Umbrales>;
  pesosSinapticos: MatrizPesosSinapticos;
  umbrales: Umbrales;
  disabledFile = true;
  checkFile = false;
  checkPesosAleatorios = false;
  checkPesosAnteriores = false;
  displayedColumnsPesos: string[];
  displayedColumnsUmbrales: string[];
  @ViewChild('paginatorPesos') paginatorPesos: MatPaginator;
  @ViewChild('sortPesos') sortPesos: MatSort;
  @ViewChild('paginatorUmbrales') paginatorUmbrales: MatPaginator;
  @ViewChild('sortUmbrales') sortUmbrales: MatSort;
  labelAleatorio = 'Sin procesar';
  spinnerAleatorioValue = 0;
  spinnerAleatorioMode = 'determinate';
  labelAnterior = 'Sin cargar';
  spinnerAnteriorValue = 0;
  spinnerAnteriorMode = 'determinate';
  errorCheckAleatorio = false;
  errorCheckAnterior = false;
  errorCheckFile = false;
  parametrosEntrada: ParametrosEntrada;
  @Output() reloadTraining = new EventEmitter<unknown>();

  constructor(private getterEntradas: GetterEntradasService,
    private parametrosEntrenamientoService: ParametrosEntrenamientoService,
    private validaciones: ValidacionesService,
    private toastr: ToastrService) { }

  ngAfterViewInit() {
    this.dataSourcePesos.paginator = this.paginatorPesos;
    this.dataSourcePesos.sort = this.sortPesos;
    this.dataSourceUmbrales.paginator = this.paginatorUmbrales;
    this.dataSourceUmbrales.sort = this.sortUmbrales;
  }

  ngOnInit() {
    const data = this.parametrosEntrenamientoService.getParametrosEntrada();
    this.parametrosEntrada = data ? data : new ParametrosEntrada();
    this.pesosSinapticos = new MatrizPesosSinapticos();
    this.umbrales = new Umbrales();
    this.mostrarContenidoPesos();
    this.mostrarContenidoUmbrales();
  }

  // Cargue del archivo de los parametros de entrada

  crearArchivo(event, tipoArchivo) {
    if (event.target.files.length > 0) {
      const inputFile = <HTMLInputElement>document.getElementById(tipoArchivo === 'pesos' ? 'file-1' : 'file-2');
      const fileName = <HTMLSpanElement>document.getElementById(tipoArchivo === 'pesos' ? 'iborrainputfile1' : 'iborrainputfile2');
      if (!inputFile.files[0].name.includes('.txt')) {
        this.toastr.warning('Debe subir un archivo de texto plano (.txt)', '¡Advertencia!');
        inputFile.value = '';
        fileName.innerHTML = tipoArchivo === 'pesos' ? 'Cargar Pesos' : 'Cargar Umbrales';
        return;
      }
      fileName.innerHTML = inputFile.files[0].name;
      this.convertirATexto(event.target.files[0], inputFile, fileName, tipoArchivo);

    }
  }

  convertirATexto(inputFile, fileHtml: HTMLInputElement, fileName: HTMLSpanElement, tipoArchivo: string) {
    const reader = new FileReader;
    reader.onloadend = () => {
      if (tipoArchivo === 'pesos') {
        this.pesosSinapticos = this.getterEntradas.getPesosSinapticosFile(reader.result, this.parametrosEntrada.numeroEntradas,
        this.parametrosEntrada.numeroSalidas);
        if (!this.validaciones.checkPesos(this.pesosSinapticos)) {
          fileHtml.value = '';
          fileName.innerHTML = 'Cargar Pesos';
        }
        this.parametrosEntrenamientoService.postPesosSinapticos(this.pesosSinapticos);
        this.mostrarContenidoPesos();
      } else {
        this.umbrales = this.getterEntradas.getUmbralesFile(reader.result, this.parametrosEntrada.numeroSalidas);
        if (!this.validaciones.checkUmbrales(this.umbrales)) {
          fileHtml.value = '';
          fileName.innerHTML = 'Cargar Umbrales';
        }
        this.parametrosEntrenamientoService.postUmbrales(this.umbrales);
        this.mostrarContenidoUmbrales();
      }
    };
    reader.readAsText(inputFile, 'ISO-8859-1');
  }

  // Visualizacion del contenido de los pesos sinapticos y umbrales

  mostrarContenidoPesos() {
    this.displayedColumnsPesos = this.pesosSinapticos.encabezados;
    this.dataSourcePesos = new MatTableDataSource<Fila>(this.pesosSinapticos.filas);
    this.dataSourcePesos.paginator = this.paginatorPesos;
    this.dataSourcePesos.sort = this.sortPesos;
  }

  mostrarContenidoUmbrales() {
    this.displayedColumnsUmbrales = this.umbrales.encabezados;
    this.dataSourceUmbrales = new MatTableDataSource<Umbrales>([this.umbrales]);
    this.dataSourceUmbrales.paginator = this.paginatorUmbrales;
    this.dataSourceUmbrales.sort = this.sortUmbrales;
  }

  // Operaciones de los slide toggles de los pesos sinapticos

  toggleArchivos(event) {
    if (this.errorCheckFile) { event.source.checked = true; }
    switch (event.source.checked) {
      case true:
        if (!this.validaciones.checkParametrosEntrada(this.parametrosEntrada)) {
          this.messageToggle(event, 'file', 'warning', 'Debe cargar el archivo de los parámetros de entrada');
          return;
        }
        this.cargueArchivoListo();
        break;
      case false:
        if (!this.errorCheckFile) { this.reiniciarPesosYUmbrales(); }
        this.deshabilitarCargueArchivos();
        break;
    }
  }

  toggleAleatorio(event) {
    if (this.errorCheckAleatorio) { event.source.checked = true; }
    switch (event.source.checked) {
      case true:
        this.spinnerAleatorioMode = 'indeterminate';
        if (!this.validaciones.checkParametrosEntrada(this.parametrosEntrada)) {
          this.messageToggle(event, 'aleatorio', 'warning', 'Debe cargar el archivo de los parámetros de entrada');
          return;
        }
        this.entrenamientoAleatorioListo();
        break;
      case false:
        if (!this.errorCheckAleatorio) { this.reiniciarPesosYUmbrales(); }
        this.deshabilitarPesoAleatorio();
        break;
    }
  }

  toggleEntrenamientoAnterior(event) {
    if (this.errorCheckAnterior) { event.source.checked = true; }
    switch (event.source.checked) {
      case true:
        this.spinnerAnteriorMode = 'indeterminate';
        if (!this.isValidToggleEntrenamientoAnterior(event)) { return; }
        this.entrenamientoAnteriorListo();
        break;
      case false:
        if (!this.errorCheckAnterior) { this.reiniciarPesosYUmbrales(); }
        this.deshabilitarPesoAnterior();
        break;
    }
  }

  // Validación de toggle anterior

  isValidToggleEntrenamientoAnterior(event): boolean {
    if (!this.validaciones.checkParametrosEntrada(this.parametrosEntrada)) {
      this.messageToggle(event, 'anterior', 'warning', 'Debe cargar el archivo de los parámetros de entrada');
      return false;
    }
    const data = this.parametrosEntrenamientoService.getPesosYUmbralesOptimos();
    this.pesosSinapticos = data ? data.pesosOptimos : new MatrizPesosSinapticos();
    this.umbrales = data ? data.umbrales : new Umbrales();
    if (!data) {
      this.messageToggle(event, 'anterior', 'error', 'No existen pesos o umbrales en almacenamiento local');
      return false;
    }
    if (
      this.pesosSinapticos.filas.length !== this.parametrosEntrada.numeroEntradas
      || this.pesosSinapticos.filas[0].columnas.length !== this.parametrosEntrada.numeroSalidas
    ) {
      this.messageToggle(event, 'anterior', 'warning', 'El numero de filas o columnas de los datos cargados no coincide con el numero de entradas o salidas (conflicto con: Pesos)');
      return false;
    }
    // tslint:disable-next-line:triple-equals
    if (this.umbrales.valores.length != this.parametrosEntrada.numeroSalidas) {
      this.messageToggle(event, 'anterior', 'warning', 'El numero de columnas de los datos cargados no coincide con el numero de salidas (conflicto con: Umbrales)');
      return false;
    }
    return true;
  }

  // Visualización de mensajes toggle

  messageToggle(event, check: string, type: string, message: string) {
    event.source.checked = false;
    switch (check) {
      case 'anterior':
        this.deshabilitarPesoAnterior();
        this.errorCheckAnterior = true;
        break;
      case 'aleatorio':
        this.deshabilitarPesoAleatorio();
        this.errorCheckAleatorio = true;
        break;
      case 'file':
        this.deshabilitarCargueArchivos();
        this.errorCheckFile = true;
        break;
    }
    if (type === 'error') { this.toastr.error(message, '¡Oh no!'); } else if (type === 'warning') { this.toastr.warning(message, '¡Advertencia!'); }
  }

  // Operaciones de habilitacion y deshabilitacion de los toggles de los pesos sinapticos

  deshabilitarCargueArchivos() {
    const inputFile1 = <HTMLInputElement>document.getElementById('file-1');
    const fileName1 = <HTMLSpanElement>document.getElementById('iborrainputfile1');
    inputFile1.value = '';
    fileName1.innerHTML = 'Cargar Pesos';
    const inputFile2 = <HTMLInputElement>document.getElementById('file-2');
    const fileName2 = <HTMLSpanElement>document.getElementById('iborrainputfile2');
    inputFile2.value = '';
    fileName2.innerHTML = 'Cargar Umbrales';
    this.disabledFile = true;
  }

  deshabilitarPesoAnterior() {
    this.spinnerAnteriorMode = 'determinate';
    this.spinnerAnteriorValue = 0;
    this.labelAnterior = 'Sin cargar';
  }

  deshabilitarPesoAleatorio() {
    this.spinnerAleatorioMode = 'determinate';
    this.spinnerAleatorioValue = 0;
    this.labelAleatorio = 'Sin procesar';
  }

  entrenamientoAnteriorListo() {
    this.errorCheckAnterior = false;
    this.checkPesosAleatorios = false;
    this.checkFile = false;
    this.deshabilitarCargueArchivos();
    this.deshabilitarPesoAleatorio();
    this.mostrarContenidoPesos();
    this.mostrarContenidoUmbrales();
    this.parametrosEntrenamientoService.postPesosSinapticos(this.pesosSinapticos);
    this.parametrosEntrenamientoService.postUmbrales(this.umbrales);
    this.spinnerAnteriorMode = 'determinate';
    this.spinnerAnteriorValue = 100;
    this.labelAnterior = '¡Listo!';
  }

  entrenamientoAleatorioListo() {
    this.errorCheckAleatorio = false;
    this.checkFile = false;
    this.checkPesosAnteriores = false;
    this.deshabilitarCargueArchivos();
    this.deshabilitarPesoAnterior();
    this.pesosSinapticos = this.getterEntradas.getPesosSinapticosRandom(this.parametrosEntrada.numeroEntradas,
      this.parametrosEntrada.numeroSalidas);
    this.umbrales = this.getterEntradas.getUmbralesRandom(this.parametrosEntrada.numeroSalidas);
    this.mostrarContenidoPesos();
    this.mostrarContenidoUmbrales();
    this.parametrosEntrenamientoService.postPesosSinapticos(this.pesosSinapticos);
    this.parametrosEntrenamientoService.postUmbrales(this.umbrales);
    this.spinnerAleatorioMode = 'determinate';
    this.spinnerAleatorioValue = 100;
    this.labelAleatorio = '¡Listo!';
  }

  cargueArchivoListo() {
    this.errorCheckFile = false;
    this.checkPesosAleatorios = false;
    this.checkPesosAnteriores = false;
    this.disabledFile = false;
    this.deshabilitarPesoAnterior();
    this.deshabilitarPesoAleatorio();
    this.reiniciarPesosYUmbrales();
  }

  // Operaciones de reinicio de valores

  reiniciarStepPesos() {
    this.checkFile = false;
    this.checkPesosAleatorios = false;
    this.checkPesosAnteriores = false;
    this.deshabilitarCargueArchivos();
    this.deshabilitarPesoAnterior();
    this.deshabilitarPesoAleatorio();
    this.reiniciarPesosYUmbrales();
  }

  reiniciarPesosYUmbrales() {
    this.pesosSinapticos = new MatrizPesosSinapticos();
    this.mostrarContenidoPesos();
    this.umbrales = new Umbrales();
    this.mostrarContenidoUmbrales();
  }

  // Eventos de reinicio de valores

  reiniciarEntrenamiento() {
    this.reloadTraining.emit();
  }
}
