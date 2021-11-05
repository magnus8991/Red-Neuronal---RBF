import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPesosYUmbralesComponent } from './step-pesos-y-umbrales.component';

describe('StepPesosYUmbralesComponent', () => {
  let component: StepPesosYUmbralesComponent;
  let fixture: ComponentFixture<StepPesosYUmbralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPesosYUmbralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPesosYUmbralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
