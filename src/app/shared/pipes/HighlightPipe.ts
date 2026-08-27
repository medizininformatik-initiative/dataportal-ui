import { inject, Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'highlight',
  standalone: true,
  pure: false,
})
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer)

  transform(text: string | undefined, term: string | undefined): SafeHtml {
    if (!text) return ''
    if (!term) return text
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const highlighted = text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
    return this.sanitizer.bypassSecurityTrustHtml(highlighted)
  }
}
