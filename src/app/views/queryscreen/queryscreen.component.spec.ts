import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryscreenComponent } from './queryscreen.component';

describe('QueryscreenComponent', () => {
  let component: QueryscreenComponent;
  let fixture: ComponentFixture<QueryscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
