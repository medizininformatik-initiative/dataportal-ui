/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { FilterTabsComponent } from './filter-tabs.component'

describe.skip('FilterTabsComponent', () => {
  let component: FilterTabsComponent
  let fixture: ComponentFixture<FilterTabsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTabsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTabsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
