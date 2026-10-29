import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SaveFileModalComponent } from './save-file-modal.component'

describe.skip('SaveFileModalComponent', () => {
  let component: SaveFileModalComponent
  let fixture: ComponentFixture<SaveFileModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveFileModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SaveFileModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
