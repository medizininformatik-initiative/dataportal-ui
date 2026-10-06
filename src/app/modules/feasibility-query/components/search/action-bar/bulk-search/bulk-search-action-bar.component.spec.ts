import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BulkSearchActionBarComponent } from './bulk-search-action-bar.component'

describe.skip('BulkSearchActionBarComponent', () => {
  let component: BulkSearchActionBarComponent
  let fixture: ComponentFixture<BulkSearchActionBarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkSearchActionBarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BulkSearchActionBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
