import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CriteriaBoxComponent } from './criteria-box.component'

describe.skip('CriteriaBoxComponent', () => {
  let component: CriteriaBoxComponent
  let fixture: ComponentFixture<CriteriaBoxComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriteriaBoxComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CriteriaBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
