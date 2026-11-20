import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { BreadcrumbComponent } from './breadcrumbs.component'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent
  let fixture: ComponentFixture<BreadcrumbComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: CriterionProviderService, useValue: { getOne: () => undefined } },
        { provide: ProfileProviderService, useValue: { getOne: () => undefined } },
        { provide: ReferenceCriterionProviderService, useValue: { getOne: () => undefined } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(BreadcrumbComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('leads a bare base path to its default child', () => {
    expect(component.targetOf('/feasibility-query')).toBe('/feasibility-query/search')
  })

  it('keeps a deeper url as its own target', () => {
    expect(component.targetOf('/feasibility-query/overview')).toBe('/feasibility-query/overview')
  })

  it('keeps an unknown base path', () => {
    expect(component.targetOf('/unknown')).toBe('/unknown')
  })
})
