/// <reference types="jquery" />
/// <reference path="./../angularStub.d.ts" />
import * as fs from "fs";

import * as electron from "electron";
const dialog = electron.remote.dialog;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {alignData} from "./../../alignData";
import * as cf from "./../circularFigure";
import {displayFigure} from "./displayFigure";

import {writeLoadingModal} from "./writeLoadingModal";
import {setSelectedContigByUUID} from "./writeContigEditorModal";

require("angular");
require("angularplasmid");
let app : any = angular.module('myApp',['angularplasmid']);
export class GenomeView extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public firstRender : boolean;
    public alignData : Array<alignData>;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.firstRender = true;
    }
    public onMount() : void{}
    public onUnMount() : void{}
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
                    fs.writeFileSync(fileName,new XMLSerializer().serializeToString(document.getElementById(self.div).children[0]));
                }
            }
        );
    }
    public markerOnClick($event : any,$marker : any,uuid : string) : void
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        setSelectedContigByUUID(uuid);
        masterView.contigEditorModalOpen = true;
        masterView.showModal();
        viewMgr.render();
    }
    public figureNameOnClick() : void
    {
        let self = this;
        dialogs.prompt("Figure Name",this.genome.name,function(text : string){
            if(text)
            {
                self.genome.name = text;
                //Overwrite old template cache for figure
                cf.cacheBaseFigure(self.genome);
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

                genomeView.firstRender = true;
                //Save changes
                masterView.dataChanged();
                //Re render
                viewMgr.render();
            }
        });
    }
    public inputRadiusOnChange()
    {
        this.genome.height = this.genome.radius*10;
        this.genome.width =this.genome.radius*10;
        //Re center figure
        this.postRender();
    }
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
                masterView.loadingModal = true;
                writeLoadingModal();
                masterView.showModal();
                
                let self = this;
                setTimeout(function(){
                    displayFigure(self).then(() => {
                        masterView.loadingModal = false;
                        masterView.dismissModal();
                        setTimeout(function(){
                            window.dispatchEvent(new Event("resize"));
                        },10);
                    });
                },10);
            
                this.firstRender = false;
            }
        }
        return undefined;
    }
    public postRender() : void
    {
        if(this.genome !== undefined)
        {
            //get a reference to the div wrapping the rendered svg graphic of our figure
            let div = document.getElementById(this.div);
            if(div)
            {
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
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new GenomeView("genomeView",div));
}