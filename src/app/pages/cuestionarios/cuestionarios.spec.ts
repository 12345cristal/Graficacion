import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuestionarios } from './cuestionarios';

describe('Cuestionarios', () => {
  let component: Cuestionarios;
  let fixture: ComponentFixture<Cuestionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuestionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cuestionarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
