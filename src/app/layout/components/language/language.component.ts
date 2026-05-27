import { Component, OnInit, inject } from '@angular/core'
import { TranslateService, TranslateModule } from '@ngx-translate/core'
import { MatFormField, MatPrefix } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { MatOption } from '@angular/material/core'

@Component({
  selector: 'num-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [MatFormField, MatPrefix, MatSelect, MatOption, TranslateModule],
})
export class LanguageComponent implements OnInit {
  translate = inject(TranslateService)

  languages: string[] = ['de', 'en']

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    const translate = this.translate

    translate.addLangs(this.languages)
    translate.setDefaultLang('de')

    const browserLang = translate.getBrowserLang()
    translate.use(this.languages.includes(browserLang) ? browserLang : 'de')
  }

  ngOnInit(): void {}

  public changeLanguage(lang: string) {
    this.translate.use(lang)
  }
}
