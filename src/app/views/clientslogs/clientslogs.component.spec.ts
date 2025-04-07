import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientslogsComponent } from './clientslogs.component';

describe('ClientslogsComponent', () => {
  let component: ClientslogsComponent;
  let fixture: ComponentFixture<ClientslogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientslogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientslogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
