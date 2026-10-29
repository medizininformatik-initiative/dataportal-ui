import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuantityRangeComponent } from './quantity-range.component'

describe.skip('QuantityRangeComponent', () => {
  let component: QuantityRangeComponent
  let fixture: ComponentFixture<QuantityRangeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantityRangeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(QuantityRangeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
