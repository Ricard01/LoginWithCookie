import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesAngieComponent } from './comisiones-angie.component';

describe('ComisionesAngieComponent', () => {
  let component: ComisionesAngieComponent;
  let fixture: ComponentFixture<ComisionesAngieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionesAngieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComisionesAngieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
