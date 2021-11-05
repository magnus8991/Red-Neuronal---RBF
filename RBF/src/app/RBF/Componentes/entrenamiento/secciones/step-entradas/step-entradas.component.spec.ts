import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEntradasComponent } from './step-entradas.component';

describe('StepEntradasComponent', () => {
  let component: StepEntradasComponent;
  let fixture: ComponentFixture<StepEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepEntradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
