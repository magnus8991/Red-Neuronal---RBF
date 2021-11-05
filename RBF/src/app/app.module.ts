import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EntrenamientoComponent } from './PerceptronMulticapa/Componentes/entrenamiento/entrenamiento.component';
import { SimulacionComponent } from './PerceptronMulticapa/Componentes/simulación/simulacion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametrosEntrenamientoService } from './PerceptronMulticapa/Servicios/parametrosEntrenamiento.service';
import { SimulacionService } from './PerceptronMulticapa/Servicios/simulacion.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { EntrenamientoService } from './PerceptronMulticapa/Servicios/entrenamiento.service';
import { StepEntradasComponent } from './PerceptronMulticapa/Componentes/entrenamiento/secciones/step-entradas/step-entradas.component';
import { StepPesosYUmbralesComponent } from './PerceptronMulticapa/Componentes/entrenamiento/secciones/step-pesos-y-umbrales/step-pesos-y-umbrales.component';
import { StepEntrenamientoComponent } from './PerceptronMulticapa/Componentes/entrenamiento/secciones/step-entrenamiento/step-entrenamiento.component';
import { StepConfiguracionRedComponent } from './PerceptronMulticapa/Componentes/entrenamiento/secciones/step-configuracion-red/step-configuracion-red.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavMenuComponent,
    FooterComponent,
    HomeComponent,
    EntrenamientoComponent,
    SimulacionComponent,
    StepEntradasComponent,
    StepPesosYUmbralesComponent,
    StepEntrenamientoComponent,
    StepConfiguracionRedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-top-right'
    }),
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  providers: [ ParametrosEntrenamientoService, SimulacionService, EntrenamientoService, ToastrService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
