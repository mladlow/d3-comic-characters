import React, { Component } from 'react';
import * as d3s from 'd3-scale';
import * as d3a from 'd3-array';
//import * as d3i from 'd3-interpolate';
import {colors} from './AlignPie';

class AppearancesOverFirstAppearance extends Component {
  constructor(props) {
    super(props);
    this.state = { textElement: null };
  }

  render() {
    const height = 3000;
    const width = window.innerWidth;
    const xMargin = 50;
    const topMargin = 31;
    const bottomMargin = 6;
    const minAppearances = 50;
    let minYear = 2015;
    let maxYear = 0;
    const data = this.props.data
      .filter((character) => {
        const cYear = character['YEAR'];
        const isValid = Boolean(cYear) && Boolean(character['APPEARANCES']) && Number(character['APPEARANCES']) > minAppearances;
        if (isValid) {
          const nYear = Number(cYear);
          if (nYear < minYear) {
            minYear = nYear;
          } else if (nYear > maxYear) {
            maxYear = nYear;
          }
        }
        return isValid;
      });
    maxYear++;

    const years = d3a.range(minYear, maxYear);
    const x = d3s.scalePoint()
      .domain(years)
      .range([xMargin, width - xMargin]);

    const appearancesDomain = [minAppearances, d3a.max(data, (character) => Number(character['APPEARANCES']))];
    const y = d3s.scaleLinear()
      .domain(appearancesDomain)
      .range([height - bottomMargin, topMargin]);

    const yAxis = d3s.scalePoint()
      .domain(appearancesDomain)
      .rangeRound([height, 0]);

    const r = d3s.scaleLinear()
      .domain(appearancesDomain)
      .range([5, 30]);

    const colorScale = d3s.scaleSequential(colors)
      .domain(appearancesDomain);

    let textAnchor = 'start';
    if (this.state.textElement && x(this.state.textElement['YEAR']) > width * 0.75) {
      textAnchor = 'end';
    }

    return <svg width="100%" height={`${height + 45}px`}>
      <rect
        x="5"
        y="0"
        width={width-10}
        height={height}
        fill="white"
        stroke="black" />
      {years.map((year, index) => {
        const xValue = x(year);
        return <g key={`axis${index}`}>
          <line
            stroke="grey"
            strokeOpacity="0.5"
            x1={xValue}
            y1={0}
            x2={xValue}
            y2={height} />
          <g transform={`translate(${xValue-6},${height+3})`}>
            <text
              transform="rotate(90)"
              x={0}
              y={0}>
              {year}
            </text>
          </g>
        </g>;
      })}
      {data.map((character, index) => {
        const numericAppearances = Number(character['APPEARANCES']);
        const xValue = x(character['YEAR']);
        const yValue = y(numericAppearances);
        return <g key={`blah${index}`}>
          <circle
            onClick={() => {console.log(character); this.setState({textElement: character})}}
            cx={xValue}
            cy={yValue}
            r={r(numericAppearances)}
            strokeWidth="1"
            stroke="black"
            fill={colorScale(numericAppearances)} />
        </g>;
      })}
      {this.state.textElement && <text
        textAnchor={textAnchor}
        paintOrder="stroke"
        strokeWidth="2"
        stroke="white"
        x={x(this.state.textElement['YEAR'])}
        y={y(Number(this.state.textElement['APPEARANCES']))}>
        {this.state.textElement['name']}
      </text>}
    </svg>;
  }
}

export default AppearancesOverFirstAppearance;
