import React from 'react';
import Banner from './champion_charts_logo.png';


class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div id="header">
        <img src={Banner} id="banner" alt="Champion Charts logo" />
        <h1 className="gold-text"> &nbsp; Champion Charts </h1>
      </div>
    );
  }
}

export default Header;
