export function logMainProcessErrors() : void
{
    (process as NodeJS.EventEmitter).on("uncaughtException",function(err : Error)
    {
        let errString = `Uncaught exception ${err}`;
        console.log(errString);
    });

    process.on("unhandledRejection",function(reason : Error)
    {
        let errString = `Unhandled rejection ${reason}`;
        console.log(errString);
    });
}