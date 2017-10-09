import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { csvParse } from 'd3-dsv';
import { combineCsvs } from './dataParsers';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const dcUrl = 'https://raw.githubusercontent.com/fivethirtyeight/data/master/comic-characters/dc-wikia-data.csv';
    const marvelUrl = 'https://raw.githubusercontent.com/fivethirtyeight/data/master/comic-characters/marvel-wikia-data.csv'
    return Promise.all([
      dcUrl,
      marvelUrl,
    ].map((url) => {
      return fetch(url)
        .then((response) => response.ok ? response.text() : Promise.reject(`Failed to fetch ${url}`))
        .then((text) => csvParse(text));
    }))
      .then((parsedCsvs) => this.setState({ data: combineCsvs([
        {
          data: parsedCsvs[0],
          dateFormat: 'YYYY, MMMM',
        }, {
          data: parsedCsvs[1],
          dateFormat: 'MMM-YY',
        },
      ]) }));
  }

  render() {
    const moves = [
      'M70,70',
      'h150',
      //'v60',
      'a30,30 1 0,1 0,60',
      'h-150',
      'Z',
    ];
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          { this.state.data ? 'I loaded all the data!' : 'Loading...' }
        </p>
        <svg width="500px" height="500px">
          <rect x="0" y="0" width="100" height="100" fill="blue" />
          <path d={moves.join()} fill="green" />
        </svg>
      </div>
    );
  }
}

export default App;
