"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const uuidv4 = require("uuid/v4");
const mkdirp = require("mkdirp");
const getAppPath_1 = require("./../getAppPath");
const fastaContigLoader = require("./../fastaContigLoader");
const plasmidTrack = require("./circularGenome/plasmidTrack");
const trackLabel = require("./circularGenome/trackLabel");
const trackMarker = require("./circularGenome/trackMarker");
const markerLabel = require("./circularGenome/markerLabel");
const trackScale = require("./circularGenome/trackScale");
class Contig extends fastaContigLoader.Contig {
    constructor() {
        super(...arguments);
        this.color = "";
        this.opacity = 1.0;
        this.fontSize = "";
        this.fontWeight = "";
        this.fontFill = "";
        this.allowPositionChange = false;
    }
}
exports.Contig = Contig;
function initContigForDisplay(contig, allowPositionChange = false) {
    contig.color = getRandColor(1);
    contig.opacity = 1.0;
    contig.fontFill = "rgb(0,0,0)";
    contig.allowPositionChange = allowPositionChange;
    contig.vAdjust = 0;
}
exports.initContigForDisplay = initContigForDisplay;
function getRandColor(brightness) {
    let rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    let mix = [brightness * 51, brightness * 51, brightness * 51];
    let mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0); });
    return "rgb(" + mixedrgb.join(",") + ")";
}
class CircularFigureBPTrackOptions {
    constructor() {
        this.interval = 500;
        this.vAdjust = 5;
        this.showLabels = 0;
        this.direction = "out";
    }
}
exports.CircularFigureBPTrackOptions = CircularFigureBPTrackOptions;
class RenderedTrackRecord {
    constructor(uuidAlign, uuidContig, uuidFigure, colour, path) {
        this.uuid = uuidv4();
        this.uuidAlign = uuidAlign;
        this.uuidContig = uuidContig;
        this.uuidFigure = uuidFigure;
        this.path = path;
        this.checked = false;
        this.colour = colour;
    }
}
exports.RenderedTrackRecord = RenderedTrackRecord;
class RenderedCoverageTrackRecord extends RenderedTrackRecord {
    constructor(uuidAlign, uuidContig, uuidFigure, colour, path) {
        super(uuidAlign, uuidContig, uuidFigure, colour, path);
    }
}
exports.RenderedCoverageTrackRecord = RenderedCoverageTrackRecord;
class RenderedSNPTrackRecord extends RenderedTrackRecord {
    constructor(uuidAlign, uuidContig, uuidFigure, colour, path) {
        super(uuidAlign, uuidContig, uuidFigure, colour, path);
    }
}
exports.RenderedSNPTrackRecord = RenderedSNPTrackRecord;
class CircularFigure {
    constructor(name, uuid, contigs) {
        this.uuidFasta = uuid;
        this.uuid = uuidv4();
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = this.radius * 10;
        this.width = this.radius * 10;
        this.circularFigureBPTrackOptions = new CircularFigureBPTrackOptions();
        this.renderedCoverageTracks = new Array();
        this.renderedSNPTracks = new Array();
        for (let i = 0; i != this.contigs.length; ++i) {
            initContigForDisplay(this.contigs[i]);
        }
        if (this.contigs.length == 1) {
            this.contigs.push(new Contig());
            this.contigs[1].color = this.contigs[0].color;
            this.contigs[1].uuid = "filler";
            this.contigs[1].bp = 1;
            this.contigs[1].loaded = true;
        }
        this.customContigs = new Array();
        cacheBaseFigure(this);
    }
}
exports.CircularFigure = CircularFigure;
function renderContig(contig, start = -1, end = -1) {
    if (start == -1)
        start = contig.start;
    if (end == -1)
        end = contig.end;
    let res = "";
    res += `
        ${trackMarker.add({
        start: start.toString(),
        end: end.toString(),
        vAdjust: contig.vAdjust,
        markerStyle: `fill:${contig.color};opacity:${contig.opacity};`,
        uuid: contig.uuid,
        onClick: "markerOnClick"
    })}
            ${markerLabel.add({
        type: "path",
        text: contig.alias,
        labelStyle: `fill:${contig.fontFill};opacity:${contig.opacity};`
    })}
            ${markerLabel.end()}
        ${trackMarker.end()}
    `;
    return res;
}
exports.renderContig = renderContig;
function renderBaseFigure(figure) {
    return `
        ${plasmidTrack.add({
        trackStyle: "fill:#f0f0f0;stroke:#ccc",
        radius: "{{genome.radius}}"
    })}
            ${trackLabel.add({
        text: figure.name,
        labelStyle: "font-size:20px;font-weight:400",
        onClick: "figureNameOnClick"
    })}
            ${trackLabel.end()}
            ${(() => {
        let res = "";
        let lastLocation = 0;
        for (let i = 0; i != figure.contigs.length; ++i) {
            res += renderContig(figure.contigs[i], lastLocation, lastLocation + figure.contigs[i].bp);
            lastLocation = lastLocation + figure.contigs[i].bp;
        }
        for (let i = 0; i != figure.customContigs.length; ++i) {
            res += renderContig(figure.customContigs[i], figure.customContigs[i].start, figure.customContigs[i].end);
        }
        return res;
    })()}
            ${trackScale.add({
        interval: "{{genome.circularFigureBPTrackOptions.interval}}",
        vAdjust: "{{genome.circularFigureBPTrackOptions.vAdjust}}",
        showLabels: "{{genome.circularFigureBPTrackOptions.showLabels}}",
        direction: "{{genome.circularFigureBPTrackOptions.direction}}"
    })}
        ${trackScale.end()}
    ${plasmidTrack.end()}
    `;
}
exports.renderBaseFigure = renderBaseFigure;
function cacheBaseFigure(figure) {
    try {
        fs.mkdirSync(getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}`));
    }
    catch (err) { }
    fs.writeFileSync(getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`), renderBaseFigure(figure));
}
exports.cacheBaseFigure = cacheBaseFigure;
function getBaseFigureFromCache(figure) {
    return fs.readFileSync(getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`));
}
exports.getBaseFigureFromCache = getBaseFigureFromCache;
function getBaseBP(figure, contiguuid) {
    let base = 0;
    for (let i = 0; i != figure.contigs.length; ++i) {
        if (figure.contigs[i].uuid == contiguuid)
            return base;
        base += figure.contigs[i].bp;
    }
    return -1;
}
function renderCoverageTrack(figure, contiguuid, align, cb, colour = "rgb(64,64,64)") {
    let coverageTracks = "";
    let rl = readline.createInterface({
        input: fs.createReadStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${align.uuid}/contigCoverage/${contiguuid}`))
    });
    let baseBP = getBaseBP(figure, contiguuid);
    if (baseBP == -1)
        throw new Error("Could not get base position of " + figure.name + " for reference");
    let depths = new Array();
    rl.on("line", function (line) {
        let tokens = line.split(/\s/g);
        let depth = parseInt(tokens[1]);
        let found = false;
        for (let i = 0; i != depths.length; ++i) {
            if (depths[i].depth == depth) {
                depths[i].positions.push(parseInt(tokens[0]));
                found = true;
                break;
            }
        }
        if (!found) {
            depths.push({
                depth: depth,
                positions: [parseInt(tokens[0])]
            });
        }
    });
    rl.on("close", function () {
        depths.sort(function (a, b) { return a.depth - b.depth; });
        for (let i = 0; i != depths.length; ++i) {
            depths[i].positions.sort(function (a, b) { return a - b; });
            let res = "";
            res += `<plasmidtrack trackstyle="fill-opacity:0.0;fill:${colour}" width="10" radius="{{genome.radius+${100 + depths[i].depth}}}" >`;
            for (let k = 0; k != depths[i].positions.length; ++k) {
                let offset = 1;
                let prev = depths[i].positions[k];
                let initial = k;
                while (depths[i].positions[k + offset] == depths[i].positions[initial] + offset) {
                    if (k + offset == depths[i].positions.length)
                        break;
                    offset++;
                }
                k = k + (offset - 1);
                res += `<trackmarker start="${baseBP + depths[i].positions[initial]}" end="${baseBP + depths[i].positions[initial] + offset}" markerstyle="fill:${colour};stroke-width:1px;" wadjust="-8"></trackmarker>`;
            }
            res += `</plasmidtrack>`;
            coverageTracks += res;
        }
        cb(true, coverageTracks);
    });
}
exports.renderCoverageTrack = renderCoverageTrack;
function cacheCoverageTrack(figure, contiguuid, align, cb, colour = "rgb(64,64,64)") {
    try {
        mkdirp.sync(getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`));
    }
    catch (err) { }
    renderCoverageTrack(figure, contiguuid, align, function (status, coverageTracks) {
        if (status == true) {
            let trackRecord = new RenderedCoverageTrackRecord(align.uuid, contiguuid, figure.uuid, colour, "");
            trackRecord.path = getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}/${trackRecord.uuid}`);
            fs.writeFileSync(trackRecord.path, coverageTracks);
            figure.renderedCoverageTracks.push(trackRecord);
        }
        cb(status, coverageTracks);
    }, colour);
}
exports.cacheCoverageTrack = cacheCoverageTrack;
function renderSNPTrack(figure, contiguuid, align, cb, colour = "rgb(64,64,64)") {
    let SNPTracks = "";
    let rl = readline.createInterface({
        input: fs.createReadStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${align.uuid}/snps.vcf`))
    });
    let baseBP = getBaseBP(figure, contiguuid);
    if (baseBP == -1)
        throw new Error("Could not get base position of " + figure.name + " for reference");
    let SNPPositions = new Array();
    rl.on("line", function (line) {
        let tokens = line.split(/\s/g);
        for (let i = 0; i != figure.contigs.length; ++i) {
            if (tokens[0] == (figure.contigs[i].name.split(/\s/g))[0]) {
                SNPPositions.push({
                    position: baseBP + parseInt(tokens[1]),
                    relativePosition: parseInt(tokens[1]),
                    from: tokens[2],
                    to: tokens[3],
                    adjust: 20,
                    colour: colour
                });
            }
        }
    });
    rl.on("close", function () {
        SNPPositions.sort(function (a, b) { return a.position - b.position; });
        for (let i = 0; i != SNPPositions.length; ++i) {
            for (let k = 0; k != SNPPositions.length; ++k) {
                if (i != k && i < k) {
                    if ((SNPPositions[k].position - SNPPositions[i].position) <= 85) {
                        SNPPositions[k].adjust += 85;
                    }
                }
            }
        }
        for (let i = 0; i != SNPPositions.length; ++i) {
            SNPTracks += `
                <plasmidtrack width="20" trackstyle="fill-opacity:0.0" radius="{{genome.radius}}">
                    <trackmarker start="${SNPPositions[i].position}" markerstyle="stroke:${SNPPositions[i].colour};stroke-dasharray:2,2;stroke-width:2px;" wadjust="{{genome.radius+${SNPPositions[i].adjust}}}">
                        <markerlabel style="font-size:20px;fill:${SNPPositions[i].colour}" text="${SNPPositions[i].from}${SNPPositions[i].relativePosition}${SNPPositions[i].to}" vadjust="{{genome.radius+${SNPPositions[i].adjust}}}"></markerlabel>
                    </trackmarker>
                </plasmidtrack> 
                `;
        }
        cb(true, SNPTracks);
    });
}
exports.renderSNPTrack = renderSNPTrack;
function cacheSNPTrack(figure, contiguuid, align, cb, colour = "rgb(64,64,64)") {
    try {
        mkdirp.sync(getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/snp/${align.uuid}/${contiguuid}`));
    }
    catch (err) { }
    renderSNPTrack(figure, contiguuid, align, function (status, SNPTracks) {
        if (status == true) {
            let trackRecord = new RenderedSNPTrackRecord(align.uuid, contiguuid, figure.uuid, colour, "");
            trackRecord.path = getAppPath_1.getReadableAndWritable(`rt/circularFigures/${figure.uuid}/snp/${align.uuid}/${contiguuid}/${trackRecord.uuid}`);
            fs.writeFileSync(trackRecord.path, SNPTracks);
            figure.renderedSNPTracks.push(trackRecord);
        }
        cb(status, SNPTracks);
    }, colour);
}
exports.cacheSNPTrack = cacheSNPTrack;
