import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MissingFilterComponent } from './missing-filter.component'

describe('MissingFilterComponent', () => {
  let component: MissingFilterComponent
  let fixture: ComponentFixture<MissingFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MissingFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
