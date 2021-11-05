import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionRed } from 'src/app/PerceptronMulticapa/Modelos/configuracionRed';
import { Fila } from 'src/app/PerceptronMulticapa/Modelos/fila';
import { Grafica } from 'src/app/PerceptronMulticapa/Modelos/grafica';
import { MatrizPesosSinapticos } from 'src/app/PerceptronMulticapa/Modelos/matrizPesosSinapticos';
import { ParametrosEntrada } from 'src/app/PerceptronMulticapa/Modelos/parametrosEntrada';
import { TablaErroresRMS } from 'src/app/PerceptronMulticapa/Modelos/tablaErroresRms';
import { Umbrales } from 'src/app/PerceptronMulticapa/Modelos/umbrales';
import { EntrenamientoService } from 'src/app/PerceptronMulticapa/Servicios/entrenamiento.service';
import { ParametrosEntrenamientoService } from 'src/app/PerceptronMulticapa/Servicios/parametrosEntrenamiento.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'step-entrenamiento',
  templateUrl: './step-entrenamiento.component.html',
  styleUrls: ['./step-entrenamiento.component.css']
})
export class StepEntrenamientoComponent implements OnInit, AfterViewInit {
  dataSourcePesosOptimos: MatTableDataSource<Fila>;
  dataSourceUmbralesOptimos: MatTableDataSource<Umbrales>;
  dataSourceErrores: MatTableDataSource<TablaErroresRMS>;
  tablaErroresRMS: TablaErroresRMS[] = [];
  displayedColumnsPesosOptimos: string[];
  displayedColumnsUmbralesOptimos: string[];
  displayedColumnsErrores: string[] = ['No. Iteración', 'Error RMS'];
  @ViewChild('paginatorPesosOptimos') paginatorPesosOptimos: MatPaginator;
  @ViewChild('sortPesosOptimos') sortPesosOptimos: MatSort;
  @ViewChild('paginatorUmbralesOptimos') paginatorUmbralesOptimos: MatPaginator;
  @ViewChild('sortUmbralesOptimos') sortUmbralesOptimos: MatSort;
  @ViewChild('paginatorErrores') paginatorErrores: MatPaginator;
  @ViewChild('sortErrores') sortErrores: MatSort;
  redEntrenada = false;
  graficaErrores: Grafica;
  graficaSalidas: Grafica;
  erroresRMS: number[] = [];
  erroresMaximosPermitidos: number[] = [];
  numerosIteraciones: number[] = [];
  salidasDeseadas: any[] = [];
  salidasRed: any[] = [];
  pesosOptimos: MatrizPesosSinapticos;
  umbrales: Umbrales;
  pesosAnteriores: MatrizPesosSinapticos;
  umbralesAnteriores: Umbrales;
  @Output() reloadTraining = new EventEmitter<unknown>();
  @Output() trainingNetwork = new EventEmitter<unknown>();
  @Output() saveWeightAndUmbrals = new EventEmitter<unknown>();

  constructor(private parametrosEntrenamientoService: ParametrosEntrenamientoService,
    private entrenamientoService: EntrenamientoService,
    private toastr: ToastrService) {
    for (let i = 0; i < 5; i++) { this.tablaErroresRMS.push(new TablaErroresRMS(i + 1, 'N/A')); }
  }

  ngAfterViewInit() {
    this.dataSourcePesosOptimos.paginator = this.paginatorPesosOptimos;
    this.dataSourcePesosOptimos.sort = this.sortPesosOptimos;
    this.dataSourceUmbralesOptimos.paginator = this.paginatorUmbralesOptimos;
    this.dataSourceUmbralesOptimos.sort = this.sortUmbralesOptimos;
    this.dataSourceErrores.paginator = this.paginatorErrores;
    this.dataSourceErrores.sort = this.sortErrores;
    this.graficaErrores = new Grafica(document.getElementById('chartErrores'), 'Error RMS vs Error Máximo Permitido',
      ['Error RMS', 'Error Máximo Permitido'], [this.erroresRMS, this.erroresMaximosPermitidos], this.numerosIteraciones);
    this.graficaSalidas = new Grafica(document.getElementById('chartSalidas'), 'Salida deseada (YD) vs Salida de la red (YR) -- Última iteración',
      ['YD', 'YR'], [this.salidasDeseadas, this.salidasRed], []);
    this.actualizarGraficaSalidasDeseadas();
  }

  ngOnInit() {
    this.pesosOptimos = new MatrizPesosSinapticos();
    this.umbrales = new Umbrales();
    this.mostrarContenidoPesosOptimos();
    this.mostrarContenidoUmbralesOptimos();
    this.mostrarContenidoErrores();
  }

  // Visualizacion del contenido

  mostrarContenidoPesosOptimos() {
    this.displayedColumnsPesosOptimos = this.pesosOptimos.encabezados;
    this.dataSourcePesosOptimos = new MatTableDataSource<Fila>(this.pesosOptimos.filas);
    this.dataSourcePesosOptimos.paginator = this.paginatorPesosOptimos;
    this.dataSourcePesosOptimos.sort = this.sortPesosOptimos;
  }

  mostrarContenidoUmbralesOptimos() {
    this.displayedColumnsUmbralesOptimos = this.umbrales.encabezados;
    this.dataSourceUmbralesOptimos = new MatTableDataSource<Umbrales>([this.umbrales]);
    this.dataSourceUmbralesOptimos.paginator = this.paginatorUmbralesOptimos;
    this.dataSourceUmbralesOptimos.sort = this.sortUmbralesOptimos;
  }

  mostrarContenidoErrores() {
    this.dataSourceErrores = new MatTableDataSource<TablaErroresRMS>(this.tablaErroresRMS);
    this.dataSourceErrores.paginator = this.paginatorErrores;
    this.dataSourceErrores.sort = this.sortErrores;
  }

  // Operaciones de reinicio de valores

  reiniciarEntrenamiento() {
    this.reloadTraining.emit();
  }

  reiniciarStepEntrenamiento() {
    this.reiniciarMatrizDePesos();
    this.reiniciarVectorDeUmbrales();
    this.reiniciarMatrizDeErrores();
    this.reiniciarGraficas();
    this.redEntrenada = false;
  }

  reiniciarMatrizDePesos() {
    this.pesosOptimos = new MatrizPesosSinapticos();
    this.mostrarContenidoPesosOptimos();
  }

  reiniciarVectorDeUmbrales() {
    this.umbrales = new Umbrales();
    this.mostrarContenidoUmbralesOptimos();
  }

  reiniciarMatrizDeErrores() {
    this.tablaErroresRMS = [];
    for (let i = 0; i < 5; i++) { this.tablaErroresRMS.push(new TablaErroresRMS(i + 1, 'N/A')); }
    this.mostrarContenidoErrores();
  }

  // Operaciones de entrenamiento de la red neuronal

  entrenar(ConfigYParamsTraining, parametrosEntrada: ParametrosEntrada, configuracionRed: ConfiguracionRed) {
    let indiceIteraciones = 1;
    const rataDinamica = 0;
    this.inicializarValores();
    while (indiceIteraciones <= ConfigYParamsTraining.numeroIteraciones) {
      const erroresPatrones = this.calcularErroresVariosYSalidasRed(
        parametrosEntrada,
        rataDinamica,
        ConfigYParamsTraining,
        indiceIteraciones
      );
      const errorRMS = this.entrenamientoService.errorRMS(erroresPatrones);
      this.tablaErroresRMS.push(new TablaErroresRMS(indiceIteraciones, errorRMS));
      this.actualizarGraficaErrores(indiceIteraciones, errorRMS, ConfigYParamsTraining.errorMaximoPermitido);
      this.actualizarGraficaSalidas(parametrosEntrada.numeroSalidas, parametrosEntrada.numeroPatrones);
      this.mostrarContenidoErrores();
      indiceIteraciones = this.tablaErroresRMS[indiceIteraciones - 1].error <= ConfigYParamsTraining.errorMaximoPermitido ?
        ConfigYParamsTraining.numeroIteraciones + 1 : indiceIteraciones + 1;
    }
    this.redEntrenada = true;
    this.toastr.info('La red neuronal ha sido entrenada correctamente', '¡Enhorabuena!');
  }

  inicializarValores() {
    this.tablaErroresRMS = [];
    this.numerosIteraciones = [];
    this.erroresMaximosPermitidos = [];
    this.erroresRMS = [];
    this.pesosOptimos = this.parametrosEntrenamientoService.getPesosSinapticos();
    this.umbrales = this.parametrosEntrenamientoService.getUmbrales();
    this.inicializarPesosYUmbralesAnteriores();
  }

  calcularErroresVariosYSalidasRed(parametrosEntrada: ParametrosEntrada, rataDinamica: number, ConfigYParamsTraining,
    indiceIteraciones: number) {
    rataDinamica = 1 / indiceIteraciones;
    this.salidasRed = this.entrenamientoService.getInitSalidasRed(parametrosEntrada.numeroSalidas);
    const erroresPatrones: number[] = [];
    let indicePatron = 0;
    parametrosEntrada.patrones.forEach(patron => {
      const erroresYSalidaRed = this.entrenamientoService.calcularErroresLineales(parametrosEntrada, this.pesosOptimos,
        this.umbrales, patron);
      const erroresLineales = erroresYSalidaRed.erroresLineales;
      for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) { this.salidasRed[i].push(erroresYSalidaRed.salidas[i]); }
      const errorPatron = this.entrenamientoService.errorPatron(erroresLineales, parametrosEntrada.numeroSalidas);
      erroresPatrones.push(errorPatron);
      const pesosYUmbrales = {
        pesosOptimos: this.pesosOptimos, pesosAnteriores: this.pesosAnteriores, umbrales: this.umbrales,
        umbralesAnteriores: this.umbralesAnteriores
      };
      const pesosYUmbralesOptimos = this.entrenamientoService.obtenerPesosYUmbralesNuevos(parametrosEntrada, pesosYUmbrales,
        ConfigYParamsTraining.rataAprendizaje, rataDinamica, erroresLineales, patron.valores, ConfigYParamsTraining.checkDelta);
      this.pesosAnteriores = pesosYUmbralesOptimos.pesosAnteriores;
      this.umbralesAnteriores = pesosYUmbralesOptimos.umbralesAnteriores;
      this.pesosOptimos = pesosYUmbralesOptimos.pesosOptimos;
      this.umbrales = pesosYUmbralesOptimos.umbrales;
      this.mostrarContenidoPesosOptimos();
      this.mostrarContenidoUmbralesOptimos();
      indicePatron += 1;
    });
    return erroresPatrones;
  }

  inicializarPesosYUmbralesAnteriores() {
    debugger
    this.pesosAnteriores = this.entrenamientoService.clone(this.pesosOptimos);
    this.umbralesAnteriores = this.entrenamientoService.clone(this.umbrales);
    this.pesosAnteriores.filas.forEach(fila => {
      for (let i = 0; i < fila.columnas.length; i++) { fila.columnas[i] = 0; }
    });
    for (let i = 0; i < this.pesosAnteriores.filas[0].columnas.length; i++) this.umbralesAnteriores.valores[i] = 0;
  }

  entrenarEvent() {
    this.trainingNetwork.emit();
  }

  guardarPesosYUmbrales(tipoDato) {
    this.parametrosEntrenamientoService.postPesosOptimosYUmbrales(this.redEntrenada, this.pesosOptimos, this.umbrales, tipoDato);
  }

  guardarPesosYUmbralesEvent() {
    this.saveWeightAndUmbrals.emit();
  }

  exportarPesosOptimos() {
    this.parametrosEntrenamientoService.exportPesosYUmbralesOptimos(this.redEntrenada, this.pesosOptimos, 'pesos');
  }

  exportarUmbralesOptimos() {
    this.parametrosEntrenamientoService.exportPesosYUmbralesOptimos(this.redEntrenada, this.umbrales, 'umbrales');
  }

  eliminarPesosYUmbralesOptimos() {
    this.parametrosEntrenamientoService.deletePesosOptimosYUmbrales();
  }

  // Operaciones de las graficas

  reiniciarGraficas() {
    this.erroresRMS = [];
    this.erroresMaximosPermitidos = [];
    this.salidasDeseadas = [];
    this.salidasRed = [];
    this.graficaErrores.actualizarDatos(['Error RMS', 'Error Máximo Permitido'], [this.erroresRMS, this.erroresMaximosPermitidos]);
    this.graficaSalidas.actualizarDatosYCategorias(['YD', 'YR'], [this.salidasDeseadas, this.salidasRed], 0);
  }

  actualizarGraficaErrores(indiceIteraciones: number, errorRMS: number, errorMaximoPermitido: number) {
    this.numerosIteraciones.push(indiceIteraciones);
    this.erroresRMS.push(errorRMS);
    this.erroresMaximosPermitidos.push(errorMaximoPermitido);
    this.graficaErrores.actualizarDatos(['Error RMS', 'Error Máximo Permitido'], [this.erroresRMS, this.erroresMaximosPermitidos]);
  }

  actualizarGraficaSalidasDeseadas() {
    const data = this.parametrosEntrenamientoService.getParametrosEntrada();
    if (data) {
      this.salidasDeseadas = this.entrenamientoService.getSalidasDeseadas(data.patrones, data.numeroEntradas, data.numeroSalidas);
      this.salidasRed = this.entrenamientoService.getInitSalidasRed(data.numeroSalidas);
      this.actualizarGraficaSalidas(data.numeroSalidas, data.numeroPatrones);
    }
  }

  actualizarGraficaSalidas(numeroSalidas: number, numeroPatrones: number) {
    const salidasTotales: any[] = [];
    this.salidasDeseadas.forEach(salidaDeseada => {
      salidasTotales.push(salidaDeseada);
    });
    this.salidasRed.forEach(salidaRed => {
      salidasTotales.push(salidaRed);
    });
    this.graficaSalidas.actualizarDatosYCategorias(this.obtenerNombresSeries(numeroSalidas), salidasTotales, numeroPatrones);
  }

  obtenerNombresSeries(numeroSalidas: number): string[] {
    const series: string[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      series.push('YD' + (i + 1).toString());
    }
    for (let i = 0; i < numeroSalidas; i++) {
      series.push('YR' + (i + 1).toString());
    }
    return series;
  }
}
