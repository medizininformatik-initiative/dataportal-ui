import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { provideRouter, Router } from '@angular/router'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { TranslateModule } from '@ngx-translate/core'
import INavItem from '../../models/nav-item.interface'
import { SideMenuComponent } from './side-menu.component'

// the real constants import via 'src/...', which Jest does not map; the spec sets its own items
jest.mock('../../../core/constants/navigation', () => ({ mainNavItems: [] }))

@Component({ standalone: true, template: '' })
class DummyPageComponent {}

const navItems: INavItem[] = [
  {
    routeTo: '/data',
    icon: 'clipboard-list',
    translationKey: 'NAV.DATA',
    children: [
      { routeTo: '/data/one', icon: 'file', translationKey: 'NAV.ONE' },
      { routeTo: '/data/two', icon: 'file', translationKey: 'NAV.TWO' },
    ],
  },
  { routeTo: '/saved', icon: 'folder-open', translationKey: 'NAV.SAVED' },
]

describe('SideMenuComponent', () => {
  let fixture: ComponentFixture<SideMenuComponent>
  let component: SideMenuComponent
  let root: HTMLElement

  const links = (selector = '.num-nav-link'): HTMLAnchorElement[] =>
    Array.from(root.querySelectorAll<HTMLAnchorElement>(selector))
  const linkFor = (label: string): HTMLAnchorElement =>
    links().find((l) => l.getAttribute('aria-label') === label)

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent, FontAwesomeTestingModule, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: 'data', component: DummyPageComponent },
          { path: 'data/one', component: DummyPageComponent },
          { path: 'data/two', component: DummyPageComponent },
          { path: 'saved', component: DummyPageComponent },
        ]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SideMenuComponent)
    component = fixture.componentInstance
    component.mainNavItems = navItems
    root = fixture.nativeElement
    fixture.detectChanges()
  })

  it('renders one group per item with its children in a nested list', () => {
    expect(root.querySelectorAll('.num-nav-group')).toHaveLength(2)
    expect(root.querySelectorAll('.num-nav-group ul .num-nav-link--child')).toHaveLength(2)
    expect(links()).toHaveLength(4)
  })

  it('uses native list semantics instead of Material list directives', () => {
    expect(root.querySelector('ul.num-nav-list')).not.toBeNull()
    expect(root.querySelector('mat-nav-list, .mat-mdc-list-item')).toBeNull()
  })

  it('shows icons on parents only', () => {
    expect(linkFor('NAV.DATA').querySelector('fa-icon')).not.toBeNull()
    expect(linkFor('NAV.ONE').querySelector('fa-icon')).toBeNull()
  })

  it('marks only the exact parent route as active, not parent of an active child', async () => {
    await TestBed.inject(Router).navigateByUrl('/data')
    fixture.detectChanges()
    expect(linkFor('NAV.DATA').getAttribute('aria-current')).toBe('page')

    await TestBed.inject(Router).navigateByUrl('/data/one')
    fixture.detectChanges()
    expect(linkFor('NAV.DATA').getAttribute('aria-current')).toBeNull()
    expect(linkFor('NAV.ONE').getAttribute('aria-current')).toBe('page')
    expect(links('.num-nav-link--active')).toHaveLength(1)
  })

  it('highlights the parent of the current page when collapsed, since children are hidden', async () => {
    fixture.componentRef.setInput('isSideMenuExpanded', false)
    await TestBed.inject(Router).navigateByUrl('/data/one')
    fixture.detectChanges()
    await fixture.whenStable() // RouterLinkActive updates in a microtask

    expect(linkFor('NAV.DATA').getAttribute('aria-current')).toBe('page')
  })

  it('keeps links keyboard focusable with an accessible name when collapsed', () => {
    fixture.componentRef.setInput('isSideMenuExpanded', false)
    fixture.detectChanges()

    expect(root.classList).toContain('collapsed')
    expect(root.querySelector('.navItem-font, .navItem-font--child')).toBeNull()
    links().forEach((link) => {
      expect(link.getAttribute('href')).toBeTruthy()
      expect(link.getAttribute('aria-label')).toBeTruthy()
      expect(link.tabIndex).not.toBe(-1)
    })
  })

  it('toggles the menu and emits the new state', () => {
    const emitted: boolean[] = []
    component.toggleSideMenu.subscribe((v) => emitted.push(v))
    const button = root.querySelector<HTMLButtonElement>('.num-toggle-button')

    expect(button.getAttribute('aria-expanded')).toBe('true')
    button.click()
    fixture.detectChanges()

    expect(emitted).toEqual([false])
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})
