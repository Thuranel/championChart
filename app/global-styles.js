import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  
  .d3-tip {
    line-height: 1;
    font-weight: bold;
    font-size: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 2px;
  }

  /* Creates a small triangle extender for the tooltip */
  .d3-tip:after {
    box-sizing: border-box;
    display: inline;
    font-size: 10px;
    width: 100%;
    line-height: 1;
    color: rgba(0, 0, 0, 0.8);
    content: "\\25BC";
    position: absolute;
    text-align: center;
  }
  
  /* Style northward tooltips differently */
  .d3-tip.n:after {
    margin: -1px 0 0 0;
    top: 100%;
    left: 0;
  }
  
  .grid line {
    stroke-opacity: 0.2;
  }
  
  select {
    border: 1px solid;
    text-align: center;
    text-align-last: center;
    border-radius: 5px;
    outline: none;
    height: 30px;
  }
  
  .gold-text {
    color: #D5AD6D; 
    background: -webkit-linear-gradient(transparent, transparent), 
                -webkit-linear-gradient(top, rgba(213,173,109,1) 0%, 
                 rgba(213,173,109,1) 26%, rgba(226,186,120,1) 35%, 
                 rgba(163,126,67,1) 45%, rgba(145,112,59,1) 61%, 
                 rgba(213,173,109,1) 100%);
    background: -o-linear-gradient(transparent, transparent); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
  }
 
  #banner {
    height: 60px;
    float: left;
    margin-top: 10px;
  }
  
  #header {
    padding: 0 16px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
  }
 
`;
