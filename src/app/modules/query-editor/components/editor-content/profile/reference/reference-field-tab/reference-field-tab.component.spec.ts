import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReferenceFieldTabComponent } from './reference-field-tab.component'

describe.skip('ReferenceFieldTabComponent', () => {
  let component: ReferenceFieldTabComponent
  let fixture: ComponentFixture<ReferenceFieldTabComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceFieldTabComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ReferenceFieldTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
