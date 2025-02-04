import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesListComponent } from './comisiones-list.component';

describe('ComisionesListComponent', () => {
  let component: ComisionesListComponent;
  let fixture: ComponentFixture<ComisionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComisionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
