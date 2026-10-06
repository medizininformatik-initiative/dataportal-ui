import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResultDetailModalComponent } from './result-detail-modal.component'

describe.skip('ResultDetailModalComponent', () => {
  let component: ResultDetailModalComponent
  let fixture: ComponentFixture<ResultDetailModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultDetailModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ResultDetailModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
