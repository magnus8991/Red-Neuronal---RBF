import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Fila } from '../../Modelos/fila';
import { MatrizPesosSinapticos } from '../../Modelos/matrizPesosSinapticos';
import { Patron } from '../../Modelos/patron';
import { Umbrales } from '../../Modelos/umbrales';
import { ParametrosEntrenamientoService } from '../../Servicios/parametrosEntrenamiento.service';
import { SimulacionService } from '../../Servicios/simulacion.service';
import { ValidacionesService } from '../../Servicios/validaciones.service';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.css']
})
export class SimulacionComponent implements OnInit, AfterViewInit {
  entradas: any[] = [];
  salidasRed: any[] = [];
  pesosOptimos: MatrizPesosSinapticos;
  displayedColumnsPesosOptimos: string[];
  displayedColumnsUmbralesOptimos: string[];
  dataSourcePesosOptimos: MatTableDataSource<Fila>;
  dataSourceUmbralesOptimos: MatTableDataSource<Umbrales>;
  @ViewChild('paginatorPesosOptimos') paginatorPesosOptimos: MatPaginator;
  @ViewChild('sortPesosOptimos') sortPesosOptimos: MatSort;
  @ViewChild('paginatorUmbralesOptimos') paginatorUmbralesOptimos: MatPaginator;
  @ViewChild('sortUmbralesOptimos') sortUmbralesOptimos: MatSort;
  disabledFile = true;
  checkFile = false;
  checkPesosAnteriores = false;
  labelAnterior = 'Sin cargar';
  spinnerAnteriorValue = 0;
  spinnerAnteriorMode = 'determinate';
  errorCheckAnterior = false;
  errorCheckFile = false;
  numeroEntradas = 0;
  numeroSalidas = 0;
  tipoDato = '';
  umbrales: Umbrales;
  checkBinario = false;
  checkBipolar = false;

  constructor(private toastr: ToastrService,
    private simulacionService: SimulacionService,
    private validaciones: ValidacionesService,
    private parametrosEntrenamientoService: ParametrosEntrenamientoService) { }

  ngAfterViewInit() {
    this.dataSourcePesosOptimos.paginator = this.paginatorPesosOptimos;
    this.dataSourcePesosOptimos.sort = this.sortPesosOptimos;
    this.dataSourceUmbralesOptimos.paginator = this.paginatorUmbralesOptimos;
    this.dataSourceUmbralesOptimos.sort = this.sortUmbralesOptimos;
  }

  ngOnInit(): void {
    this.pesosOptimos = new MatrizPesosSinapticos();
    this.mostrarContenidoPesosOptimos();
    this.umbrales = new Umbrales();
    this.mostrarContenidoUmbralesOptimos();
  }

  // Cargue del archivo de los pesos óptimos de entrada

  crearArchivo(event, tipoArchivo: string) {
    if (event.target.files.length > 0) {
      const inputFile = <HTMLInputElement>document.getElementById(tipoArchivo === 'pesos' ? 'file-1' : 'file-2');
      const fileName = <HTMLSpanElement>document.getElementById(tipoArchivo === 'pesos' ? 'iborrainputfile1' : 'iborrainputfile2');
      if (!inputFile.files[0].name.includes('.txt')) {
        this.toastr.warning('Debe subir un archivo de texto plano (.txt)', '¡Advertencia!');
        inputFile.value = '';
        // tslint:disable-next-line:triple-equals
        fileName.innerHTML = tipoArchivo == 'pesos' ? 'Cargar Pesos' : 'Cargar Umbrales';
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
        this.pesosOptimos = this.simulacionService.getPesosOptimosFile(reader.result);
        if (!this.validaciones.checkPesos(this.pesosOptimos)) {
          fileHtml.value = '';
          fileName.innerHTML = 'Cargar Pesos';
        }
        this.mostrarContenidoPesosOptimos();
        this.crearEntradasYSalidas();
      } else {
        this.umbrales = this.simulacionService.getUmbralesFile(reader.result);
        if (!this.validaciones.checkUmbrales(this.umbrales)) {
          fileHtml.value = '';
          fileName.innerHTML = 'Cargar Umbrales';
        }
        this.mostrarContenidoUmbralesOptimos();
      }
      this.tipoDato = this.parametrosEntrenamientoService.getTipoDato();
    };
    reader.readAsText(inputFile, 'ISO-8859-1');
  }

  // Creción de valores de entrada y salida

  crearEntradasYSalidas() {
    this.numeroEntradas = this.pesosOptimos.filas.length;
    this.numeroSalidas = this.pesosOptimos.filas[0].columnas.length;
    this.entradas = this.simulacionService.getListValores(this.numeroEntradas);
    this.salidasRed = this.simulacionService.getListValores(this.numeroSalidas);
  }

  // Visualizacion del contenido de los parametros de entrada y de los pesos sinapticos

  mostrarContenidoPesosOptimos() {
    this.displayedColumnsPesosOptimos = this.pesosOptimos.encabezados;
    this.dataSourcePesosOptimos = new MatTableDataSource<Fila>(this.pesosOptimos.filas);
    this.dataSourcePesosOptimos.paginator = this.paginatorPesosOptimos;
    this.dataSourcePesosOptimos.sort = this.sortPesosOptimos;
  }

  mostrarContenidoUmbralesOptimos() {
    this.displayedColumnsUmbralesOptimos = this.umbrales.encabezados;
    this.dataSourceUmbralesOptimos = new MatTableDataSource<Umbrales>([this.umbrales]);
    this.dataSourceUmbralesOptimos.paginator = this.paginatorPesosOptimos;
    this.dataSourceUmbralesOptimos.sort = this.sortPesosOptimos;
  }

  // Operaciones de los slide toggles de la funcion de activacion

  toggleBinario(event) {
    if (event) { this.checkBipolar = false; }
    this.tipoDato = 'binario';
  }

  toggleBipolar(event) {
    if (event) { this.checkBinario = false; }
    this.tipoDato = 'bipolar';
  }

  // Operaciones de los slide toggles de los pesos sinapticos

  toggleArchivos(event) {
    if (this.errorCheckFile) { event.source.checked = true; }
    switch (event.source.checked) {
      case true:
        this.cargueArchivoListo();
        break;
      case false:
        if (!this.errorCheckFile) { this.reiniciarPesosYUmbrales(); }
        this.deshabilitarCargueArchivos();
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
        this.reiniciarEntradasYSalidas();
        break;
    }
  }

  // Validación de toggle anterior

  isValidToggleEntrenamientoAnterior(event): boolean {
    const data = this.parametrosEntrenamientoService.getPesosYUmbralesOptimos();
    this.pesosOptimos = data ? data.pesosOptimos : new MatrizPesosSinapticos();
    this.umbrales = data ? data.umbrales : new Umbrales();
    this.obtenerTipoDato();
    if (!data) {
      this.messageToggle(event, 'anterior', 'error', 'No existen pesos o umbrales en almacenamiento local');
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
      case 'file':
        this.deshabilitarCargueArchivos();
        this.errorCheckFile = true;
        break;
    }
    if (type === 'error') { this.toastr.error(message, '¡Oh no!'); } else if (type === 'warning') { this.toastr.warning(message, '¡Advertencia!'); }
  }

  // Operaciones de reinicio de valores

  reiniciarPesosYUmbrales() {
    this.pesosOptimos = new MatrizPesosSinapticos();
    this.mostrarContenidoPesosOptimos();
    this.umbrales = new Umbrales();
    this.mostrarContenidoUmbralesOptimos();
  }

  reiniciarSimulacion() {
    this.checkFile = false;
    this.checkPesosAnteriores = false;
    this.deshabilitarCargueArchivos();
    this.deshabilitarPesoAnterior();
    this.reiniciarPesosYUmbrales();
    this.reiniciarEntradasYSalidas();
  }

  reiniciarEntradasYSalidas() {
    this.entradas = [];
    this.salidasRed = [];
    this.numeroEntradas = 0;
    this.numeroSalidas = 0;
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
    this.reiniciarEntradasYSalidas();
  }

  deshabilitarPesoAnterior() {
    this.spinnerAnteriorMode = 'determinate';
    this.spinnerAnteriorValue = 0;
    this.labelAnterior = 'Sin cargar';
  }

  entrenamientoAnteriorListo() {
    this.errorCheckAnterior = false;
    this.checkFile = false;
    this.deshabilitarCargueArchivos();
    this.mostrarContenidoPesosOptimos();
    this.mostrarContenidoUmbralesOptimos();
    this.crearEntradasYSalidas();
    this.spinnerAnteriorMode = 'determinate';
    this.spinnerAnteriorValue = 100;
    this.labelAnterior = '¡Listo!';
  }

  cargueArchivoListo() {
    this.errorCheckFile = false;
    this.checkPesosAnteriores = false;
    this.disabledFile = false;
    this.deshabilitarPesoAnterior();
    this.reiniciarPesosYUmbrales();
  }

  // Operaciones de eliminación y simulación

  deletePesosYUmbrales() {
    this.parametrosEntrenamientoService.deletePesosOptimosYUmbrales();
  }

  simular() {
    if (!this.validaciones.checkPesosYUmbrales(this.pesosOptimos, this.umbrales)) {
      this.toastr.warning('Verifique el cargue de pesos y umbrales');
      return;
    }
    if (this.entradas.length === 0) {
      this.toastr.warning('Verifique los valores de las entradas');
      return;
    }
    if (!this.validaciones.checkAlgoritmTraining(this.checkBinario, this.checkBipolar)) {
      this.toastr.warning('Verifique la configuración del tipo de dato');
      return;
    }
    const salidasRed = this.simulacionService.simular(
      this.entradas,
      this.salidasRed.length,
      this.pesosOptimos,
      this.umbrales,
      this.tipoDato
    );
    this.salidasRed = salidasRed ? salidasRed : this.salidasRed;
  }

  // Obtencion de configuracion

  obtenerTipoDato() {
    switch (this.parametrosEntrenamientoService.getTipoDato()) {
      case 'binario':
        this.checkBinario = true;
        this.checkBipolar = false;
        break;
      case 'bipolar':
        this.checkBipolar = true;
        this.checkBinario = false;
        break;
      default:
        this.checkBipolar = false;
        this.checkBinario = false;
        break;
    }
  }
}
