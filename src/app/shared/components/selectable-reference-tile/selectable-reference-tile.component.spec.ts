import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectableReferenceTileComponent } from './selectable-reference-tile.component'

describe.skip('SelectableReferenceTileComponent', () => {
  let component: SelectableReferenceTileComponent
  let fixture: ComponentFixture<SelectableReferenceTileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectableReferenceTileComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SelectableReferenceTileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
