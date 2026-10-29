import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ListItemDetailsSectionsComponent } from './list-item-details-sections.component'

describe.skip('ListItemDetailsSectionsComponent', () => {
  let component: ListItemDetailsSectionsComponent
  let fixture: ComponentFixture<ListItemDetailsSectionsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemDetailsSectionsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ListItemDetailsSectionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
