import { CommonModule } from '@angular/common';
import { DropGroupDirective } from './drop-group/drop-group.directive';
import { NumPillExpandableDirective } from './num-pill-expandable.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DropGroupDirective, NumPillExpandableDirective],
  imports: [CommonModule],
  exports: [DropGroupDirective, NumPillExpandableDirective],
})
export class DirectivesModule {}
