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


export class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);

    const categories = [{ label: 'Win (%)', value: 'winPercent' }, { label: 'Play (%)', value: 'playPercent' }, { label: 'Ban rate (%)', value: 'banRate' }];

    this.state = {
      width: 900,
      height: 600,
      padding: 30,
      avatarSize: 0,
      categories,
      optionX: categories[0],
      optionY: categories[1]
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

  updateX(e) {
    this.setState({
      optionX: {
        label: e.target.options[e.target.selectedIndex].text,
        value: e.target.value
      }
    });
  }

  updateY(e) {
    this.setState({
      optionY: {
        label: e.target.options[e.target.selectedIndex].text,
        value: e.target.value
      }
    });
  }

  render() {
    const options = this.state.categories.map((elem) => {
      return <option value={elem.value} key={elem.value} name={elem.label}> {elem.label} </option>;
    });

    return (
      <article>
        {
          this.state.data !== [] &&
            <div id="chart" style={{ maxWidth: 1130, paddingRight: 20, margin: "auto" }}>
              <div style={{ float: 'left', maxWidth: 1020 }}>
                <select value={this.state.optionY.value} onChange={(e) => this.updateY(e)} style={{ float: 'left', marginTop: this.state.padding }}>
                  {options}
                </select>
                <ScatterPlot data={champData} {...this.state} />
                <select value={this.state.optionX.value} onChange={(e) => this.updateX(e)} style={{ float: 'right' }}>
                  {options}
                </select>
              </div>
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
    const yMax = d3.max(this.props.data, (d) => d.general[this.props.optionY.value]);

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
    const xMin = d3.min(this.props.data, (d) => d.general[this.props.optionX.value]);
    const xMax = d3.max(this.props.data, (d) => d.general[this.props.optionX.value]);

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
        return this.props.xScale(d.general[this.props.optionX.value]);
      }))
      .attr('cy', ((d) => {
        return this.props.yScale(d.general[this.props.optionY.value]);
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
      .on('mousemove', this.props.tip.show)
      .on('mouseout', this.props.tip.hide);
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
      yScale: null,
      tip: this.tip(),
      zoom: null
    };

    this.zoomed = this.zoomed.bind(this);
    this.tip = this.tip.bind(this);
  }

  componentWillMount() {
    this.setState({
      xScale: this.getXScale(this.props.width, this.props.optionX),
      yScale: this.getYScale(this.props.height, this.props.optionY),
      zoom: this.zoom()
    });
  }

  componentDidMount() {
    this.loadImagePatterns();
    d3.select('svg').call(this.state.tip);
    d3.select('svg').call(this.state.zoom);
  }

  componentWillReceiveProps(nextProps) {
    // update only if avatar_size changes
    if (nextProps.avatarSize !== this.props.avatarSize) {
      d3.selectAll('pattern image')
        .attr('height', nextProps.avatarSize)
        .attr('width', nextProps.avatarSize);
    }

    if (nextProps.optionX !== this.props.optionX || nextProps.optionY !== this.props.optionY) {
      this.state.zoom.transform(d3.select('svg'), d3.zoomIdentity);
    }

    this.setState({
      xScale: this.getXScale(nextProps.width, nextProps.optionX),
      yScale: this.getYScale(nextProps.height, nextProps.optionY)
    });
  }

  getXScale(width, optionX) {
    // set the domain min and max to original data, so it doesn't scale down when filtering out some data
    const xMin = d3.min(this.props.data, (d) => d.general[optionX.value]);
    const xMax = d3.max(this.props.data, (d) => d.general[optionX.value]);

    const domainDifference = (xMax - xMin) * 0.075;

    return d3.scaleLinear()
      .domain([xMin - domainDifference, xMax + domainDifference])
      .range([this.props.padding, (width - (this.props.padding / 2))]);
  }

  getYScale(height, optionY) {
    const yMin = d3.min(this.props.data, (d) => d.general[optionY.value]);
    const yMax = d3.max(this.props.data, (d) => d.general[optionY.value]);

    const domainDifference = (yMax - yMin) * 0.075;

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
    this.state.tip.hide();

    const transform = d3.event.transform;

    // Zoom the circles
    const xNewScale = transform.rescaleX(this.getXScale(this.props.width, this.props.optionX));
    const yNewScale = transform.rescaleY(this.getYScale(this.props.height, this.props.optionY));

    this.setState({
      xScale: xNewScale,
      yScale: yNewScale
    });
  }

  tip() {
    return d3Tip().attr('class', 'd3-tip')
      .attr('id', 'tip')
      .offset([-10, 0])
      .html((d) => {
        return "<strong> " + d.title + " " + d.role + " </strong>" +
          "<br>" +
          "<strong>" + this.props.optionX.label + ":</strong> <span>" + d.general[this.props.optionX.value] + "</span> " +
          "<br>" +
          "<strong>" + this.props.optionY.label + ":</strong> <span>" + d.general[this.props.optionY.value] + "</span> ";
      });
  }

  zoom() {
    return d3.zoom()
      .extent([[this.props.padding, this.props.padding], [this.props.width - (this.props.padding * 2), this.props.height - this.props.padding]])
      .scaleExtent([1, 10])
      .translateExtent([[this.props.padding, this.props.padding], [this.props.width - (this.props.padding * 2), this.props.height - this.props.padding]])
      .on("zoom", this.zoomed);
  }

  render() {
    const clipWidth = this.props.width - (this.props.padding * 1.5);
    const clipHeight = this.props.height - (this.props.padding * 2);

    return (
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
        <DataCircles xScale={this.state.xScale} yScale={this.state.yScale} tip={this.state.tip} {...this.props} />
      </svg>
    );
  }
}

ScatterPlot.PropTypes = {
  data: React.PropTypes.isArray
};
