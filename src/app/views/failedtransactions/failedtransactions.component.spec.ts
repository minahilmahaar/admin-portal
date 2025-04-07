import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedtransactionsComponent } from './failedtransactions.component';

describe('FailedtransactionsComponent', () => {
  let component: FailedtransactionsComponent;
  let fixture: ComponentFixture<FailedtransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedtransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedtransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
