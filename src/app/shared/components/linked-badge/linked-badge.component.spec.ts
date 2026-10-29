import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LinkedBadgeComponent } from './linked-badge.component'

describe.skip('LinkedBadgeComponent', () => {
  let component: LinkedBadgeComponent
  let fixture: ComponentFixture<LinkedBadgeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkedBadgeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LinkedBadgeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
