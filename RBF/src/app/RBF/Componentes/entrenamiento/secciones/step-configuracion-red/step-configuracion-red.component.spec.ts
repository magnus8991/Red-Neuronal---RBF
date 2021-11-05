import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepConfiguracionRedComponent } from './step-configuracion-red.component';

describe('StepConfiguracionRedComponent', () => {
  let component: StepConfiguracionRedComponent;
  let fixture: ComponentFixture<StepConfiguracionRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepConfiguracionRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepConfiguracionRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
