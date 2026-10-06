import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'

import { SideMenuComponent } from './side-menu.component'
import { MaterialModule } from '../../material/material.module'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { OAuthService } from 'angular-oauth2-oidc'
import { DirectivesModule } from 'src/app/shared/directives/directives.module'
import { RoleGuard } from '../../../core/auth/guards/role.guard'
import { FeatureService } from '../../../service/Feature.service'

describe.skip('SideMenuComponent', () => {
  let component: SideMenuComponent
  let fixture: ComponentFixture<SideMenuComponent>

  const authService = {
    logOut: () => {},
    loadUserProfile: () => Promise.resolve({}),
  } as OAuthService

  beforeEach(async () => {
    const featureService = {
      useFeatureOptionsPage: (): boolean => true,
      getRoles: (site: string): string[] => ['test'],
    } as FeatureService

    await TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      imports: [
        FontAwesomeTestingModule,
        MaterialModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        DirectivesModule,
      ],
      providers: [
        {
          provide: FeatureService,
          useValue: featureService,
        },
        {
          provide: OAuthService,
          useValue: authService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent)
    component = fixture.componentInstance
    jest.spyOn(component.toggleSideMenu, 'emit')
    jest.spyOn(authService, 'logOut').mockImplementation(() => Promise.resolve())
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('Calls emit on toggleSideMenu when menu item is clicked', () => {
    component.mainNavItems = [
      {
        icon: 'test',
        routeTo: '/test',
        translationKey: 'test',
      },
    ]
    fixture.detectChanges()
    const nativeElement = fixture.debugElement.nativeElement
    const button = nativeElement.querySelector('.mat-mdc-list-item')
    button.click()
    expect(component.toggleSideMenu.emit).toHaveBeenCalled()
  })

  it('should merge roles from mainNavItem and corresponding route', () => {
    component.mainNavItems = [
      {
        icon: 'test',
        routeTo: '/test',
        translationKey: 'test',
        roles: ['test-role1'],
      },
    ]
    component.routes = [
      {
        path: '/test_second',
        canLoad: [RoleGuard],
        data: {
          navId: 'test_second',
          roles: ['test-role_second'],
        },
      },
      {
        path: '/test',
        canLoad: [RoleGuard],
        data: {
          navId: 'test',
          roles: ['test-role2'],
        },
      },
    ]
    fixture.detectChanges()
    const nativeElement = fixture.debugElement.nativeElement
    const button = nativeElement.querySelector('.mat-mdc-list-item')
    button.click()
    expect(component.mainNavItems[0].roles).toEqual(['test-role1', 'test-role2'])
  })

  it('Calls logout function when logout button is clicked', () => {
    component.mainNavItems = null
    component.secondaryNavItems = [
      {
        icon: 'test',
        routeTo: '#logout',
        translationKey: 'test',
      },
    ]
    fixture.detectChanges()
    const nativeElement = fixture.debugElement.nativeElement
    const button = nativeElement.querySelector('.mat-mdc-list-item')
    button.click()
    fixture.detectChanges()
    expect(authService.logOut).toHaveBeenCalled()
  })
})
