import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickFormComponent } from './pick-form.component';

describe('PickFormComponent', () => {
  let component: PickFormComponent;
  let fixture: ComponentFixture<PickFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
