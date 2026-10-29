import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CriteriaStageComponent } from './criteria-stage.component'

describe.skip('CriteriaComponent', () => {
  let component: CriteriaStageComponent
  let fixture: ComponentFixture<CriteriaStageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriteriaStageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CriteriaStageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
