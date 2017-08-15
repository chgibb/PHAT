/// <reference types="electron" />

import * as electron from "electron";

import * as winMgr from "./winMgr";
const pjson = require("./package.json");
export function appMenu() : Array<Electron.MenuItemConstructorOptions>
{
    return <Array<Electron.MenuItemConstructorOptions>>[
		{
			label: 'View',
			submenu: [
                {
                    label : `Operations`,
                    click(){
                        winMgr.windowCreators["operationViewer"].Create();
                    }
                }
			]
		},
		{
			role: 'window',
			submenu: [
			    {
				    role: 'minimize'
			    },
			    {
				    role: 'close'
			    },
			    {
				    role: 'resetzoom'
			    },
			    {
				    role: 'zoomin'
			    },
			    {
				    role: 'zoomout'
			    },
			    {
				    type: 'separator'
			    },
			    {
				    role: 'togglefullscreen'
			    },
			    {
				    role: 'toggledevtools'
			    }
			]
		},
		{
			role: 'help',
			submenu: [
			    {
				    label: 'About PHAT',
				    click() 
				    { 	
					    electron.dialog.showMessageBox(
					    {
						    type: "info",
						    title: 'About PHAT',
						    message: `PHAT version ${pjson.version}`,
						    buttons: ['OK', 'End User License Agreement', 'Dependent Open Source Licenses' ]
					    },
                        function(response: number) 
					    {
						    if (response == 1)
							    electron.shell.openExternal(`${pjson.repository.url}/blob/master/TERMS`);
						    else if (response == 2)
							    electron.shell.openExternal(`https://chgibb.github.io/PHATDocs/docs/releases/${pjson.version}/thirdParty`);
					    });
				    }
			    },
			    {
				    label: 'Version '+pjson.version+' (64-bit)',
				    enabled: false
			    },
			    {
				    type: 'separator'
			    },
			    {
				    label: 'Send us feedback',
				    click() 
				    {
					    electron.shell.openExternal(`${pjson.repository.url}/issues`);
				    }
			    },
			    {
				    type: 'separator'
			    },	
			    {
				    label: 'Learn More',
				    click() 
				    { 
					    electron.shell.openExternal(`https://chgibb.github.io/PHATDocs/docs/releases/${pjson.version}/home`);
				    }
			    },
			    {
				    type: 'separator'
			    }
		    ]
		}
	];
}