console.log(
    require("babel-core").transform(require("fs").readFileSync(process.argv[2]).toString(),{
    plugins : [
        [
            //AngularJS depends on parameter names where the parameter is passed as a service. For instance "$compile".
            //We preserve a list of used services when mangling the genome builder
            "minify-mangle-names",{
                exclude : {
                    "$compile" : true
                }
            },
            "minify-type-constructors",
            "minify-dead-code-elimination",
            "babel-plugin-minify-constant-folding"
        ]
    ]
}).code);