import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasListComponent } from './facturas-list.component';

describe('FacturasListComponent', () => {
  let component: FacturasListComponent;
  let fixture: ComponentFixture<FacturasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
