import { Directive, HostBinding, HostListener, Input } from '@angular/core'

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
  @Input() expanded = false

  @HostBinding('class.expanded') get isExpanded() {
    return this.expanded
  }

  @HostListener('click') toggleExpand() {
    this.expanded = !this.expanded
  }
}
