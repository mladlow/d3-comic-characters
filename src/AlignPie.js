import React, { Component } from 'react';
import * as d3s from 'd3-shape';
import * as d3i from 'd3-interpolate';

const maxDuration = 500;
const step = 10;
const padRadians = 2 * Math.PI * 0.01;
const minPercentageOfTotal = 0.02; // 2 percent

export const colors = d3i.interpolateRgbBasis([
  '#7C98B3',
  '#B3B7EE',
  '#AF90A9',
  '#A05C7B',
  '#944654',
]);

class PieSlice extends Component {
  render() {
    const { slice, arcGen, progress, color } = this.props;

    return <g>
      <path
        d={arcGen({
          startAngle: slice.startAngle,
          endAngle: slice.interpolator(progress),
        })}
        fill={colors(color)} />
    </g>;
  }
}

class AlignPie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      tick: 0,
    };
    this.handleInterval = this.handleInterval.bind(this);
  }

  handleInterval() {
    if (this.state.tick >= maxDuration) {
      clearInterval(this.state.intervalId);
    } else {
      this.setState({ tick: this.state.tick + step });
    }
  }

  componentWillMount() {
    this.setState({intervalId: setInterval(this.handleInterval, 10)});
  }

  render() {
    const size = 500;
    const radius = size * 0.8 / 2;
    const total = Array.from(this.props.data.values())
      .reduce((acc, val) => acc + val, 0);
    const dataArray = Array.from(this.props.data.entries())
      .map(([key, value]) => value / total > minPercentageOfTotal ? [key, value] : [key, total * minPercentageOfTotal]);
    const pie = d3s.pie()
      .value((d) => d[1])(dataArray)
      .map((slice) => {
        slice.interpolator = d3i.interpolateNumber(slice.startAngle, slice.endAngle - padRadians);
        return slice;
      });

    const path = d3s.arc()
      .outerRadius(radius)
      .innerRadius(0)

    const label = d3s.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.8);

    return <svg width={`${size}px`} height={`${size}px`}>
      <g transform={`translate(${size/2},${size/2})`}>
        {pie.map((angle) => <PieSlice
          key={angle.data[0].replace(/ /g, '')}
          progress={this.state.tick/maxDuration}
          color={angle.data[1]/total}
          slice={angle}
          arcGen={path} />)}
        {pie.map((angle) => {
          const textPosition = label.centroid(angle);
          const textAnchor = textPosition[0] <= 0 ? 'start' : 'middle';
          return <text
            key={`text_${angle.data[0].replace(/ /g, '')}`}
            transform={`translate(${textPosition})`}
            textAnchor={textAnchor}
            dy="0.035em">
            {angle.data[0]}
          </text>;
        })}
      </g>
    </svg>;
  }
}

export default AlignPie;
