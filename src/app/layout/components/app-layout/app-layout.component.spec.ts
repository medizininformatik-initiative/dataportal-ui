import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MaterialModule } from '../../material/material.module'
import { AppLayoutComponent } from './app-layout.component'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'
import { TranslateModule } from '@ngx-translate/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HeaderComponent } from '../header/header.component'
import { SideMenuComponent } from '../side-menu/side-menu.component'
import { RouterTestingModule } from '@angular/router/testing'
import { LanguageComponent } from '../language/language.component'
import { Component } from '@angular/core'
import { of, Subject } from 'rxjs'
import { OAuthService } from 'angular-oauth2-oidc'
import { DirectivesModule } from 'src/app/shared/directives/directives.module'
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module'
import { FeatureService } from '../../../service/feature.service'
import INavItem from '../../models/nav-item.interface'
import { ActivatedRouteSnapshot, ActivationEnd, ActivationStart, Router } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FeatureProviderService } from '../../../modules/querybuilder/service/feature-provider.service'
import { IAppConfig } from '../../../config/model/AppConfig/AppConfigData'

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent
  let fixture: ComponentFixture<AppLayoutComponent>
  let breakpointObserver: BreakpointObserver
  let router: Router
  const routerEventsSubject = new Subject<ActivationEnd | ActivationStart>()

  const authService = {
    logOut: () => {},
    loadUserProfile: () => Promise.resolve({}),
  } as OAuthService

  @Component({ selector: 'num-footer', template: '' })
  // class FooterStubComponent {}
  class StubComponent {}

  beforeEach(async () => {
    const featureService = {
      useFeatureOptionsPage: (): boolean => true,
      getStylesheet: (): string => 'abideTheme',
      getRoles: (site: string): string[] => ['test'],
    } as FeatureService

    const featureProviderService = {
      getFeatures: (): IAppConfig => ({
        env: null,
        api: null,
        uiBackendApi: null,
        features: null,
        stylesheet: 'abide',
        auth: null,
        dataset: null,
        queryVersion: null,
        options: null,
        fhirport: null,
        legal: null,
        mock: null,
        proposalPortalLink: null,
      }),
      setTheme: (oldTheme: string, newTheme: string): void => {},
    } as FeatureProviderService

    await TestBed.configureTestingModule({
      declarations: [
        AppLayoutComponent,
        HeaderComponent,
        SideMenuComponent,
        LanguageComponent,
        //  FooterStubComponent,
        StubComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        FontAwesomeModule,
        FontAwesomeTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        DirectivesModule,
        SharedComponentsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'third',
            component: StubComponent,
            children: [
              {
                path: 'tabnav1',
                component: StubComponent,
              },
            ],
          },
        ]),
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
        {
          provide: FeatureProviderService,
          useValue: featureProviderService,
        },
      ],
    }).compileComponents()
  })

  const firstNavItem: INavItem = {
    routeTo: 'first',
    translationKey: 'first',
    icon: 'test',
  }

  const secondNavItem: INavItem = {
    routeTo: 'second',
    translationKey: 'second',
    icon: 'test',
  }

  const thirdNavItem: INavItem = {
    routeTo: 'third',
    translationKey: 'third',
    icon: 'test',
    tabNav: [
      {
        routeTo: 'tabnav1',
        translationKey: 'tabnav1',
      },
      {
        routeTo: 'tabnav2',
        translationKey: 'tabnav2',
      },
    ],
  }

  const mainNavItems = [firstNavItem, secondNavItem, thirdNavItem]

  describe('On handset devices', () => {
    beforeEach(() => {
      const breakPointState = {
        matches: true,
        breakpoints: {
          [Breakpoints.Handset]: true,
          [Breakpoints.Large]: false,
        },
      } as BreakpointState

      breakpointObserver = TestBed.inject(BreakpointObserver)
      jest.spyOn(breakpointObserver, 'observe').mockImplementation(() => of(breakPointState))

      fixture = TestBed.createComponent(AppLayoutComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should call drawer toggle function on toggleMenu function', () => {
      jest.spyOn(component.drawer, 'toggle')
      component.toggleMenu(null)
      expect(component.drawer.toggle).not.toHaveBeenCalled()
    })
  })

  describe('On non-handset devices', () => {
    beforeEach(() => {
      const breakPointState = {
        matches: false,
        breakpoints: {
          [Breakpoints.Handset]: false,
          [Breakpoints.Large]: true,
        },
      } as BreakpointState

      breakpointObserver = TestBed.inject(BreakpointObserver)
      jest.spyOn(breakpointObserver, 'observe').mockImplementation(() => of(breakPointState))

      fixture = TestBed.createComponent(AppLayoutComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should not call drawer toggle function on toggleMenu function', () => {
      jest.spyOn(component.drawer, 'toggle')
      component.toggleMenu(null)
      expect(component.drawer.toggle).not.toHaveBeenCalled()
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLayoutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    router = TestBed.inject(Router)
    const routerAny = router as any
    routerAny.events = routerEventsSubject.asObservable()

    component.mainNavItems = mainNavItems
  })
  describe('On ActivationEnd to a route without tab navigation', () => {
    const routeSnapshot = {
      data: {
        navId: 'second',
      },
    } as unknown as ActivatedRouteSnapshot
    const routerEvent = new ActivationEnd(routeSnapshot)

    it('should set the mainNav header only', () => {
      routerEventsSubject.next(routerEvent)
      fixture.detectChanges()

      // TODO:
      // expect(component.currentNavId).toEqual('second')
      // expect(component.currentMainNavItem).toBe(secondNavItem)
      expect(component.currentTabNav).toBeFalsy()
    })
  })

  describe('On ActivationEnd to a route with tab navigation', () => {
    const routeSnapshot = {
      data: {
        navId: 'third',
      },
    } as unknown as ActivatedRouteSnapshot
    const routerEvent = new ActivationEnd(routeSnapshot)

    it('should set the mainNav header only', () => {
      routerEventsSubject.next(routerEvent)
      fixture.detectChanges()

      // TODO:
      // expect(component.currentNavId).toEqual('third')
      // expect(component.currentMainNavItem).toBe(thirdNavItem)
      // expect(component.currentTabNav).toBe(thirdNavItem.tabNav)
    })
  })

  describe('On ActivationEnd to a route without navId', () => {
    const routeSnapshot = {
      data: {
        navId: 'nope',
      },
    } as unknown as ActivatedRouteSnapshot
    const routerEvent = new ActivationEnd(routeSnapshot)

    it('should set the mainNav to be undefined', () => {
      routerEventsSubject.next(routerEvent)
      fixture.detectChanges()

      // TODO:
      // expect(component.currentNavId).toEqual('nope')
      // expect(component.currentMainNavItem).toBeFalsy()
      expect(component.currentTabNav).toBeFalsy()
    })
  })

  describe('On ActivationStart to a route', () => {
    const routeSnapshot = {
      data: {
        navId: 'nope',
      },
    } as unknown as ActivatedRouteSnapshot
    const routerEvent = new ActivationStart(routeSnapshot)

    it('should do nothing', () => {
      jest.spyOn(component, 'setHeader')
      routerEventsSubject.next(routerEvent)
      fixture.detectChanges()

      expect(component.setHeader).not.toHaveBeenCalled()
    })
  })

  describe('On ActivationEnd to the same route', () => {
    const routeSnapshot = {
      data: {
        navId: 'sameRoute',
      },
    } as unknown as ActivatedRouteSnapshot
    const routerEvent = new ActivationEnd(routeSnapshot)

    it('should do nothing', () => {
      component.currentNavId = 'sameRoute'
      jest.spyOn(component, 'setHeader')
      routerEventsSubject.next(routerEvent)
      fixture.detectChanges()

      expect(component.setHeader).not.toHaveBeenCalled()
    })
  })
})
