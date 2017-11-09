import React from 'react';
import * as d3 from 'd3';
const color = d3.scaleOrdinal(d3.schemeCategory10);


class RoleSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      Top: true,
      Jungle: true,
      Middle: true,
      ADC: true,
      Support: true
    };
  }

  componentDidMount() {
    d3.selectAll(".roleBox")
      .style("color", ((d, i) => {
        return color(i);
      }));
  }

  filterRole(role) {
    if (this.state[role]) {
      $('.' + role).hide();
    }
    else {
      $('.' + role).show();
    }

    this.setState({
      [role]: !this.state[role]
    });
  }

  render() {
    return (
      <div id="roleCheck" style={{ width: 90, float: "left", marginTop: 50 }}>
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
