import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BetweenFilterComponent } from './between-filter.component'

describe.skip('BetweenFilterComponent', () => {
  let component: BetweenFilterComponent
  let fixture: ComponentFixture<BetweenFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BetweenFilterComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BetweenFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
