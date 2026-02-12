import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stakeholders } from './stakeholders';

describe('Stakeholders', () => {
  let component: Stakeholders;
  let fixture: ComponentFixture<Stakeholders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stakeholders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stakeholders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
