import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctosListComponent } from './doctos-list.component';

describe('DoctosListComponent', () => {
  let component: DoctosListComponent;
  let fixture: ComponentFixture<DoctosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
