//// <reference path="jquery.d.ts" />
/// <reference path="./../angularStub.d.ts" />
import * as util from "util";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import alignData from "./../../alignData";
import {CircularFigure,renderBaseFigure,getBaseFigureFromCache,renderCoverageTracks} from "./../circularFigure";
import * as plasmid from "./../circularGenome/plasmid";
import * as plasmidTrack from "./../circularGenome/plasmidTrack";
import * as trackLabel from "./../circularGenome/trackLabel";
import * as trackMarker from "./../circularGenome/trackMarker";
import * as markerLabel from "./../circularGenome/markerLabel";
import * as trackScale from "./../circularGenome/trackScale";

require("angular");
require("angularplasmid");

let app : any = angular.module('myApp',['angularplasmid']);
export class GenomeView extends viewMgr.View
{
    public genome : CircularFigure;
    public firstRender : boolean;
    public coverageTracks : string;
    public alignData : Array<alignData>;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.firstRender = true;
        this.coverageTracks = "";
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public markerOnClick($event : any,$marker : any,uuid : string) : void
    {
        let self = this;
        ipc.send(
            "runOperation",<AtomicOperationIPC>{
                opName : "renderCoverageTrackForContig",
                figureuuid : self.genome.uuid,
                alignuuid : self.alignData[0].uuid,
                uuid : uuid
            }
        );
        /*renderCoverageTracks(this.genome,uuid,this.alignData[0],function(status,coverageTracks){
            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
            let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
            genomeView.coverageTracks += coverageTracks;
            genomeView.firstRender = true;
            viewMgr.render();
        });*/
    }
    public inputRadiusOnChange()
    {
        this.genome.height = this.genome.radius*5;
        this.genome.width =this.genome.radius*5;
        this.postRender();
        let self = this;
    }
    public showBPTrackOnChange()
    {
        //this method gets called from within angular scope primarily.
        //get a reference to the genome view and set it's firstrender prop to true so the markup can be updated
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        genomeView.firstRender = true;
        viewMgr.render();
    }
    public renderView() : string
    {
        let self = this;
        if(this.genome)
        {
            
            //Only render markup when we explicitly need to
            //All figure updates are handled through angular bindings
            if(this.firstRender){
            try
            {
                document.body.removeChild(document.getElementById("controls"));
            }
            catch(err){}
            try
            {
                //Remove the div this view is bound to
                document.body.removeChild(document.getElementById(this.div));
            }
            catch(err){}
            $("#"+this.div).remove();

            let totalBP = 0;
            for(let i = 0; i != this.genome.contigs.length; ++i)
            {
                totalBP += this.genome.contigs[i].bp;
            }


            //This is an unholy mess adapted from the example given inline in the
            //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
            //We remove the div this view is bound to, recreate it and re render the angular template into it
            //Then we pass the div into angular to compile the templates and then finally inject it all back into
            //the page
            let $div = $(
                `
                <div id="controls">
                    <input type="number" ng-model="genome.radius" ng-change="inputRadiusOnChange()" min="0" max="1000" required>
                     <label>Show BP Positions:
                        <input type="checkbox" ng-model="genome.circularFigureBPTrackOptions.showLabels" ng-true-value="1" ng-false-value="0" ng-change="showBPTrackOnChange()">
                     </label>
                     ${(()=>{
                         let res = ``;
                         if(this.genome.circularFigureBPTrackOptions.showLabels)
                         {
                             res += `
                                <br />
                                <label>Interval:
                                    <input type="number" ng-model="genome.circularFigureBPTrackOptions.interval" required>
                                </label>
                             `;
                         }
                         return res;
                     })()}
                </div>
                <div id="${this.div}" style="z-index=-1;">
                    ${plasmid.add(
                    {
                        sequenceLength : totalBP.toString(),
                        plasmidHeight : "{{genome.height}}",
                        plasmidWidth : "{{genome.width}}"
                    })}
                        ${getBaseFigureFromCache(this.genome)}
                        ${self.coverageTracks}
                    ${plasmid.end()}
                </div>
                `
            );
           /* let $div = $
            (
                `
                <div id="controls">
                    <input type="number" ng-model="genome.radius" ng-change="inputRadiusOnChange()" min="0" max="1000" required>
                     <label>Show BP Positions:
                        <input type="checkbox" ng-model="genome.circularFigureBPTrackOptions.showLabels" ng-true-value="1" ng-false-value="0" ng-change="showBPTrackOnChange()">
                     </label>
                     ${(()=>{
                         let res = ``;
                         if(this.genome.circularFigureBPTrackOptions.showLabels)
                         {
                             res += `
                                <br />
                                <label>Interval:
                                    <input type="number" ng-model="genome.circularFigureBPTrackOptions.interval" required>
                                </label>
                             `;
                         }
                         return res;
                     })()}
                </div>
                <div id="${this.div}" style="z-index=-1;">
                    ${plasmid.add(
                    {
                        sequenceLength : totalBP.toString(),
                        plasmidHeight : "{{genome.height}}",
                        plasmidWidth : "{{genome.width}}"
                    })}
                        ${plasmidTrack.add(
                        {
                            trackStyle : "fill:#f0f0f0;stroke:#ccc",
                            radius : "{{genome.radius}}"
                        })}
                            ${trackLabel.add(
                            {
                                text : this.genome.contigs[0].name,
                                labelStyle : "font-size:20px;font-weight:400"
                            })}
                            ${trackLabel.end()}
                            ${(()=>
                            {
                                let res = "";
                                let lastLocation = 0;
                                for(let i = 0; i != this.genome.contigs.length; ++i)
                                { 
                                    res += `
                                        ${trackMarker.add(
                                        {
                                            start : lastLocation.toString(),
                                            end : (lastLocation + this.genome.contigs[i].bp).toString(),
                                            markerStyle : `fill:${this.genome.contigs[i].color}`,
                                            uuid : this.genome.contigs[i].uuid,
                                            onClick : "markerOnClick"
                                        })}
                                            ${markerLabel.add(
                                            {
                                                type : "path",
                                                text : this.genome.contigs[i].name
                                            })}
                                            ${markerLabel.end()}
                                        ${trackMarker.end()}
                                    `;
                                    lastLocation = lastLocation + this.genome.contigs[i].bp;
                                }
                                return res; 
                            })()}
                            ${trackScale.add(
                            {
                                interval : "{{genome.circularFigureBPTrackOptions.interval}}",
                                vAdjust : "{{genome.circularFigureBPTrackOptions.vAdjust}}",
                                showLabels : "{{genome.circularFigureBPTrackOptions.showLabels}}"
                            }
                            )}
                            ${trackScale.end()}
                        ${plasmidTrack.end()}
                    ${plasmid.end()}
                </div>
            `);*/
            $(document.body).append($div);
            angular.element(document).injector().invoke
            (
                function($compile : any)
                {
                    //This should probably be done with an actual angular scope instead 
                    //of mutating the existing scope
                    let scope = angular.element($div).scope();
                    scope.genome = self.genome;
                    scope.alignData = self.alignData;
                    scope.markerOnClick = self.markerOnClick;
                    scope.inputRadiusOnChange = self.inputRadiusOnChange;
                    scope.showBPTrackOnChange = self.showBPTrackOnChange;
                    scope.coverageTracks = self.coverageTracks;
                    scope.postRender = self.postRender;
                    scope.firstRender = self.firstRender;
                    scope.div = self.div;
                    $compile($div)(scope);
                }
            );
            this.firstRender = false;
        }}
        return undefined;
    }
    public postRender() : void
    {
        if(this.genome !== undefined)
        {
            //get a reference to the div wrapping the rendered svg graphic of our figure
            let div = document.getElementById(this.div);

            //expand the div to the new window size
            div.style.zIndex = "-1";
            div.style.position = "absolute";
            div.style.height = `${$(window).height()}px`;
            div.style.width = `${$(window).width()}px`;

            let x = 0;
            let y = 0;
            //center the div in the window
            x = ($(window).width()/2)-(this.genome.width/2);
            y = ($(window).height()/2)-(this.genome.height/2);
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
        }
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new GenomeView("genomeView",div));
}