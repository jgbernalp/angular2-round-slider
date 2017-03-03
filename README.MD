# angular2-round-slider

## Installation

To install this component, run:

```bash
$ npm install angular2-round-slider --save
```

## Using Smartenit Module

Include RoundSliderComponent in your Angular 2 main module:

```typescript
// ...
import { RoundSliderComponent } from 'angular2-round-slider/dist';

@NgModule({
  // ...
  declarations: [
    // ...
    RoundSliderComponent
  ]
})
export class AppModule { }
```

## Usage

```html
<round-slider #sliderElem 
    [width]="140" 
    [height]="140" 
    [radius]="50"
    [value]="levelControlValue"
    (onChangeEnd)="listenerEvent$.next(sliderElem.value)"
    [image]="'https://s-media-cache-ak0.pinimg.com/736x/99/9b/af/999baff3288ebe0232ac9d34ac7b73ba.jpg'"
></round-slider>

```

## Styling
Please make sure to include and customize the component scss in your angular project

```css
round-slider {
  display: block;

  .round-slider-container {
    position: relative;
  }

  .container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20;
  }

  .round-slider-image {
    background-size: cover;
    border-radius: 50%;
    position: absolute;
  }

  .round-slider-text {
    text-align: center;
    position: absolute;
    width: 100%;
    display: table-cell;
    vertical-align: middle;
    top: 41%;
    pointer-events: none;
    z-index: 10;
    color: white;
    font-size: 18px;
  }

  .circumference {
    &.transparent {
      fill: transparent;
    }
    fill: #f2f2f2;
  }

  .dot circle:hover {
    cursor: pointer;
  }

  .dot circle {
    fill: lightsteelblue;
    stroke: lightsteelblue;
    stroke-width: 1.5px;
  }

  .dot circle.dragging {
    fill: steelblue;
    stroke: steelblue;
  }

  .arc {
    fill: steelblue;
  }
}
```

## License

MIT
