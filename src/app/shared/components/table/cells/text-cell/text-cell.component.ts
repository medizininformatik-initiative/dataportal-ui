import { Component, input } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TextCellData } from 'src/app/shared/models/TableData/Cells/Data/TextCellData'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrls: ['./text-cell.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe],
})
export class TextCellComponent {
  public readonly cell = input<TextCellData>(undefined)
}
