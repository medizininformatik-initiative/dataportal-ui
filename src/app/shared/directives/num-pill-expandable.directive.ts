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
  readonly expanded = model(false)

  @HostBinding('class.expanded') get isExpanded() {
    return this.expanded()
  }

  @HostListener('click') toggleExpand() {
    this.expanded.update((v) => !v)
  }
}
