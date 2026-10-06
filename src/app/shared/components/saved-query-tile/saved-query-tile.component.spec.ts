import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SavedQueryTileComponent } from './saved-query-tile.component'

describe.skip('SavedQueryTileComponent', () => {
  let component: SavedQueryTileComponent
  let fixture: ComponentFixture<SavedQueryTileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedQueryTileComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SavedQueryTileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
