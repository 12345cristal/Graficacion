import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusGroup } from './focus-group';

describe('FocusGroup', () => {
  let component: FocusGroup;
  let fixture: ComponentFixture<FocusGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
