/// <reference types="jquery" />
/// <reference path="./../angularStub.d.ts" />
import * as fs from "fs";

import * as electron from "electron";
const dialog = electron.remote.dialog;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {AlignData} from "./../../alignData";
import * as cf from "./../circularFigure";
import {displayFigure} from "./displayFigure";
import {centreInteractiveFigure,centreNonInteractiveFigure} from "./centreFigure";
import {changeWindowTitle} from "./../changeWindowTitle";
import {showGenericLoadingSpinnerInNavBar,hideSpinnerInNavBar} from "./loadingSpinner";
import {setSelectedContigByUUID} from "./writeContigEditorModal";
import {reCacheBaseFigure} from "./reCacheBaseFigure";
import * as tc from "./templateCache";

require("angular");
require("@chgibb/angularplasmid");
let app : any = angular.module('myApp',['angularplasmid']);
/**
 * Manages the display and behaviour of the figure being edited
 * 
 * @export
 * @class GenomeView
 * @extends {viewMgr.View}
 * @implements {cf.FigureCanvas}
 */
export class GenomeView extends viewMgr.View implements cf.FigureCanvas
{
    /**
     * The current figure being displayed
     * 
     * @type {cf.CircularFigure}
     * @memberof GenomeView
     */
    public genome : cf.CircularFigure;
    /**
     * Reconstruct the figure using cached data
     * 
     * @type {boolean}
     * @memberof GenomeView
     */
    public firstRender : boolean;
    /**
     * Aligns for this figure
     * 
     * @type {Array<AlignData>}
     * @memberof GenomeView
     */
    public alignData : Array<AlignData>;
    /**
     * Bound Angular scope for genome
     * 
     * @type {*}
     * @memberof GenomeView
     */
    public scope : any;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.firstRender = true;
    }
    public onMount() : void{}
    public onUnMount() : void{}
    /**
     * Update the Angular scope for genome
     * 
     * @param {cf.FigureCanvas} [scope] 
     * @returns {void} 
     * @memberof GenomeView
     */
    public updateScope(scope? : cf.FigureCanvas) : void
    {
        if(!this.genome.isInteractive)
            return;
        if(scope)
            this.scope = scope;
        this.scope.genome = this.genome;
        this.scope.alignData = this.alignData;
        this.scope.markerOnClick = this.markerOnClick;
        this.scope.figureNameOnClick = this.figureNameOnClick;
        this.scope.inputRadiusOnChange = this.inputRadiusOnChange;
        this.scope.showBPTrackOnChange = this.showBPTrackOnChange;
        this.scope.exportSVG = this.exportSVG;
        this.scope.postRender = this.postRender;
        this.scope.firstRender = this.firstRender;
        this.scope.div = this.div;
    }
    
    /**
     * Export genome to SVG
     * 
     * @memberof GenomeView
     */
    public exportSVG()
    {   
        let self = this;
        dialog.showSaveDialog(
            <Electron.SaveDialogOptions>{
                title : "Save figure as SVG",
                filters : <{
                    name : string,
                    extensions : string[]
                }[]>
                [
                    {
                        name : "Scalable Vector Graphic",
                        extensions : <string[]>[
                            "svg"
                        ]
                    }
                ]
            },function(fileName : string)
            {
                if(fileName)
                {
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                    
                }
            }
        );
    }
    /**
     * Called when a trackMarker is clicked by the user
     * 
     * @param {*} $event 
     * @param {*} $marker 
     * @param {string} uuid 
     * @memberof GenomeView
     */
    public markerOnClick($event : any,$marker : any,uuid : string) : void
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        setSelectedContigByUUID(uuid);
        masterView.contigEditorModalOpen = true;
        masterView.showModal();
        viewMgr.render();
    }
    /**
     * Called when the name of the figure is clicked by the user
     * 
     * @memberof GenomeView
     */
    public figureNameOnClick() : void
    {
        let self = this;
        dialogs.prompt("Figure Name",this.genome.name,function(text : string){
            if(text)
            {
                self.genome.name = text;
                //Overwrite old template cache for figure
                cf.cacheBaseFigureTemplate(self.genome);
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                
                //Save changes
                masterView.saveFigureChanges();
                changeWindowTitle(self.genome.name);
                //Re render
                genomeView.firstRender = true;
                viewMgr.render();
            }
        });
    }
    /**
     * Should be called when genome.radius changes
     * 
     * @memberof GenomeView
     */
    public inputRadiusOnChange()
    {
        this.genome.height = this.genome.radius*10;
        this.genome.width =this.genome.radius*10;
        //Re center figure
        this.postRender();
    }
    /**
     * Should be called when the track interval changes
     * 
     * @memberof GenomeView
     */
    public showBPTrackOnChange()
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        genomeView.firstRender = true;
        viewMgr.render();
    }
    public renderView() : string
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let self = this;

        if(this.genome)
        {
            
            //Only render markup when we explicitly need to
            //All figure updates are handled through angular bindings
            if(this.firstRender)
            {
                let startUp = performance.now();
                showGenericLoadingSpinnerInNavBar();
                
                let self = this;
                setTimeout(function(){
                    displayFigure(self).then(() => {
                        hideSpinnerInNavBar();
                        setTimeout(function(){
                            window.dispatchEvent(new Event("resize"));
                            console.log(`re-rendering figure took ${(performance.now()-startUp)}`);
                        },10);
                    });
                },10);
            
                this.firstRender = false;
            }
        }
        else
            return " ";
        return undefined;
    }
    /**
     * Recenter figure and clean artifacts
     * 
     * @memberof GenomeView
     */
    public postRender() : void
    {
        if(this.genome !== undefined)
        {
            if(this.genome.isInteractive)
                centreInteractiveFigure(document.getElementById(this.div),this.genome);
            else
                centreNonInteractiveFigure(this.genome);
        }

        /*
            Occasionally, on large figures, especially when growing them by a significant radius, if angular element.scope() happens to return
            undefined as in https://github.com/angular/angular.js/issues/9515, our solution is to abort and defer compilation by a second (see displayFigure.ts).
            This deferement can sometimes, in conjuction with newly compiled SVG tracks coming in, cause angular to duplicate the figure into 
            new divs with all bindings broken. The
            cloned divs will have the same id as the real div, but their figures will be completely non functional. 
            Here, we walk all divs that have been passed through angular and look for the id of the editor div. If there is more than one, then this bug has occured and we will
            blow away all of the divs and trigger a rerender.
        */
        let svgWrappers = document.getElementsByClassName("ng-scope");
        let found  = new Array<Element>();
        for(let i = 0; i != svgWrappers.length; ++i)
        {
            if(svgWrappers[i].id == this.div)
                found.push(svgWrappers[i]);
        }
        if(found.length > 1)
        {
            console.log(`Figure multiplied to ${found.length}`);
            for(let i = 0; i != found.length; ++i)
            {
                found[i].parentNode.removeChild(found[i]);
            }
            this.firstRender = true;
            viewMgr.render();
        }
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new GenomeView("genomeView",div));
}