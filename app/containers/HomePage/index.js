/* eslint-disable no-trailing-spaces */
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as d3 from 'd3';
import { champData } from './data';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const avatarSize = 50;

function importAll(r) {
  const images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); return images; });
  return images;
}

const images = importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/));

const loadImagePatterns = function loadImagePatterns() {
  const defs = d3.select('svg').append("defs").attr("id", "imgdefs");

  champData.forEach((d) => {
    const champPattern = defs.append("pattern")
      .attr("id", "champ_avatar_" + d.key + d.role)
      .attr("height", 1)
      .attr("width", 1)
      .attr("x", "0")
      .attr("y", "0");

    champPattern.append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", avatarSize)
      .attr("width", avatarSize)
      .attr("xlink:href", images[d.key + ".png"]);
  });
};


export class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 768,
      height: 400,
      padding: 50
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    // update chart dimensions on window resize
    // limit the number of callbacks to the window resize event to not unnecessarily rerender too many times
    window.addEventListener("resize", this.throttle(this.updateDimensions, 100));
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  throttle(callback, limit) {
    // limit the number of callbacks to one every LIMIT milliseconds
    let wait = false;             // Initially, we're not waiting
    return () => {                // We return a throttled function
      if (!wait) {                // If we're not waiting
        callback.call();          // Execute users function
        wait = true;              // Prevent future invocations
        setTimeout(() => {        // After a period of time
          wait = false;           // And allow future invocations
        }, limit);
      }
    };
  }

  updateDimensions() {
    // resize the chart depending on available space
    const chart = $('#chart');
    this.setState({
      width: chart.width(),
      height: chart.height()
    });
  }

  render() {
    return (
      <article>
        {
          this.state.data !== [] &&
            <div id="chart" style={{ maxWidth: 768, margin: "auto" }}>
              <ScatterPlot data={champData} {...this.state} />
            </div>
        }
      </article>
    );
  }
}

HomePage.propTypes = {};

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);


class YAxis extends React.Component {

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const axisContainer = this.refs.axisContainer;
    const yMax = d3.max(this.props.data, (d) => d.general.playPercent);

    const axis = d3.axisLeft()
      .ticks(yMax / 2)
      .scale(this.props.scale);

    d3.select(axisContainer).call(axis);
  }

  render() {
    return (
      <g id={this.props.id}>
        <g className="axis" ref="axisContainer" transform={`translate(${this.props.padding}, 0)`} />
        <g className="grid" ref="gridContainer" transform={`translate(${this.props.padding}, 0)`} />
      </g>
    );
  }
}

class XAxis extends React.Component {

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const axisContainer = this.refs.axisContainer;
    const xMin = d3.min(this.props.data, (d) => d.general.winPercent);
    const xMax = d3.max(this.props.data, (d) => d.general.winPercent);

    const axis = d3.axisBottom()
      .ticks(xMax - xMin)
      .scale(this.props.scale);

    d3.select(axisContainer)
      .call(axis);
  }

  render() {
    return (
      <g id={this.props.id}>
        <g className="axis" ref="axisContainer" transform={`translate(0, ${this.props.height - this.props.padding})`} />
        <g className="grid" ref="gridContainer" transform={`translate(0, ${this.props.height - this.props.padding})`} />
      </g>
    );
  }
}


class DataCircles extends React.Component {

  renderCircle(coords) {
    return (
      <circle
        cx={this.props.xScale(coords.general.winPercent)}
        cy={this.props.yScale(coords.general.playPercent)}
        stroke={color(coords.role)}
        strokeWidth={2.5}
        fill={"url(#champ_avatar_" + coords.key + coords.role + ")"}
        r={avatarSize / 2}
        // eslint-disable-next-line no-underscore-dangle
        key={coords._id.$oid}
        className={coords.role}
      />
    );
  }

  render() {
    // eslint-disable-next-line react/jsx-no-bind
    return <g clipPath="url(#clip)">{this.props.data.map(this.renderCircle.bind(this))}</g>;
  }
}

class ScatterPlot extends React.Component {

  componentDidMount() {
    loadImagePatterns();
  }

  getXScale() {
    // set the domain min and max to original data, so it doesn't scale down when filtering out some data
    const xMin = d3.min(this.props.data, (d) => d.general.winPercent);
    const xMax = d3.max(this.props.data, (d) => d.general.winPercent);

    const domainDifference = (xMax - xMin) * 0.1;

    return d3.scaleLinear()
      .domain([xMin - domainDifference, xMax + domainDifference])
      .range([this.props.padding, (this.props.width - (this.props.padding / 2))]);
  }

  getYScale() {
    const yMin = d3.min(this.props.data, (d) => d.general.playPercent);
    const yMax = d3.max(this.props.data, (d) => d.general.playPercent);

    const domainDifference = (yMax - yMin) * 0.1;

    return d3.scaleLinear()
      .domain([yMin - domainDifference, yMax + domainDifference])
      .range([this.props.height - this.props.padding, this.props.padding]);
  }

  render() {
    const xScale = this.getXScale();
    const yScale = this.getYScale();

    const clipWidth = this.props.width - (this.props.padding);
    const clipHeight = this.props.height - (this.props.padding * 2);

    return (
      <svg width={this.props.width} height={this.props.height} viewBox={"0 0 " + this.props.width + " " + this.props.height}>
        <g className="xy-axis">
          <XAxis scale={xScale} id="xaxis" {...this.props} />
          <YAxis scale={yScale} id="yaxis" {...this.props} />
        </g>

        <defs>
          <clipPath id="clip">
            <rect id="clip-rect" x="50" y="50" width={clipWidth} height={clipHeight}>
            </rect>
          </clipPath>
        </defs>
        <DataCircles xScale={xScale} yScale={yScale} {...this.props} />
      </svg>
    );
  }
}

ScatterPlot.PropTypes = {
  data: React.PropTypes.isArray
};
