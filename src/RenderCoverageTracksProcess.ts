import * as fs from "fs";
import * as readline from "readline";

import alignData from "./req/alignData"
import * as cf from "./req/renderer/circularFigure";

let align : alignData;
let contiguuid : string;
let circularFigure : cf.CircularFigure;