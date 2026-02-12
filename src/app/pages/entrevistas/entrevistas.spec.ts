import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entrevistas } from './entrevistas';

describe('Entrevistas', () => {
  let component: Entrevistas;
  let fixture: ComponentFixture<Entrevistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entrevistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entrevistas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
