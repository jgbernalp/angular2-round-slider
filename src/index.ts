import { NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { RoundSliderComponent } from "./round-slider";
export { RoundSliderComponent } from './round-slider';

@NgModule({
  declarations: [RoundSliderComponent],
  imports: [CommonModule]
})
export class RoundSliderModule {

}