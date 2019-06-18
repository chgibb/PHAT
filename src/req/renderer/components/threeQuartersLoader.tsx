import * as React from "react";
import {cssRaw} from "typestyle";

cssRaw(`
@-moz-keyframes three-quarters-loader {
    0% {
      -moz-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes three-quarters-loader {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes three-quarters-loader {
    0% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /* :not(:required) hides this rule from IE9 and below */
  .three-quarters-loader:not(:required) {
    -moz-animation: three-quarters-loader 1250ms infinite linear;
    -webkit-animation: three-quarters-loader 1250ms infinite linear;
    animation: three-quarters-loader 1250ms infinite linear;
    border: 8px solid #38e;
    border-right-color: transparent;
    border-radius: 16px;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    overflow: hidden;
    text-indent: -9999px;
    width: 32px;
    height: 32px;
  }
  
`);

export function ThreeQuartersLoader() : JSX.Element 
{
    return (
        <div className="three-quarters-loader" />
    );
}

