import React from 'react';
import * as d3 from 'd3';


class RoleSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      Top: true,
      Jungle: true,
      Middle: true,
      ADC: true,
      Support: true,
      style: {
        Top: $("<style type='text/css'>").appendTo('head'),
        Jungle: $("<style type='text/css'>").appendTo('head'),
        Middle: $("<style type='text/css'>").appendTo('head'),
        ADC: $("<style type='text/css'>").appendTo('head'),
        Support: $("<style type='text/css'>").appendTo('head'),
      }
    };
  }

  componentDidMount() {
    d3.selectAll(".roleBox")
      .style("color", ((d, i) => {
        return this.props.color(i);
      }));
  }

  filterRole(role) {
    // The role filter use a really dumb idea
    // We create a stylesheet in the head of our document with a rule that says if the element is hidden or visible
    // We do that because we want to set the rule directly in our CSS and not on our inline element
    // Because our data circles are reappended every time there is a zoom
    // Otherwise we would need to make a function call every time our circle would get reappended
    // Still this solution is dumb. I'm sorry dear god of programming.
    const css = "." + role + " { visibility: " + (this.state[role] ? 'hidden' : 'visible') + "}";
    this.state.style[role].html(css);

    this.setState({
      [role]: !this.state[role]
    });
  }

  render() {
    return (
      <div id="roleCheck" style={{ width: 90, float: "left", marginTop: 40 }}>
        <div className="roleBox">
          <label htmlFor="topCheckbox">
            <input type="checkbox" checked={this.state.Top} id="topCheckbox" value="Top" onChange={() => this.filterRole('Top')} /> Top
          </label>
        </div>
        <div className="roleBox">
          <label htmlFor="jungleCheckbox">
            <input type="checkbox" checked={this.state.Jungle} id="jungleCheckbox" value="Jungle" onChange={() => this.filterRole('Jungle')} /> Jungle
          </label>
        </div>
        <div className="roleBox">
          <label htmlFor="middleCheckbox">
            <input type="checkbox" checked={this.state.Middle} id="middleCheckbox" value="Middle" onChange={() => this.filterRole('Middle')} /> Middle
          </label>
        </div>
        <div className="roleBox">
          <label htmlFor="ADCCheckbox">
            <input type="checkbox" checked={this.state.ADC} id="ADCCheckbox" value="ADC" onChange={() => this.filterRole('ADC')} /> ADC
          </label>
        </div>
        <div className="roleBox">
          <label htmlFor="supportCheckbox">
            <input type="checkbox" checked={this.state.Support} id="supportCheckbox" value="Support" onChange={() => this.filterRole('Support')} /> Support
          </label>
        </div>
      </div>
    );
  }
}

export default RoleSelector;
