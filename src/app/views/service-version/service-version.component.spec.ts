import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceVersionComponent } from './service-version.component';

describe('ServiceVersionComponent', () => {
  let component: ServiceVersionComponent;
  let fixture: ComponentFixture<ServiceVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceVersionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
