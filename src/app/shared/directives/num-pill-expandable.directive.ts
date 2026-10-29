import { Directive, HostBinding, HostListener, model } from '@angular/core'

/**
 * Directive to toggle the 'expanded' class on .num-pill elements when clicked.
 * Usage: <div numPillExpandable>...</div>
 * Optionally bind [expanded] to control externally.
 */
@Directive({
  selector: '[numPillExpandable]',
  standalone: true,
})
export class NumPillExpandableDirective {
  public readonly expanded = model(false)

  @HostBinding('class.expanded') public get isExpanded() {
    return this.expanded()
  }

  @HostListener('click') public toggleExpand() {
    this.expanded.update((v) => !v)
  }
}
