import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SaveDataqueryModalComponent } from './save-dataquery-modal.component'

describe.skip('SaveFileModalComponent', () => {
  let component: SaveDataqueryModalComponent
  let fixture: ComponentFixture<SaveDataqueryModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveDataqueryModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SaveDataqueryModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
