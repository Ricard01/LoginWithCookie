import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { facturasResolver } from './facturas.resolver';

describe('facturasResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => facturasResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
