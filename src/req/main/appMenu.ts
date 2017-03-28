import * as electron from "electron";
var pjson = require('./package.json');
import * as winMgr from "./winMgr";

const menuTemplate: Array<Electron.MenuItemOptions> = [
    {
        label: 'File',
        submenu: [
        {
            label: 'Clear workspace', 
            accelerator: 'Control+Shift+Q', 
            click ()  
            {    
                electron.shell.moveItemToTrash("resources/app/rt"); 
                electron.dialog.showMessageBox( 
                { 
                    type: "info", 
                    title: 'Important', 
                    message: 'You will need to restart PHAT.', 
                    detail: 'The workspace data was cleared and will be refreshed on next load.', 
                    buttons: ['OK'] 
                }) 
            } 
        }, 
        { 
        },
        {
            label: 'Preferences',
            accelerator: 'Control+,'
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit PHAT',
            role: 'quit'
        }
        ]
    },
    {
        label: 'View',
        submenu: [
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
            click () 
            { 	
                winMgr.windowCreators["about"].Create();

                electron.dialog.showMessageBox(
                {
                    type: "info",
                    title: 'About PHAT',
                    message: 'PHAT version '+pjson.version+'',
                    detail: 'PHAT is built in Thunder Bay, Ontario',
                    buttons: ['OK', 'End User License Agreement', 'Dependent Open Source Licenses' ]
                },function(response: number) 
                {
                    if (response == 1)
                        electron.shell.openExternal(''+pjson.repository.url+'/blob/master/TERMS')
                    else if (response == 2)
                        electron.shell.openExternal(''+pjson.repository.url+'/blob/master/LICENSE')
                }) 
            }
        },
        {
            label: 'Version '+pjson.version+' (64-bit)',
            enabled: false

        },
        {
            label: 'View Release Notes', 
            click () 
            { 
                electron.shell.openExternal(''+pjson.repository.url+'/releases/tag/'+pjson.version+'') 
            }

        },
        {
            type: 'separator'

        },
        {
            label: 'Send us feedback',
            click () 
            { 
                electron.shell.openExternal('mailto:'+pjson.author.email+'?subject=PHAT%20Feedback') 
            }

        },
        {
            label: 'Get Support',
            click () 
            { 
                electron.shell.openExternal('mailto:'+pjson.author.email+'?subject=PHAT%20Support') 
            }
        },
        {
            type: 'separator'
        },	
        {
            label: 'Learn More',
            click () 
            { 
                electron.shell.openExternal('http://zehbelab.weebly.com/') 
            }
        },
        {
            type: 'separator'
        },	
        {
            label: 'Powered by ZehbeLab',
            submenu: [
                {
                    label: ''+pjson.author.name+'',
                    click () 
                    { 
                        electron.shell.openExternal(''+pjson.author.url+'') 
                    }
                },
                {
                    label: ''+pjson.contributors[0].name+'',
                    click () 
                    { 
                        electron.shell.openExternal(''+pjson.contributors[0].url+'') 
                    }
                },
                {
                    label: ''+pjson.contributors[1].name+'',
                    click () 
                    { 
                        electron.shell.openExternal(''+pjson.contributors[1].url+'') 
                    }
                },
                {
                    label: ''+pjson.contributors[2].name+'',
                    click () 
                    { 
                        electron.shell.openExternal(''+pjson.contributors[2].url+'') 
                    }
                }
            ]
        }
        ]
    }
]

export let menu : Electron.Menu = electron.Menu.buildFromTemplate(menuTemplate);



		