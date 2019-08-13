console.log(
    require("babel-core").transform(require("fs").readFileSync(process.argv[2]).toString(),{
    plugins : [
        [
            "minify-dead-code-elimination",
        ]
    ]
}).code);
