import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observaciones } from './observaciones';

describe('Observaciones', () => {
  let component: Observaciones;
  let fixture: ComponentFixture<Observaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Observaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Observaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
