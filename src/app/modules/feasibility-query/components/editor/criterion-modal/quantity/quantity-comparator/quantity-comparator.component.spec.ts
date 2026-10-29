import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuantityComparatorComponent } from './quantity-comparator.component'

describe.skip('QuantityComparatorComponent', () => {
  let component: QuantityComparatorComponent
  let fixture: ComponentFixture<QuantityComparatorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantityComparatorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(QuantityComparatorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
