import { TestBed } from '@angular/core/testing';

import { AdsShopFormService } from './ads-shop-form.service';

describe('AdsShopFormService', () => {
  let service: AdsShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
