/* eslint-disable no-trailing-spaces,arrow-body-style */
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { champData } from './data';
import RoleSelector from './RoleSelector';

const color = d3.scaleOrdinal(d3.schemeCategory10);

function importAll(r) {
  const images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); return images; });
  return images;
}

const images = importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/));

const tip = d3Tip().attr('class', 'd3-tip')
  .attr('id', 'tip')
  .offset([-10, 0])
  .html((d) => {
    return "<strong> " + d.title + " " + d.role + " </strong>" +
      "<br>" +
      "<strong>Win %:</strong> <span>" + d.general.winPercent + "</span> " +
      "<br>" +
      "<strong>Play %:</strong> <span>" + d.general.playPercent + "</span> ";
  });

export class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 900,
      height: 600,
      padding: 50,
      avatarSize: 0
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    // update chart dimensions on window resize
    // limit the number of callbacks to the window resize event to not unnecessarily rerender too many times
    window.addEventListener("resize", this.throttle(this.updateDimensions, 50));
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
    let avatarSize = 0;
    if ($(window).width() > 768) {
      avatarSize = 50;
    }
    else if ($(window).width() <= 768 && $(window).width() > 500) {
      avatarSize = 40;
    }
    else {
      avatarSize = 25;
    }

    // resize the chart depending on available space
    const chart = $('#chart');
    this.setState({
      width: chart.width() > 900 ? 900 : chart.width(),
      height: chart.width() > 900 ? 900 / 1.5 : chart.width() / 1.5,
      avatarSize
    });
  }

  render() {
    return (
      <article>
        {
          this.state.data !== [] &&
            <div id="chart" style={{ maxWidth: 990, margin: "auto" }}>
              <ScatterPlot data={champData} {...this.state} />
              <RoleSelector />
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

    d3.select(axisContainer)
      .call(axis);

    const gridContainer = this.refs.gridContainer;
    const grid = d3.axisLeft(this.props.scale)
      .ticks(yMax / 2)
      .tickSize(-(this.props.width - (this.props.padding * 1.5)))
      .tickSizeOuter(0)
      .tickFormat("");

    d3.select(gridContainer).call(grid);
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

    const gridContainer = this.refs.gridContainer;
    const grid = d3.axisBottom(this.props.scale)
      .ticks(xMax - xMin)
      .tickSize(-(this.props.height - (this.props.padding * 2)))
      .tickSizeOuter(0)
      .tickFormat("");

    d3.select(gridContainer).call(grid);
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

  componentDidUpdate() {
    this.renderCircle();
  }

  renderCircle() {
    $('#circleContainer').empty();

    d3.select("#circleContainer")
      .selectAll('.dot')
      .data(this.props.data)
      .enter().append('circle')
      .attr('cx', ((d) => {
        return this.props.xScale(d.general.winPercent);
      }))
      .attr('cy', ((d) => {
        return this.props.yScale(d.general.playPercent);
      }))
      .attr('r', this.props.avatarSize / 2)
      .style('stroke', ((d) => {
        return color(d.role);
      }))
      .style('stroke-width', 2.5)
      .style('fill', ((d) => {
        return "url(#champ_avatar_" + d.key + d.role + ")";
      }))
      .attr('class', ((d) => {
        return d.role;
      }))
      .on('mousemove', tip.show)
      .on('mouseout', tip.hide);
  }

  render() {
    return <g clipPath="url(#clip)" id="circleContainer" />;
  }
}

class ScatterPlot extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      xScale: null,
      yScale: null
    };

    this.zoomed = this.zoomed.bind(this);
  }

  componentWillMount() {
    this.setState({
      xScale: this.getXScale(this.props.width),
      yScale: this.getYScale(this.props.height)
    });
  }

  componentDidMount() {
    this.loadImagePatterns();
    d3.select('svg').call(tip);

    const zoom = d3.zoom()
      .extent([[50, 50], [this.props.width - (100), this.props.height + 75]])
      .scaleExtent([1, 10])
      .translateExtent([[50, 50], [this.props.width - (100), this.props.height + 75]])
      .on("zoom", this.zoomed);

    d3.select('svg').call(zoom);
  }

  componentWillReceiveProps(nextProps) {
    // update only if avatar_size changes
    if (nextProps.avatarSize !== this.props.avatarSize) {
      d3.selectAll('pattern image')
        .attr('height', nextProps.avatarSize)
        .attr('width', nextProps.avatarSize);
    }
    if (nextProps.width !== this.props.width) {
      this.setState({
        xScale: this.getXScale(nextProps.width),
        yScale: this.getYScale(nextProps.height)
      });
    }
  }

  getXScale(width) {
    // set the domain min and max to original data, so it doesn't scale down when filtering out some data
    const xMin = d3.min(this.props.data, (d) => d.general.winPercent);
    const xMax = d3.max(this.props.data, (d) => d.general.winPercent);

    const domainDifference = (xMax - xMin) * 0.1;

    return d3.scaleLinear()
      .domain([xMin - domainDifference, xMax + domainDifference])
      .range([this.props.padding, (width - (this.props.padding / 2))]);
  }

  getYScale(height) {
    const yMin = d3.min(this.props.data, (d) => d.general.playPercent);
    const yMax = d3.max(this.props.data, (d) => d.general.playPercent);

    const domainDifference = (yMax - yMin) * 0.1;

    return d3.scaleLinear()
      .domain([yMin - domainDifference, yMax + domainDifference])
      .range([height - this.props.padding, this.props.padding]);
  }

  loadImagePatterns() {
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
        .attr("height", this.props.avatarSize)
        .attr("width", this.props.avatarSize)
        .attr("xlink:href", images[d.key + ".png"]);
    });
  }

  zoomed() {
    const transform = d3.event.transform;

    // Zoom the circles
    const xNewScale = transform.rescaleX(this.getXScale(this.props.width));
    const yNewScale = transform.rescaleY(this.getYScale(this.props.height));

    this.setState({
      xScale: xNewScale,
      yScale: yNewScale
    });
  }

  render() {
    const clipWidth = this.props.width - (this.props.padding * 1.5);
    const clipHeight = this.props.height - (this.props.padding * 2);

    return (
      <div style={{ float: "left" }}>
        <svg width={this.props.width} height={this.props.height} viewBox={"0 0 " + this.props.width + " " + this.props.height}>
          <g className="xy-axis">
            <XAxis scale={this.state.xScale} id="xaxis" {...this.props} />
            <YAxis scale={this.state.yScale} id="yaxis" {...this.props} />
          </g>
          <rect fill="none" pointerEvents={"all"} x={this.props.padding} y={this.props.padding} width={clipWidth} height={clipHeight}> </rect>
          <defs>
            <clipPath id="clip">
              <rect id="clip-rect" x={this.props.padding} y={this.props.padding} width={clipWidth} height={clipHeight}>
              </rect>
            </clipPath>
          </defs>
          <text transform={"translate(" + (this.props.width - 10) + " , " + (this.props.height - 10) + ")"} style={{ textAnchor: "end" }}> Win (%)</text>
          <text transform={"rotate(-90)"} dy="1em" x={-this.props.padding} style={{ textAnchor: "end" }}> Play (%)</text>
          <DataCircles xScale={this.state.xScale} yScale={this.state.yScale} {...this.props} />
        </svg>
      </div>
    );
  }
}

ScatterPlot.PropTypes = {
  data: React.PropTypes.isArray
};
