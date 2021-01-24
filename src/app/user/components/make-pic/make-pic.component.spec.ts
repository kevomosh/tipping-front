import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePicComponent } from './make-pic.component';

describe('MakePicComponent', () => {
  let component: MakePicComponent;
  let fixture: ComponentFixture<MakePicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakePicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
