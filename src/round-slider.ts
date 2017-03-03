import { Component, OnInit, Input, Output, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';

import 'd3';
let d3: any;

@Component({
  selector: 'round-slider',
  template: `
    <div class="round-slider-container" [ngStyle]="{'width':width+'px', 'height':height+'px'}">
        <span class="round-slider-text">{{value}}{{units}}</span>
        <div [ngStyle]="{'background-image': 'url('+ imageUrl +')', 'width': imageSize + 'px', 'height': imageSize + 'px', 'top': imagePosition + 'px', 'left': imagePosition + 'px'}" class="round-slider-image"></div>
    </div>`
})
export class RoundSliderComponent implements OnInit {
  @Input()
  width: number = 120;

  @Input()
  height: number = 120;

  @Input()
  radius: number = 45;

  @Input()
  max: number = 100;

  @Input()
  thick: number = 5;

  @Input()
  min: number = 0;

  @Input()
  imageUrl: string;

  @Input()
  units: string = '%';

  imageSize: number;
  imagePosition: number;

  private thumb: any;
  private arcForeground: any;
  private arc: any;
  private localAngleValue: number;
  private circleContainer: any;

  private _value = 0;

  get value(): number {
    return this._value;
  }

  @Input()
  set value(value: number) {
    this._value = Math.round(value);

    this.localAngleValue = this.valueToRadians(Math.round(value));
    this.updateUI();
  }

  @Output()
  onChangeEnd: Subject<any>;

  constructor(private element: ElementRef) {
    this.localAngleValue = 0;
    this._value = this.radiansToValue(Math.PI);
    this.onChangeEnd = new Subject();
  }

  ngOnInit() {
    this.imageSize = (this.radius * 2);
    this.imagePosition = (this.width / 2) - this.radius;

    let host = d3.select(this.element.nativeElement);

    host = d3.selectAll('.round-slider-container');

    let drag = d3.drag()
      .on('start', this.dragStarted())
      .on('drag', this.dragged(this))
      .on('end', this.dragEnded(this));

    let svg = host.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'container')
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    let container = svg.append('g');

    this.circleContainer = container.append('circle')
      .attr('r', this.radius - (this.thick / 2))
      .attr('class', 'circumference');

    let handle = [{
      x: 0,
      y: this.radius
    }];

    this.arc = d3.arc()
      .innerRadius(this.radius - (this.thick / 2))
      .outerRadius(this.radius + (this.thick / 2))
      .startAngle(Math.PI);

    this.arcForeground = container.append('path')
      .datum({endAngle: Math.PI})
      .attr('class', 'arc')
      .attr('d', this.arc);

    this.thumb = container.append('g')
      .attr('class', 'dot')
      .selectAll('circle')
      .data(handle)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('cx', function (d: any) {
        return d.x;
      })
      .attr('cy', function (d: any) {
        return d.y;
      })
      .call(drag);

    this.updateUI();
  }

  private dragged(instance: any) {
    return function (d: any) {
      const coord = d3.mouse(this);

      const dFromOrigin = Math.sqrt(Math.pow(coord[0], 2) + Math.pow(coord[1], 2));
      let alpha = Math.acos(coord[0] / dFromOrigin);
      alpha = coord[1] < 0 ? -alpha : alpha;

      instance.localAngleValue = alpha;
      instance._value = instance.radiansToValue(alpha);
      instance.updateUI();

      d3.select(this)
        .attr('cx', d.x = instance.radius * Math.cos(alpha))
        .attr('cy', d.y = instance.radius * Math.sin(alpha));
    }
  }

  private dragStarted() {
    return function () {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this)
        .classed('dragging', true);
    };
  }

  private updateUI() {
    if (this.localAngleValue === undefined || isNaN(this.localAngleValue)) {
      this.localAngleValue = this.valueToRadians(0);
    }

    if (this._value === undefined || isNaN(this._value)) {
      this._value = 0;
    }

    if (this.imageUrl && this.circleContainer) {
      this.circleContainer.attr('class', 'circumference transparent');
    }

    const xpos = this.radius * Math.cos(this.localAngleValue);
    const ypos = this.radius * Math.sin(this.localAngleValue);

    console.log('x', xpos);
    console.log('y', ypos);
    console.log('angle', this.localAngleValue);

    if (this.thumb) {
      this.thumb
        .attr('cx', xpos)
        .attr('cy', ypos);
    }

    if (this.arcForeground) {
      let arcAlpha = this.localAngleValue;

      if (this._value == 0) {
        arcAlpha = this.localAngleValue + (Math.PI / 2) + 0.001;
      } else if (xpos <= 0 && ypos >= 0) {
        arcAlpha = this.localAngleValue + (Math.PI / 2);
      } else {
        arcAlpha = (Math.PI * 2) + this.localAngleValue + (Math.PI / 2);
      }

      this.arcForeground.attr('d', this.arc({endAngle: arcAlpha}));
    }
  }

  private radiansToValue(radians: number): number {
    let value = radians - (Math.PI / 2);
    value = value * 180 / Math.PI;

    if (value < 0) {
      value += 360;
    }

    return Math.round(value / 360 * this.max);
  }

  private valueToRadians(value: number): number {
    let radiansValue = value * 2 * Math.PI / this.max;

    radiansValue = radiansValue + (Math.PI / 2);

    if (radiansValue > Math.PI) {
      radiansValue = -(2 * Math.PI) + radiansValue;
    }

    return radiansValue;
  }

  private dragEnded(instance: any) {
    return function () {
      const coord = d3.mouse(this);

      const radians = Math.atan2(coord[1], coord[0]);

      let value = instance.radiansToValue(radians);
      value = Math.floor(value);

      instance._value = value;
      instance.onChangeEnd.next(value);

      d3.select(this)
        .classed('dragging', false);
    };
  }
}
