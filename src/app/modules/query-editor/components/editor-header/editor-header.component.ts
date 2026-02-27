import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'num-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss'],
})
export class EditorHeaderComponent implements OnChanges, OnDestroy {
  @Input() id: string;
  @Input() type: string;

  nextProfile: Subscription;
  previousProfile: Subscription;

  nextElementExists$: Observable<boolean>;
  previousElementExists$: Observable<boolean>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.nextProfile?.unsubscribe();
    this.previousProfile?.unsubscribe();
  }
}
