import {
  ApplicationRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { InfoTooltipComponent } from '../components/info-tooltip/info-tooltip.component'

@Directive({
  selector: '[numInfoTooltip]',
  standalone: true,
})
export class InfoTooltipDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly appRef = inject(ApplicationRef)
  private readonly environmentInjector = inject(EnvironmentInjector)

  public readonly infoTooltipTitle = input<string>(undefined)
  public readonly infoTooltipText = input<string>(undefined)
  public readonly infoTooltipPosition = input<'top' | 'bottom'>('top')

  private cardRef: ReturnType<typeof createComponent<InfoTooltipComponent>> | null = null

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit(): void {
    const rendered = icon(faQuestionCircle)
    // Safe: rendered.html is a trusted, hardcoded FA SVG — not user input
    this.el.nativeElement.innerHTML = rendered.html.join('')
  }

  @HostListener('mouseenter')
  public show(): void {
    const infoTooltipText = this.infoTooltipText()
    if (this.cardRef || !infoTooltipText) {
      return
    }

    this.cardRef = createComponent(InfoTooltipComponent, {
      environmentInjector: this.environmentInjector,
    })

    this.cardRef.setInput('title', this.infoTooltipTitle())
    this.cardRef.setInput('text', infoTooltipText)

    this.appRef.attachView(this.cardRef.hostView)
    this.cardRef.changeDetectorRef.detectChanges()

    const domEl = (this.cardRef.hostView as any).rootNodes[0] as HTMLElement
    domEl.style.display = 'block'
    domEl.style.position = 'fixed'
    domEl.style.zIndex = '9999'
    domEl.style.pointerEvents = 'none'
    document.body.appendChild(domEl)

    this.position(domEl)
  }

  @HostListener('mouseleave')
  public hide(): void {
    if (!this.cardRef) {
      return
    }
    this.appRef.detachView(this.cardRef.hostView)
    this.cardRef.destroy()
    this.cardRef = null
  }

  public ngOnDestroy(): void {
    this.hide()
  }

  private position(domEl: HTMLElement): void {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const cardWidth = 294

    // Center horizontally over the trigger, clamped within viewport
    let left = rect.left + rect.width / 2 - cardWidth / 2
    left = Math.max(8, Math.min(left, window.innerWidth - cardWidth - 8))

    domEl.style.left = `${left}px`

    if (this.infoTooltipPosition() === 'bottom') {
      domEl.style.top = `${rect.bottom + 8}px`
      domEl.style.transform = 'none'
    } else {
      domEl.style.top = `${rect.top - 8}px`
      domEl.style.transform = 'translateY(-100%)'
    }
  }
}
