import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesRicardoComponent } from './comisiones-ricardo.component';

describe('ComisionesRicardoComponent', () => {
  let component: ComisionesRicardoComponent;
  let fixture: ComponentFixture<ComisionesRicardoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionesRicardoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComisionesRicardoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
