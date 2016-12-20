let hostWindow;
ipc.on
(
	"host" ,function(event,arg)
	{
		postStateIPC("host",event,arg);
		getStateIPC("host",event,arg);
	}
);
windowCreators["host"] = 
{
	Create : function() 
	{
		windows.push
		(
			{
				name : "host",
				window : createWithDefault("Host","host",alignWindow,1000,800,'../Host.html',false)
			}
		);
	}
};
