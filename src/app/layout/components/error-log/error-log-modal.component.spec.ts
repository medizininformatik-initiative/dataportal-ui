import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroLogComponent } from './error-log-modal.component';

describe('ErroLogComponent', () => {
  let component: ErroLogComponent;
  let fixture: ComponentFixture<ErroLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErroLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErroLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
