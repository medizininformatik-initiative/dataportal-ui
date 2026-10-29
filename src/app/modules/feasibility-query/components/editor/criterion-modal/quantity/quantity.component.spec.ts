import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuantityComponent } from './quantity.component'

describe.skip('QuantityComponent', () => {
  let component: QuantityComponent
  let fixture: ComponentFixture<QuantityComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantityComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(QuantityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
