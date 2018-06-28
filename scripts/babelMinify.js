console.log(require("babel-core").transform(require("fs").readFileSync(process.argv[2]).toString(), {
    plugins: [
        [
            "minify-mangle-names", {
                exclude: {
                    "$compile": true
                }
            },
            "minify-type-constructors",
            "minify-dead-code-elimination",
            "babel-plugin-minify-constant-folding"
        ]
    ]
}).code);
