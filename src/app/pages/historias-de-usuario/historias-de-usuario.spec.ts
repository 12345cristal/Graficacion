import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasDeUsuario } from './historias-de-usuario';

describe('HistoriasDeUsuario', () => {
  let component: HistoriasDeUsuario;
  let fixture: ComponentFixture<HistoriasDeUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasDeUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriasDeUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
