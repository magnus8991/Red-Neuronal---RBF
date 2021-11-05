import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEntrenamientoComponent } from './step-entrenamiento.component';

describe('StepEntrenamientoComponent', () => {
  let component: StepEntrenamientoComponent;
  let fixture: ComponentFixture<StepEntrenamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepEntrenamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEntrenamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
