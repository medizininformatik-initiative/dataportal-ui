import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReferenceCriteriaBoxComponent } from './reference-criteria-box.component'

describe.skip('ReferenceCriteriaBoxComponent', () => {
  let component: ReferenceCriteriaBoxComponent
  let fixture: ComponentFixture<ReferenceCriteriaBoxComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceCriteriaBoxComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ReferenceCriteriaBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
