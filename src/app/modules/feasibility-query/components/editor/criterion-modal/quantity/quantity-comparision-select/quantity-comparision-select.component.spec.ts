import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuantityComparisionSelectComponent } from './quantity-comparision-select.component'

describe.skip('QuantityComparisionSelectComponent', () => {
  let component: QuantityComparisionSelectComponent
  let fixture: ComponentFixture<QuantityComparisionSelectComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantityComparisionSelectComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(QuantityComparisionSelectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
