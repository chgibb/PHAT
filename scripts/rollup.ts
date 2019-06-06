    const rollup = require("rollup");
    const resolve = require("rollup-plugin-node-resolve");
    const commonjs = require("rollup-plugin-commonjs");
    const replace = require("rollup-plugin-replace");

    let args = process.argv.slice(2);

    const inOpts = {
        input : args[0],
        external : [
            "electron",
            "react",
            "react-dom",
            "react-is",
            "prop-types",
            "typestyle",
            "warning",
            "deepmerge",
            "hoist-non-react-statics",
            "dom-helpers/class/addClass",
            "dom-helpers/class/removeClass",

            "@material-ui/core/Button",

            "@babel/runtime/helpers/extends",
            "@babel/runtime/helpers/objectWithoutProperties",
            "@babel/runtime/helpers/defineProperty",
            "@babel/runtime/helpers/typeof",
            "@babel/runtime/helpers/classCallCheck",
            "@babel/runtime/helpers/createClass",
            "@babel/runtime/helpers/slicedToArray",
            "@babel/runtime/helpers/inherits",
            "@babel/runtime/helpers/applyDecoratedDescriptor",
            "@babel/runtime/helpers/decorate",
                           
            "@babel/runtime/helpers/objectSpread",
            "@babel/runtime/helpers/arrayWithHoles",
            "@babel/runtime/helpers/defaults",         
            "@babel/runtime/helpers/objectWithoutProperties",
            "@babel/runtime/helpers/arrayWithoutHoles",
            "@babel/runtime/helpers/defineEnumerableProperties",
            "@babel/runtime/helpers/objectWithoutPropertiesLoose",
            "@babel/runtime/helpers/assertThisInitialized",
            "@babel/runtime/helpers/ defineProperty",        
            "@babel/runtime/helpers/possibleConstructorReturn",
            "@babel/runtime/helpers/asyncGeneratorDelegate",
                            
            "@babel/runtime/helpers/readOnlyError",
            "@babel/runtime/helpers/AsyncGenerator",
            "@babel/runtime/helpers/extends",
                              
            "@babel/runtime/helpers/set",
            "@babel/runtime/helpers/asyncIterator",
            "@babel/runtime/helpers/get",                 
            "@babel/runtime/helpers/setPrototypeOf",
            "@babel/runtime/helpers/asyncToGenerator",    
            "@babel/runtime/helpers/getPrototypeOf",         
            "@babel/runtime/helpers/skipFirstGeneratorNext",
            "@babel/runtime/helpers/awaitAsyncGenerator",    
            "@babel/runtime/helpers/inherits",               
            "@babel/runtime/helpers/slicedToArray",
            "@babel/runtime/helpers/AwaitValue",           

            "@babel/runtime/helpers/inheritsLoose",          
            "@babel/runtime/helpers/slicedToArrayLoose",

            "@babel/runtime/helpers/classCallCheck",               
            "@babel/runtime/helpers/initializerDefineProperty",

            "@babel/runtime/helpers/superPropBase",
            "@babel/runtime/helpers/classNameTDZError",            
            "@babel/runtime/helpers/initializerWarningHelper", 

            "@babel/runtime/helpers/  taggedTemplateLiteral",

            "@babel/runtime/helpers/classPrivateFieldGet",        
            "@babel/runtime/helpers/instanceof",               
            "@babel/runtime/helpers/taggedTemplateLiteralLoose",

            "@babel/runtime/helpers/classPrivateFieldLooseBase",   
            "@babel/runtime/helpers/interopRequireDefault",   
            "@babel/runtime/helpers/temporalRef",
            "@babel/runtime/helpers/classPrivateFieldLooseKey",    
            "@babel/runtime/helpers/interopRequireWildcard",    
            "@babel/runtime/helpers/temporalUndefined",

            "@babel/runtime/helpers/classPrivateFieldSet",      
            "@babel/runtime/helpers/isNativeFunction",         
            "@babel/runtime/helpers/toArray",

            "@babel/runtime/helpers/classPrivateMethodGet",     
            "@babel/runtime/helpers/iterableToArray",         
            "@babel/runtime/helpers/toConsumableArray",
            "@babel/runtime/helpers/classPrivateMethodSet",   
            "@babel/runtime/helpers/iterableToArrayLimit",     
            "@babel/runtime/helpers/toPrimitive",
            "@babel/runtime/helpers/classStaticPrivateFieldSpecGet", 
            "@babel/runtime/helpers/iterableToArrayLimitLoose", 
            "@babel/runtime/helpers/toPropertyKey",
            "@babel/runtime/helpers/classStaticPrivateFieldSpecSet", 
            "@babel/runtime/helpers/jsx",                      
            "@babel/runtime/helpers/typeof",
            "@babel/runtime/helpers/classStaticPrivateMethodGet",  
            "@babel/runtime/helpers/newArrowCheck",            
            "@babel/runtime/helpers/wrapAsyncGenerator",
            "@babel/runtime/helpers/classStaticPrivateMethodSet", 
            "@babel/runtime/helpers/nonIterableRest",          
            "@babel/runtime/helpers/wrapNativeSuper",
            "@babel/runtime/helpers/construct",               
            "@babel/runtime/helpers/nonIterableSpread",    
            "@babel/runtime/helpers/wrapRegExp",
            "@babel/runtime/helpers/createClass",        
            "@babel/runtime/helpers/objectDestructuringEmpty",

        ],
        onwarn : function(){},
        plugins : [
            resolve({
                preferBuiltins : true
            }),
            //commonjs()
        ],
    };

    const outOpts = {
        file : args[0],
        format : "cjs",
        interop : false,
    };

    (async function(){
        const bundle = await rollup.rollup(inOpts);
        await bundle.write(outOpts);
    })();