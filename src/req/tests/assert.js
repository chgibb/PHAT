/*
    Assert wrapper for psuedo multi-threading.
    Allows node to interleave assert execution with event callbacks.
    Solution to async, event based unit testing.
    Requires the user to increment and decrement event count.
    
    Part of the PHAT Project
    Author: gibbc@tbh.net
*/
var assertions = new Array();
class Assertion
{
    constructor(func,message,executeOn)
    {
        this.func = func;
        this.message = message;
        this.executeOn = executeOn;
        this.executed = false;
    }
    execute()
    {
        if(this.executed)
            return;
        var res = this.func();
        if(res)
            console.log(this.message);
        else
        {
            console.log("FAILED: "+this.message);
            process.exit(1);
        }
        this.executed = true;
    }
}
module.exports.runningEvents = 0;

module.exports.assert = function(func,message,executeOn)
{
    if(executeOn < 0 || executeOn == undefined)
        executeOn = -1;

    //console.log("added assert "+message);
    assertions.push(new Assertion(func,message,executeOn));
}

module.exports.run = function()
{
    //console.log("called run");
    var end = assertions.length;
    //console.log('num assertions '+end);
    if(end == 0)
        process.exit(0);
    for(var i = 0; i < end; ++i)
    {
        if(assertions[i] === undefined)
        {
            assertions.shift();
            return;
        }
        //console.log(assertions[i].message+" "+assertions[i].executeOn);
        if(assertions[i].executeOn == -1)
        {
            assertions[i].execute();
            assertions.shift();
            return;
        }
        else
        {
            if(module.exports.runningEvents == assertions[i].executeOn)
            {
                assertions[i].execute();
                assertions.shift();
                return;
            }
            else
                return;
        }
    }
}

module.exports.runAsserts = function(interval)
{
    if(interval == 0 || interval === undefined)
        interval = 20;
    setInterval
    (
        function()
        {
            module.exports.run();
        },interval
    );
}