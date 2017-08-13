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

export class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 768,
      height: 400,
      padding: 50
    };
  }

  render() {
    return (
      <article>
        {
          this.state.data !== [] &&
          <ScatterPlot data={champData} {...this.state} />
        }
      </article>
    );
  }
}

HomePage.propTypes = {

};

export function mapDispatchToProps() {
  return {

  };
}

const mapStateToProps = createStructuredSelector({

});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);







class Axis extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const axisContainer = this.refs.axisContainer;

    if (this.props.orient === 'bottom') {
      const axis = d3.select('#' + this.props.id + " .axis")
        .attr('class', 'axis xaxis')
        .call(d3.axisBottom()
          .ticks(Math.round(this.props.width / 60))
          .scale(this.props.scale))
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");
    }
    else {
      const yMax = d3.max(this.props.data, (d) => d.general.playPercent);

      const axis = d3.axisLeft()
        .ticks(yMax)
        .scale(this.props.scale);

      d3.select(axisContainer).call(axis);
    }
  }

  render() {
    return (
      <g id={this.props.id}>
        <g className="axis" ref="axisContainer" transform={this.props.translate}/>
        <g className="grid" ref="gridContainer" transform={this.props.translate}/>
      </g>
    )
  }
}

class XYAxis extends React.Component {
  render() {
    return (
      <g className="xy-axis">
        <Axis translate={`translate(0, ${this.props.height - this.props.padding})`}
              scale={this.props.xScale} id="xaxis"
              orient="bottom" {...this.props}
        />
        <Axis translate={`translate(${this.props.padding}, 0)`}
              scale={this.props.yScale} id="yaxis"
              orient="left" {...this.props}
        />
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
        fill={coords.role}
        r={10}
        key={coords._id.$oid}
      />
    );
  }

  render() {
    return <g>{this.props.data.map(this.renderCircle.bind(this))}</g>;
  }
}

class ScatterPlot extends React.Component {
  getXScale() {
    // set the domain min and max to original data, so it doesn't scale down when filtering out some data
    const xMin = d3.min(this.props.data, (d) => d.general.winPercent);
    const xMax = d3.max(this.props.data, (d) => d.general.winPercent);

    return d3.scaleTime()
      .domain([xMin * 0.95, xMax * 1.05])
      .range([this.props.padding, (this.props.width - this.props.padding / 2)]);
  }

  getYScale() {
    const yMin = d3.min(this.props.data, (d) => d.general.playPercent);
    const yMax = d3.max(this.props.data, (d) => d.general.playPercent);

    return d3.scaleLinear()
      .domain([yMin * 0.95, yMax * 1.05])
      .range([this.props.height - this.props.padding, this.props.padding]);
  }

  render() {
    const xScale = this.getXScale();
    const yScale = this.getYScale();

    return (
      <svg width={this.props.width} height={this.props.height}>
        <XYAxis xScale={xScale} yScale={yScale} {...this.props} />
        <DataCircles xScale={xScale} yScale={yScale} {...this.props} />
      </svg>
    );
  }
}

ScatterPlot.PropTypes = {
  data: React.PropTypes.isArray
};
