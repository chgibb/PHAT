/**
 * Shared window management objects and methods.
 * @module req/main/window
 */
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

import * as dataMgr from "./dataMgr";
import {GetKeyEvent,KeyChangeEvent} from "./../ipcEvents";
import {getReadable} from "../getAppPath";


export class WindowRef
{
	public name : string;
	public window : Electron.BrowserWindow;
	public constructor(name : string, window : Electron.BrowserWindow)
	{
		this.name = name;
		this.window = window;
	}
}
export interface WindowCreator
{	
	Create : () => void;
}
let windows = new Array<WindowRef>();
export let windowCreators : {
	[index : string] : WindowCreator;
} = {};

/**
 * Opens ref with the given refName
 * 
 * @export
 * @param {string} refName 
 * @param {Electron.BrowserWindow} ref 
 */
export function pushWindow(refName : string,ref : Electron.BrowserWindow) : void
{
	windows.push(new WindowRef(refName,ref));
}

/**
 * Get the PIDs of all open window's webContents
 * 
 * @export
 * @returns {Array<number>} 
 */
export function getWindowPIDs() : Array<number>
{
	for(let i : number = windows.length - 1; i >= 0; --i)
	{
		try
		{
			windows[i].window.isResizable();
		}
		catch(err)
		{
			windows.splice(i,1);
		}
	}
	let res = new Array<number>();
	for(let i = 0; i != windows.length; ++i)
	{
		res.push(windows[i].window.webContents.getOSProcessId());
	}
	return res;
}

/**
 * Get all WebContents not associated with a BrowserWindow
 * 
 * @export
 * @returns {Array<Electron.WebContents>} 
 */
export function getFreeWebContents() : Array<Electron.WebContents>
{
	for(let i : number = windows.length - 1; i >= 0; --i)
	{
		try
		{
			windows[i].window.isResizable();
		}
		catch(err)
		{
			windows.splice(i,1);
		}
	}
	let res = new Array<Electron.WebContents>();

	let webContents = electron.webContents.getAllWebContents();

	for(let i = 0; i != webContents.length; ++i)
	{
		let found = false;
		for(let k = 0; k != windows.length; ++k)
		{
			if(webContents[i].id == windows[k].window.webContents.id)
			{
				found = true;
				break;
			}
		}
		if(!found)
			res.push(webContents[i]);
	}

	return res;
}

/**
 * Get all open windows
 * 
 * @export
 * @returns {Array<WindowRef>} 
 */
export function getOpenWindows() : Array<WindowRef>
{
	for(let i : number = windows.length - 1; i >= 0; --i)
	{
		try
		{
			windows[i].window.isResizable();
		}
		catch(err)
		{
			windows.splice(i,1);
		}
	}
	return windows;
}

/**
 * Close all windows except those with the given refName
 * 
 * @export
 * @param {string} refName 
 */
export function closeAllExcept(refName : string) : void
{
	for(let i : number = windows.length - 1; i >= 0; --i)
	{
		try
		{
			windows[i].window.isResizable();
		}
		catch(err)
		{
			windows.splice(i,1);
		}
	}
	for(let i : number = 0; i != windows.length; ++i)
	{
		if(windows[i].name != refName)
			windows[i].window.close();
	}
}

/**
 * Get all windows with the given refName
 * 
 * @export
 * @param {string} refName 
 * @returns {Array<Electron.BrowserWindow>} 
 */
export function getWindowsByName(refName : string) : Array<Electron.BrowserWindow>
{
	let res : Array<Electron.BrowserWindow> = new Array<Electron.BrowserWindow>();
	for(let i : number = windows.length - 1; i >= 0; --i)
	{
		try
		{
			windows[i].window.isResizable();
		}
		catch(err)
		{
			windows.splice(i,1);
		}
	}
	for(let i = 0; i != windows.length; ++i)
	{
		if(windows[i].name == refName)
		{
			res.push(windows[i].window);
		}
	}
	return res;
}

/**
 * Sends the specified key to the given sender using refName
 * 
 * @export
 * @param {string} channel 
 * @param {string} key 
 * @param {string} refName 
 * @param {Electron.WebContents} sender 
 */
export function pushKeyTo(
    channel : string,
    key : string,
    refName : string,
    sender : Electron.WebContents) : void
{
    if(dataMgr.getChannel(channel))
    {
        sender.send(
            refName,
            <GetKeyEvent>{
                replyChannel : refName,
                channel : channel,
                key : key,
                val : dataMgr.getKey(channel,key),
                action : "getKey"
            }
        );
    }
}
/**
 * Push key on channel to all subscribing webcontents
 * 
 * @export
 * @param {string} channel 
 * @param {string} key 
 */
export function publishChangeForKey(channel : string,key : string) : void
{
    for(let i : number = 0; i != dataMgr.keySubs.length; ++i)
    {
        if(dataMgr.keySubs[i].channel == channel)
        {
            let windows = getWindowsByName(dataMgr.keySubs[i].replyChannel);
            for(let k : number = 0; k != windows.length; ++k)
            {
                windows[k].webContents.send(
                    dataMgr.keySubs[i].replyChannel,
                    <KeyChangeEvent>{
                        action : "keyChange",
                        channel : channel,
                        key : key,
                        val : dataMgr.getKey(channel,key)
                    }
                );
			}
			let webContents = getFreeWebContents();
			for(let k : number = 0; k != webContents.length; ++k)
            {
                webContents[k].send(
                    dataMgr.keySubs[i].replyChannel,
                    <KeyChangeEvent>{
                        action : "keyChange",
                        channel : channel,
                        key : key,
                        val : dataMgr.getKey(channel,key)
                    }
                );
			}
        }
    }
}
/**
 * Initializes window options on refName
 * 
 * @export
 * @param {string} title - Text to display on window border
 * @param {string} refName - State channel for this window to save it's bounds and position to / load from
 * @param {number} width - Width to initialize window with 
 * @param {number} height - Height to initialize window with
 * @param {boolean} [debug] - Turn on dev tools on window open
 * @param {boolean} [alwaysOnTop] - Window will always be ontop of all other windows
 * @param {number} [minWidth] - Minimum width for window
 * @param {number} [minHeight] - Minimum height for window
 */
export function initWindowOptions(
	title : string,
	refName : string,
	width : number,
	height : number,
	alwaysOnTop? : boolean,
	minWidth? : number,
	minHeight? : number
) : void {
	let windowOptions : Electron.BrowserWindowConstructorOptions = dataMgr.getKey(refName,"windowOptions");
	if(!windowOptions)
	{
		let display = electron.screen.getPrimaryDisplay();
		if(refName == "toolBar")
		{
			width = display.workArea.width/4;
			height = display.workArea.height/8;
		}
		let x = (display.workArea.width/2)-(width/2);
		let y = 0;
		windowOptions = 
		{
			x : x,
			y : y,
			width : width,
			height : height,
			useContentSize : false,
			center : true,
			minWidth: minWidth,
			minHeight: minHeight,
			resizable : true,
			movable : true,
			minimizable : true,
			maximizable : true,
			closable : true,
			alwaysOnTop : alwaysOnTop,
			fullscreen : false,
			title : title,
			icon : './../icon.png',
			webPreferences : {
				nodeIntegrationInWorker : true
			}
			
		};
		
		dataMgr.setKey(refName,"windowOptions",windowOptions);
	}
}
/**
 * Opens a new window using window options identified by refName
 * 
 * @export
 * @param {string} refName - State channel to retrieve options from. Must be already initialized
 * @param {string} html - URL to load
 * @param {boolean} debug - Initial state of devtools
 * @returns {Electron.BrowserWindow} 
 */
export function createFromOptions(
	refName : string,
	html : string,
	debug : boolean
) : Electron.BrowserWindow
{
		let windowOptions : Electron.BrowserWindowConstructorOptions = dataMgr.getKey(refName,"windowOptions");

		let ref = new BrowserWindow(windowOptions);

		ref.loadURL(html);
		if(debug)
			ref.webContents.openDevTools();
	
		ref.on
		(
			'close',function()
			{
				saveBounds(ref,refName);
			}
		);
		ref.on
		(
			'move',function()
			{
				saveBounds(ref,refName);
			}
		);
		ref.on
		(
			'resize',function()
			{
				saveBounds(ref,refName);
			}
		);
		return ref;
}
/**
 * Create an empty webcontents host window, hooking into sizing and options for
 * refName
 * 
 * @export
 * @param {string} refName 
 * @returns {Promise<void>} 
 */
export function createWCHost(refName : string) : Promise<void>
{
	return new Promise<void>((resolve,reject) => {
		let windowOptions : Electron.BrowserWindowConstructorOptions = dataMgr.getKey(refName,"windowOptions");

		let ref = new BrowserWindow(windowOptions);
		ref.loadURL(`file://${getReadable("wcHost.html")}`);

		ref.on("close",function(){
			saveBounds(ref,refName);
		});

		ref.on("move",function(){
			saveBounds(ref,refName);
		});

		ref.on("resize",function(){
			saveBounds(ref,refName);
		});

		ref.webContents.on("devtools-opened",function(){
			ref.webContents.send("devtools-opened");
		});

		ref.webContents.on("devtools-closed",function(){
			ref.webContents.send("devtools-closed");
		});

		ref.webContents.once("dom-ready",function(){
			resolve();
		});

		pushWindow(refName,ref);
	});
}

/**
 * On any change to a windows dimensions or position, save the changes.
 * @param {Electron.BrowserWindow} ref - Reference to the window object whose bounds are to be saved
 * @param {string} refName - State channel to save onto
 */
export function saveBounds(ref : Electron.BrowserWindow,refName : string) : void
{
	let x : number;
	let y : number;
	let width : number;
	let height : number;
	let pos = ref.getPosition();
	let dimensions = ref.getSize();
	x = pos[0];
	y = pos[1];
	width = dimensions[0];
	height = dimensions[1];
	//Get old saved values.
	//let windowOptions = getState.getState(refName,"windowOptions");
	let windowOptions = dataMgr.getKey(refName,"windowOptions");
	if(!windowOptions)
	{
		return;
	}
	//Determine simple diff
	let change = false;
	if(windowOptions.x != x)
	{
		windowOptions.x = x;
		change = true;
	}
	if(windowOptions.y != y)
	{
		windowOptions.y = y;
		change = true;
	}
	if(windowOptions.width != width)
	{
		windowOptions.width = width;
		change = true;
	}
	if(windowOptions.height != height)
	{
		windowOptions.height = height;
		change = true;
	}
	if(change)
		dataMgr.setKey(refName,"windowOptions",windowOptions);
}
