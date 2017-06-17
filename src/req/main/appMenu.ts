/// <reference types="electron" />

import * as electron from "electron";

import * as winMgr from "./winMgr";
const pjson = require("./package.json");
export function appMenu() : Array<Electron.MenuItemOptions>
{
    /*return <Array<Electron.MenuItemOptions>>[
        {
            label : `View`,
            submenu : [
                {
                    label : `Operations`,
                    click(){
                        winMgr.windowCreators["operationViewer"].Create();
                    }
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
            role : 'window',
            submenu : [
                {
                    role : 'minimize'
                },
                {
                    role : 'close'
                }
            ]
        },
        {
            role : 'help',
            submenu : [
                {
                    label : 'About PHAT',
                    click(){
                        electron.dialog.showMessageBox(
                            {
                                type : "info",
                                title : `About PHAT`,
                                message : `PHAT Version ${pjson.version}`,
                                detail : ``,
                                buttons : [`OK`,`EULA`,`Licenses`]
                            },function(response : number){
                                if(response == 1)
                                {
                                    electron.shell.openExternal(`${pjson.repository.url}/blob/master/TERMS`);
                                }
                                if(response == 2)
                                {
                                    electron.shell.openExternal(`${pjson.repository.url}/blob/master/LICENSE`);
                                }
                            }
                        );
                    }
                },
                {
                    label : `Version ${pjson.version} (64-bit)`,
                    enabled : false
                },
                {
                    type : "separator"
                },
                {
                    label : `Send us Feedback`,
                    click(){
                        electron.shell.openExternal(`${pjson.repository.url}/issues`);
                    }
                },
                {
                    label : `Get Support`,
                    click(){
                        electron.shell.openExternal(`${pjson.repository.url}/issues`);
                    }
                },
                {
                    label : `Help Build PHAT`,
                    click(){
                        electron.shell.openExternal(`${pjson.repository.url}/pulls`);
                    }
                }

            ]
        }
        
    ];*/


    return <Array<Electron.MenuItemOptions>>[
		{
			label: 'View',
			submenu: [
                {
                    label : `Operations`,
                    click(){
                        winMgr.windowCreators["operationViewer"].Create();
                    }
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
			role: 'window',
			submenu: [
			    {
				    role: 'minimize'
			    },
			    {
				    role: 'close'
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
							    electron.shell.openExternal(`${pjson.repository.url}/blob/master/LICENSE`);
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
				    label: 'Get Support',
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
					    electron.shell.openExternal(`${pjson.repository.url}`);
				    }
			    },
			    {
				    type: 'separator'
			    }
		    ]
		}
	];
}