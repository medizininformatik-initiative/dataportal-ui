import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResultComponent } from './result/result.component'

describe.skip('ResultComponent', () => {
  let component: ResultComponent
  let fixture: ComponentFixture<ResultComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ResultComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
