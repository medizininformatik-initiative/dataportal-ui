import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'
import { ComponentRef } from '@angular/core'
import { ProfileReferenceTileComponent } from './profile-reference-tile.component'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { MenuProfileReference } from '../../service/Menu/DataSelection/MenuProfileReference.service'
import { MenuProfileReferenceFunctionsService } from '../../service/Menu/DataSelection/MenuProfileReferenceFunctions.service'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'

describe('ProfileReferenceTileComponent', () => {
  let component: ProfileReferenceTileComponent
  let componentRef: ComponentRef<ProfileReferenceTileComponent>
  let fixture: ComponentFixture<ProfileReferenceTileComponent>
  let profilesSubject: BehaviorSubject<DataSelectionProfile[]>

  const mockDisplay = new Display([], 'test-display')
  const mockReferenceField = new ReferenceField('elem-1', mockDisplay, mockDisplay)

  const buildSelectedReferenceField = (linkedProfileIds: string[]) =>
    new SelectedReferenceField(mockReferenceField, linkedProfileIds, false)

  const buildProfile = (id: string, label?: Display): DataSelectionProfile =>
    ({ getId: () => id, getLabel: () => label } as unknown as DataSelectionProfile)

  beforeEach(async () => {
    profilesSubject = new BehaviorSubject<DataSelectionProfile[]>([])

    await TestBed.configureTestingModule({
      imports: [ProfileReferenceTileComponent, TranslateModule.forRoot(), FontAwesomeTestingModule],
      providers: [
        {
          provide: ProfileProviderService,
          useValue: {
            getAll: () => profilesSubject.asObservable(),
            getOne: (id: string) => {
              const found = profilesSubject.getValue().find((p) => p.getId() === id)
              if (!found) throw new Error(`Entity with id ${id} not found.`)
              return found
            },
          },
        },
        {
          provide: MenuProfileReference,
          useValue: { getMenuItems: jest.fn().mockReturnValue([]) },
        },
        {
          provide: MenuProfileReferenceFunctionsService,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: DataSelectionProviderService,
          useValue: { setProfileInActiveDataSelection: jest.fn() },
        },
      ],
    })
      .overrideComponent(ProfileReferenceTileComponent, { set: { template: '' } })
      .compileComponents()

    profilesSubject = new BehaviorSubject<DataSelectionProfile[]>([])
  })

  const createComponent = (linkedProfileIds: string[]) => {
    fixture = TestBed.createComponent(ProfileReferenceTileComponent)
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('referenceField', buildSelectedReferenceField(linkedProfileIds))
    componentRef.setInput('parentId', 'parent-1')
  }

  describe('race condition: profile not yet in provider on init', () => {
    it('should not crash when linked profile is missing on first render', () => {
      createComponent(['profile-id-1'])

      // Profile not in provider yet — this would previously throw GENERIC_ERROR
      expect(() => fixture.detectChanges()).not.toThrow()
    })

    it('should have chip with no profile data when linked profile is missing on init', () => {
      createComponent(['profile-id-1'])
      fixture.detectChanges()

      // Chip group exists for the reference field, but data is empty (profile not in provider yet)
      expect(component.filterChips).toHaveLength(1)
      expect(component.filterChips[0].data).toHaveLength(0)
    })

    it('should populate chip data once the missing profile arrives in the provider', () => {
      createComponent(['profile-id-1'])
      fixture.detectChanges()

      expect(component.filterChips[0].data).toHaveLength(0)

      // Simulate profile arriving in the provider after upload completes
      profilesSubject.next([buildProfile('profile-id-1', new Display([], 'Patient'))])
      fixture.detectChanges()

      expect(component.filterChips[0].data).toHaveLength(1)
    })

    it('should unsubscribe on destroy and not recompute after component is gone', () => {
      createComponent(['profile-id-1'])
      fixture.detectChanges()

      const chipsBefore = component.filterChips.length
      fixture.destroy()

      profilesSubject.next([buildProfile('profile-id-1')])

      // filterChips should not have changed after destroy
      expect(component.filterChips.length).toBe(chipsBefore)
    })
  })
})
