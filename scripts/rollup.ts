    const rollup = require("rollup");
    const resolve = require("rollup-plugin-node-resolve");
    const commonjs = require("rollup-plugin-commonjs");

    let args = process.argv.slice(2);

    const inOpts = {
        input : args[0],
        external : ["electron","react","react-dom","typestyle"],
        onwarn : function(){},
        plugins : [
            resolve({
                preferBuiltins : true
            }),
            /*commonjs({
                namedExports : {
                    "node_modules/react-dom/index.js" : ["render"],
                    "node_modules/react/index.js" : ["Component","createElement","Fragment"]
                }
            })*/
        ],
    };

    const outOpts = {
        file : args[0],
        format : "cjs"
    };

    (async function(){
        const bundle = await rollup.rollup(inOpts);
        await bundle.write(outOpts);
    })();