import {
  ApplicationRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { InfoTooltipComponent } from '../components/info-tooltip/info-tooltip.component'

@Directive({
  selector: '[numInfoTooltip]',
  standalone: true,
})
export class InfoTooltipDirective implements OnInit, OnDestroy {
  @Input() infoTooltipTitle: string
  @Input() infoTooltipText: string

  private cardRef: ReturnType<typeof createComponent<InfoTooltipComponent>> | null = null

  constructor(
    private el: ElementRef<HTMLElement>,
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  ngOnInit(): void {
    const rendered = icon(faQuestionCircle)
    // Safe: rendered.html is a trusted, hardcoded FA SVG — not user input
    this.el.nativeElement.innerHTML = rendered.html.join('')
  }

  @HostListener('mouseenter')
  show(): void {
    if (this.cardRef || !this.infoTooltipText) {
      return
    }

    this.cardRef = createComponent(InfoTooltipComponent, {
      environmentInjector: this.environmentInjector,
    })

    this.cardRef.instance.title = this.infoTooltipTitle
    this.cardRef.instance.text = this.infoTooltipText

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
  hide(): void {
    if (!this.cardRef) {
      return
    }
    this.appRef.detachView(this.cardRef.hostView)
    this.cardRef.destroy()
    this.cardRef = null
  }

  ngOnDestroy(): void {
    this.hide()
  }

  private position(domEl: HTMLElement): void {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const cardWidth = 294

    // Center above the trigger, 8px gap
    let left = rect.left + rect.width / 2 - cardWidth / 2

    // Keep within viewport horizontally
    left = Math.max(8, Math.min(left, window.innerWidth - cardWidth - 8))

    domEl.style.left = `${left}px`
    domEl.style.top = `${rect.top - 8}px`
    domEl.style.transform = 'translateY(-100%)'
  }
}
