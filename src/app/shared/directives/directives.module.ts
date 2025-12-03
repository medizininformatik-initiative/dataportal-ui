import { CommonModule } from '@angular/common';
import { DropGroupDirective } from './drop-group/drop-group.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DropGroupDirective],
  imports: [CommonModule],
  exports: [DropGroupDirective],
})
export class DirectivesModule {}
