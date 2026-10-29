import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AttributeFilterComponent } from './attribute-filter.component'

describe.skip('AttributeFilterComponent', () => {
  let component: AttributeFilterComponent
  let fixture: ComponentFixture<AttributeFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttributeFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AttributeFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
