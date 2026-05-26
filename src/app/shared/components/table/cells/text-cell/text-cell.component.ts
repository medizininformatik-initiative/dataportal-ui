import { Component, Input } from '@angular/core'
import { TextCellData } from 'src/app/shared/models/TableData/cells/TextCellData'
import { MatTooltip } from '@angular/material/tooltip'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrls: ['./text-cell.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe],
})
export class TextCellComponent {
  @Input() cell: TextCellData
}
