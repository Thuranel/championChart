import React from 'react';


class FAQ extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div style={{ clear: "both", textAlign: "center" }} >
        <h2> Frequently asked questions </h2>
        <div>
          <div style={{ width: "50%", float: "left" }}>
            <h3> What is this? </h3>
            <div style={{ width: "90%", textAlign: "left", margin: "auto" }}>
              The goal of the website is to quickly visualize and compare League of Legends statistics.
              Simply select two statistics that interest you and watch the data rearrange itself to show you which champions stand out from the rest.
            </div>
          </div>
          <div style={{ width: "50%", float: "right" }}>
            <h3> Why should I care? This doesn't seem to bring anything new. </h3>
            <div style={{ width: "90%", textAlign: "left", margin: "auto" }}>
              It doesn't bring any new data, but it brings a new way to see it that brings interesting possibilities.
              For example, if you want to know which champion to ban,
              simply compare the win rate and the play rate of all the champions see which high success champion is played often to make an optimal ban.
              You want to know which champion is the best early? Compare the win rate of champions at 20 minutes with the general win rate and see which champion get the biggest spike.
              The possibilities are endless!
            </div>
          </div>
          <div style={{ width: "50%", float: "left" }}>
            <h3> Where do you get your data? </h3>
            <div style={{ width: "90%", textAlign: "left", margin: "auto" }}>
              The data is collected directly from <a href="http://champion.gg">Champion.gg</a>.
              The data is updated daily to offer you the most recent statistics.
            </div>
          </div>
          <div style={{ width: "50%", float: "right" }}>
            <h3> What programming language did you use? </h3>
            <div style={{ width: "90%", textAlign: "left", margin: "auto" }}>
              Champion Charts is made with React.
              If you want to contribute or see the code that was used to make the website simply visit the &nbsp;
              <a href="https://github.com/Thuranel/championChart">Github's project</a>
            </div>
          </div>
          <div style={{ width: "50%", float: "right" }}>
            <h3> How can I report a bug or suggest a feature? </h3>
            <div style={{ width: "90%", textAlign: "left", margin: "auto" }}>
              Either make a detailed issue on the &nbsp;<a href="https://github.com/Thuranel/championChart">Github's project</a>
              &nbsp; or send a message through reddit to /u/Somethingabouttrain. I'd love to hear your feedback!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
