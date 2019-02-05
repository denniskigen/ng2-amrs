(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[43],{

/***/ "./node_modules/rison-node/js/rison.js":
/*!*********************************************!*\
  !*** ./node_modules/rison-node/js/rison.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Uses CommonJS, AMD or browser globals to create a module.
// Based on: https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    if (true) {
        // CommonJS
        module.exports = factory();
    } else {}
}(typeof self !== 'undefined' ? self : this, function () {
var rison = {};

//////////////////////////////////////////////////
//
//  the stringifier is based on
//    http://json.org/json.js as of 2006-04-28 from json.org
//  the parser is based on
//    http://osteele.com/sources/openlaszlo/json
//

/**
 *  rules for an uri encoder that is more tolerant than encodeURIComponent
 *
 *  encodeURIComponent passes  ~!*()-_.'
 *
 *  we also allow              ,:@$/
 *
 */
rison.uri_ok = {  // ok in url paths and in form query args
            '~': true,  '!': true,  '*': true,  '(': true,  ')': true,
            '-': true,  '_': true,  '.': true,  ',': true,
            ':': true,  '@': true,  '$': true,
            "'": true,  '/': true
};

/*
 * we divide the uri-safe glyphs into three sets
 *   <rison> - used by rison                         ' ! : ( ) ,
 *   <reserved> - not common in strings, reserved    * @ $ & ; =
 *
 * we define <identifier> as anything that's not forbidden
 */

/**
 * punctuation characters that are legal inside ids.
 */
// this var isn't actually used
//rison.idchar_punctuation = "_-./~";

(function () {
    var l = [];
    for (var hi = 0; hi < 16; hi++) {
        for (var lo = 0; lo < 16; lo++) {
            if (hi+lo === 0) continue;
            var c = String.fromCharCode(hi*16 + lo);
            if (! /\w|[-_./~]/.test(c))
                l.push('\\u00' + hi.toString(16) + lo.toString(16));
        }
    }
    /**
     * characters that are illegal inside ids.
     * <rison> and <reserved> classes are illegal in ids.
     *
     */
    rison.not_idchar = l.join('');
    //idcrx = new RegExp('[' + rison.not_idchar + ']');
    //console.log('NOT', (idcrx.test(' ')) );
})();
//rison.not_idchar  = " \t\r\n\"<>[]{}'!=:(),*@$;&";
rison.not_idchar  = " '!:(),*@$";


/**
 * characters that are illegal as the start of an id
 * this is so ids can't look like numbers.
 */
rison.not_idstart = '-0123456789';


(function () {
    var idrx = '[^' + rison.not_idstart + rison.not_idchar +
               '][^' + rison.not_idchar + ']*';

    rison.id_ok = new RegExp('^' + idrx + '$');

    // regexp to find the end of an id when parsing
    // g flag on the regexp is necessary for iterative regexp.exec()
    rison.next_id = new RegExp(idrx, 'g');
})();

/**
 * this is like encodeURIComponent() but quotes fewer characters.
 *
 * @see rison.uri_ok
 *
 * encodeURIComponent passes   ~!*()-_.'
 * rison.quote also passes   ,:@$/
 *   and quotes " " as "+" instead of "%20"
 */
rison.quote = function(x) {
    if (/^[-A-Za-z0-9~!*()_.',:@$/]*$/.test(x))
        return x;

    return encodeURIComponent(x)
        .replace(/%2C/g, ',')
        .replace(/%3A/g, ':')
        .replace(/%40/g, '@')
        .replace(/%24/g, '$')
        .replace(/%2F/g, '/')
        .replace(/%20/g, '+');
};


//
//  based on json.js 2006-04-28 from json.org
//  license: http://www.json.org/license.html
//
//  hacked by nix for use in uris.
//

(function () {
    var sq = { // url-ok but quoted in strings
               "'": true,  '!': true
    },
    enc = function (v) {
        if (v && typeof v.toJSON === 'function') v = v.toJSON();
        var fn = s[typeof v];
        if (fn) return fn(v);
    },
    s = {
            array: function (x) {
                var a = ['!('], b, i, l = x.length, v;
                for (i = 0; i < l; i += 1) {
                    v = enc(x[i]);
                    if (typeof v == 'string') {
                        if (b) {
                            a[a.length] = ',';
                        }
                        a[a.length] = v;
                        b = true;
                    }
                }
                a[a.length] = ')';
                return a.join('');
            },
            'boolean': function (x) {
                if (x)
                    return '!t';
                return '!f';
            },
            'null': function () {
                return '!n';
            },
            number: function (x) {
                if (!isFinite(x))
                    return '!n';
                // strip '+' out of exponent, '-' is ok though
                return String(x).replace(/\+/,'');
            },
            object: function (x) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    // WILL: will this work on non-Firefox browsers?
                    if (typeof x.__prototype__ === 'object' && typeof x.__prototype__.encode_rison !== 'undefined')
                        return x.encode_rison();

                    var a = ['('], b, i, v, k, ki, ks=[];
                    for (i in x)
                        ks[ks.length] = i;
                    ks.sort();
                    for (ki = 0; ki < ks.length; ki++) {
                        i = ks[ki];
                        v = enc(x[i]);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            k = isNaN(parseInt(i)) ? s.string(i) : s.number(i)
                            a.push(k, ':', v);
                            b = true;
                        }
                    }
                    a[a.length] = ')';
                    return a.join('');
                }
                return '!n';
            },
            string: function (x) {
                if (x === '')
                    return "''";

                if (rison.id_ok.test(x))
                    return x;

                x = x.replace(/(['!])/g, function(a, b) {
                    if (sq[b]) return '!'+b;
                    return b;
                });
                return "'" + x + "'";
            },
            undefined: function () {
                // ignore undefined just like JSON
                return;
            }
        };


    /**
     * rison-encode a javascript structure
     *
     *  implemementation based on Douglas Crockford's json.js:
     *    http://json.org/json.js as of 2006-04-28 from json.org
     *
     */
    rison.encode = function (v) {
        return enc(v);
    };

    /**
     * rison-encode a javascript object without surrounding parens
     *
     */
    rison.encode_object = function (v) {
        if (typeof v != 'object' || v === null || v instanceof Array)
            throw new Error('rison.encode_object expects an object argument');
        var r = s[typeof v](v);
        return r.substring(1, r.length-1);
    };

    /**
     * rison-encode a javascript array without surrounding parens
     *
     */
    rison.encode_array = function (v) {
        if (!(v instanceof Array))
            throw new Error('rison.encode_array expects an array argument');
        var r = s[typeof v](v);
        return r.substring(2, r.length-1);
    };

    /**
     * rison-encode and uri-encode a javascript structure
     *
     */
    rison.encode_uri = function (v) {
        return rison.quote(s[typeof v](v));
    };

})();




//
// based on openlaszlo-json and hacked by nix for use in uris.
//
// Author: Oliver Steele
// Copyright: Copyright 2006 Oliver Steele.  All rights reserved.
// Homepage: http://osteele.com/sources/openlaszlo/json
// License: MIT License.
// Version: 1.0


/**
 * parse a rison string into a javascript structure.
 *
 * this is the simplest decoder entry point.
 *
 *  based on Oliver Steele's OpenLaszlo-JSON
 *     http://osteele.com/sources/openlaszlo/json
 */
rison.decode = function(r) {
    var errcb = function(e) { throw Error('rison decoder error: ' + e); };
    // validate input is a string
    if (typeof r !== 'string')
        return errcb("decode input must be a string");
    var p = new rison.parser(errcb);
    return p.parse(r);
};

/**
 * parse an o-rison string into a javascript structure.
 *
 * this simply adds parentheses around the string before parsing.
 */
rison.decode_object = function(r) {
    return rison.decode('('+r+')');
};

/**
 * parse an a-rison string into a javascript structure.
 *
 * this simply adds array markup around the string before parsing.
 */
rison.decode_array = function(r) {
    return rison.decode('!('+r+')');
};


/**
 * construct a new parser object for reuse.
 *
 * @constructor
 * @class A Rison parser class.  You should probably
 *        use rison.decode instead.
 * @see rison.decode
 */
rison.parser = function (errcb) {
    this.errorHandler = errcb;
};

/**
 * a string containing acceptable whitespace characters.
 * by default the rison decoder tolerates no whitespace.
 * to accept whitespace set rison.parser.WHITESPACE = " \t\n\r\f";
 */
rison.parser.WHITESPACE = '';

// expose this as-is?
rison.parser.prototype.setOptions = function (options) {
    if (options['errorHandler'])
        this.errorHandler = options.errorHandler;
};

/**
 * parse a rison string into a javascript structure.
 */
rison.parser.prototype.parse = function (str) {
    this.string = str;
    this.index = 0;
    this.message = null;
    var value = this.readValue();
    if (!this.message && this.next())
        value = this.error("unable to parse string as rison: '" + rison.encode(str) + "'");
    if (this.message && this.errorHandler)
        this.errorHandler(this.message, this.index);
    return value;
};

rison.parser.prototype.error = function (message) {
    if (typeof console !== 'undefined')
        console.log('rison parser error: ', message); // eslint-disable-line no-console
    this.message = message;
    return undefined;
};

rison.parser.prototype.readValue = function () {
    var c = this.next();
    var fn = c && this.table[c];

    if (fn)
        return fn.apply(this);

    // fell through table, parse as an id

    var s = this.string;
    var i = this.index-1;

    // Regexp.lastIndex may not work right in IE before 5.5?
    // g flag on the regexp is also necessary
    rison.next_id.lastIndex = i;
    var m = rison.next_id.exec(s);

    // console.log('matched id', i, r.lastIndex);

    if (m.length > 0) {
        var id = m[0];
        this.index = i+id.length;
        return id;  // a string
    }

    if (c) return this.error("invalid character: '" + c + "'");
    return this.error('empty expression');
};

    rison.parser.parse_array = function (parser) {
    var ar = [];
    var c;
    while ((c = parser.next()) !== ')') {
        if (!c) return parser.error("unmatched '!('");
        if (ar.length) {
            if (c !== ',')
                parser.error("missing ','");
        } else if (c === ',') {
            return parser.error("extra ','");
        } else
            --parser.index;
        var n = parser.readValue();
        if (typeof n == 'undefined') return undefined;
        ar.push(n);
    }
    return ar;
};

rison.parser.bangs = {
    t: true,
    f: false,
    n: null,
    '(': rison.parser.parse_array
};

rison.parser.prototype.table = {
    '!': function () {
        var s = this.string;
        var c = s.charAt(this.index++);
        if (!c) return this.error('"!" at end of input');
        var x = rison.parser.bangs[c];
        if (typeof(x) == 'function') {
            return x.call(null, this);
        } else if (typeof(x) == 'undefined') {
            return this.error('unknown literal: "!' + c + '"');
        }
        return x;
    },
    '(': function () {
        var o = {};
        var c;
        var count = 0;
        while ((c = this.next()) !== ')') {
            if (count) {
                if (c !== ',')
                    this.error("missing ','");
            } else if (c === ',') {
                return this.error("extra ','");
            } else
                --this.index;
            var k = this.readValue();
            if (typeof k === 'undefined') return undefined;
            if (this.next() !== ':') return this.error("missing ':'");
            var v = this.readValue();
            if (typeof v === 'undefined') return undefined;
            o[k] = v;
            count++;
        }
        return o;
    },
    "'": function () {
        var s = this.string;
        var i = this.index;
        var start = i;
        var segments = [];
        var c;
        while ((c = s.charAt(i++)) !== "'") {
            //if (i == s.length) return this.error('unmatched "\'"');
            if (!c) return this.error('unmatched "\'"');
            if (c === '!') {
                if (start < i-1)
                    segments.push(s.slice(start, i-1));
                c = s.charAt(i++);
                if ("!'".indexOf(c) >= 0) {
                    segments.push(c);
                } else {
                    return this.error('invalid string escape: "!'+c+'"');
                }
                start = i;
            }
        }
        if (start < i-1)
            segments.push(s.slice(start, i-1));
        this.index = i;
        return segments.length === 1 ? segments[0] : segments.join('');
    },
    // Also any digit.  The statement that follows this table
    // definition fills in the digits.
    '-': function () {
        var s = this.string;
        var i = this.index;
        var start = i-1;
        var state = 'int';
        var permittedSigns = '-';
        var transitions = {
            'int+.': 'frac',
            'int+e': 'exp',
            'frac+e': 'exp'
        };
        do {
            var c = s.charAt(i++);
            if (!c) break;
            if ('0' <= c && c <= '9') continue;
            if (permittedSigns.indexOf(c) >= 0) {
                permittedSigns = '';
                continue;
            }
            state = transitions[state+'+'+c.toLowerCase()];
            if (state === 'exp') permittedSigns = '-';
        } while (state);
        this.index = --i;
        s = s.slice(start, i);
        if (s === '-') return this.error('invalid number');
        return Number(s);
    }
};
// copy table['-'] to each of table[i] | i <- '0'..'9':
(function (table) {
    for (var i = 0; i <= 9; i++)
        table[String(i)] = table['-'];
})(rison.parser.prototype.table);

// return the next non-whitespace character, or undefined
rison.parser.prototype.next = function () {
    var c;
    var s = this.string;
    var i = this.index;
    do {
        if (i === s.length) return undefined;
        c = s.charAt(i++);
    } while (rison.parser.WHITESPACE.indexOf(c) >= 0);
    this.index = i;
    return c;
};

return rison;

// End of UMD module wrapper
}));


/***/ }),

/***/ "./src/app/data-analytics-dashboard/data-analytics-guard.ts":
/*!******************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/data-analytics-guard.ts ***!
  \******************************************************************/
/*! exports provided: DataAnalyticsDashboardGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataAnalyticsDashboardGuard", function() { return DataAnalyticsDashboardGuard; });
/* harmony import */ var _shared_dynamic_route_dynamic_routes_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/dynamic-route/dynamic-routes.service */ "./src/app/shared/dynamic-route/dynamic-routes.service.ts");

var DataAnalyticsDashboardGuard = /** @class */ /*@__PURE__*/ (function () {
    function DataAnalyticsDashboardGuard(dynamicRoutesService) {
        this.dynamicRoutesService = dynamicRoutesService;
    }
    DataAnalyticsDashboardGuard.prototype.canActivate = function (routeSnapshot, state) {
        this.dynamicRoutesService.setRoutes({
            dashboardId: 'analyticsDashboard',
            programs: [],
            moduleLabel: 'Data Analytics Dashboard',
            params: {},
            routes: []
        });
        return true;
    };
    DataAnalyticsDashboardGuard.prototype.canDeactivate = function (target) {
        this.dynamicRoutesService.resetRoutes();
        return true;
    };
    return DataAnalyticsDashboardGuard;
}());



/***/ }),

/***/ "./src/app/data-analytics-dashboard/data-analytics.component.css.shim.ngstyle.js":
/*!***************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/data-analytics.component.css.shim.ngstyle.js ***!
  \***************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-analytics-dashboard/data-analytics.component.ngfactory.js":
/*!********************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/data-analytics.component.ngfactory.js ***!
  \********************************************************************************/
/*! exports provided: RenderType_DataAnalyticsDashboardComponent, View_DataAnalyticsDashboardComponent_0, View_DataAnalyticsDashboardComponent_Host_0, DataAnalyticsDashboardComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataAnalyticsDashboardComponent", function() { return RenderType_DataAnalyticsDashboardComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataAnalyticsDashboardComponent_0", function() { return View_DataAnalyticsDashboardComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataAnalyticsDashboardComponent_Host_0", function() { return View_DataAnalyticsDashboardComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataAnalyticsDashboardComponentNgFactory", function() { return DataAnalyticsDashboardComponentNgFactory; });
/* harmony import */ var _data_analytics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-analytics.component.css.shim.ngstyle */ "./src/app/data-analytics-dashboard/data-analytics.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _data_analytics_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data-analytics.component */ "./src/app/data-analytics-dashboard/data-analytics.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_analytics.component.css.shim.ngstyle,_angular_core,_angular_router,_data_analytics.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_analytics.component.css.shim.ngstyle,_angular_core,_angular_router,_data_analytics.component PURE_IMPORTS_END */




var styles_DataAnalyticsDashboardComponent = [_data_analytics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataAnalyticsDashboardComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataAnalyticsDashboardComponent, data: {} });

function View_DataAnalyticsDashboardComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 4, "div", [["class", "box box-solid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 3, "div", [["class", "box-body"], ["id", "section-box-body"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 2, "div", [["class", "component-wrapper"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 212992, null, 0, _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"], [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ChildrenOutletContexts"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"], [8, null], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 4, 0); }, null); }
function View_DataAnalyticsDashboardComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-analytics-dashboard", [], null, null, null, View_DataAnalyticsDashboardComponent_0, RenderType_DataAnalyticsDashboardComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _data_analytics_component__WEBPACK_IMPORTED_MODULE_3__["DataAnalyticsDashboardComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataAnalyticsDashboardComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-analytics-dashboard", _data_analytics_component__WEBPACK_IMPORTED_MODULE_3__["DataAnalyticsDashboardComponent"], View_DataAnalyticsDashboardComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/data-analytics-dashboard/data-analytics.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/data-analytics.component.ts ***!
  \**********************************************************************/
/*! exports provided: DataAnalyticsDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataAnalyticsDashboardComponent", function() { return DataAnalyticsDashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var DataAnalyticsDashboardComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataAnalyticsDashboardComponent() {
    }
    DataAnalyticsDashboardComponent.prototype.ngOnInit = function () {
    };
    return DataAnalyticsDashboardComponent;
}());



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.css.shim.ngstyle.js":
/*!**********************************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.css.shim.ngstyle.js ***!
  \**********************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.ngfactory.js":
/*!***************************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.ngfactory.js ***!
  \***************************************************************************************************/
/*! exports provided: RenderType_AdminDashboardClinicFlowComponent, View_AdminDashboardClinicFlowComponent_0, View_AdminDashboardClinicFlowComponent_Host_0, AdminDashboardClinicFlowComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_AdminDashboardClinicFlowComponent", function() { return RenderType_AdminDashboardClinicFlowComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_AdminDashboardClinicFlowComponent_0", function() { return View_AdminDashboardClinicFlowComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_AdminDashboardClinicFlowComponent_Host_0", function() { return View_AdminDashboardClinicFlowComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminDashboardClinicFlowComponentNgFactory", function() { return AdminDashboardClinicFlowComponentNgFactory; });
/* harmony import */ var _admin_dashboard_clinic_flow_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin-dashboard-clinic-flow.css.shim.ngstyle */ "./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _hiv_care_lib_clinic_flow_clinic_flow_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hiv-care-lib/clinic-flow/clinic-flow.component.ngfactory */ "./src/app/hiv-care-lib/clinic-flow/clinic-flow.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_clinic_flow_clinic_flow_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hiv-care-lib/clinic-flow/clinic-flow.component */ "./src/app/hiv-care-lib/clinic-flow/clinic-flow.component.ts");
/* harmony import */ var _hiv_care_lib_clinic_flow_clinic_flow_cache_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service */ "./src/app/hiv-care-lib/clinic-flow/clinic-flow-cache.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/locations/location-filter/location-filter.component.ngfactory */ "./src/app/shared/locations/location-filter/location-filter.component.ngfactory.js");
/* harmony import */ var _shared_locations_location_filter_location_filter_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/locations/location-filter/location-filter.component */ "./src/app/shared/locations/location-filter/location-filter.component.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../node_modules/ngx-openmrs-formentry/dist/ngx-formentry/ngx-openmrs-formentry.ngfactory */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/ngx-openmrs-formentry.ngfactory.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");
/* harmony import */ var _admin_dashboard_clinic_flow__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./admin-dashboard-clinic-flow */ "./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _admin_dashboard_clinic_flow.css.shim.ngstyle,_angular_core,_.._.._hiv_care_lib_clinic_flow_clinic_flow.component.ngfactory,_.._.._hiv_care_lib_clinic_flow_clinic_flow.component,_.._.._hiv_care_lib_clinic_flow_clinic_flow_cache.service,_angular_router,_angular_common,_.._.._shared_locations_location_filter_location_filter.component.ngfactory,_.._.._shared_locations_location_filter_location_filter.component,_.._.._openmrs_api_location_resource.service,_.._.._.._.._node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry.ngfactory,_angular_forms,ngx_openmrs_formentry_dist_ngx_formentry,_admin_dashboard_clinic_flow PURE_IMPORTS_END */
/** PURE_IMPORTS_START _admin_dashboard_clinic_flow.css.shim.ngstyle,_angular_core,_.._.._hiv_care_lib_clinic_flow_clinic_flow.component.ngfactory,_.._.._hiv_care_lib_clinic_flow_clinic_flow.component,_.._.._hiv_care_lib_clinic_flow_clinic_flow_cache.service,_angular_router,_angular_common,_.._.._shared_locations_location_filter_location_filter.component.ngfactory,_.._.._shared_locations_location_filter_location_filter.component,_.._.._openmrs_api_location_resource.service,_.._.._.._.._node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry.ngfactory,_angular_forms,ngx_openmrs_formentry_dist_ngx_formentry,_admin_dashboard_clinic_flow PURE_IMPORTS_END */














var styles_AdminDashboardClinicFlowComponent = [_admin_dashboard_clinic_flow_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_AdminDashboardClinicFlowComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_AdminDashboardClinicFlowComponent, data: {} });

function View_AdminDashboardClinicFlowComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "p", [["class", "text-info"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Please select location(s) to view report"]))], null, null); }
function View_AdminDashboardClinicFlowComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "clinic-flow", [], null, null, null, _hiv_care_lib_clinic_flow_clinic_flow_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_ClinicFlowComponent_0"], _hiv_care_lib_clinic_flow_clinic_flow_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_ClinicFlowComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 245760, null, 0, _hiv_care_lib_clinic_flow_clinic_flow_component__WEBPACK_IMPORTED_MODULE_3__["ClinicFlowComponent"], [_hiv_care_lib_clinic_flow_clinic_flow_cache_service__WEBPACK_IMPORTED_MODULE_4__["ClinicFlowCacheService"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], "ClinicFlowResource"], { locationUuids: [0, "locationUuids"], selectedDate: [1, "selectedDate"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.locations; var currVal_1 = _co.selectedDate; _ck(_v, 1, 0, currVal_0, currVal_1); }, null); }
function View_AdminDashboardClinicFlowComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "span", [["class", "fa fa-clock-o"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Clinic Flow"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 24, "div", [["class", "filters"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "location-filter", [], null, [[null, "onLocationChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onLocationChange" === en)) {
                var pd_0 = (_co.renderClinicFlow($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_LocationFilterComponent_0"], _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_LocationFilterComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 4308992, null, 0, _shared_locations_location_filter_location_filter_component__WEBPACK_IMPORTED_MODULE_8__["LocationFilterComponent"], [_openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_9__["LocationResourceService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { multiple: [0, "multiple"] }, { onLocationChange: "onLocationChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 21, "div", [["class", "date-filter"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 5, "div", [["class", "col-md-12 form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 1, "label", [["for", "selectedDate"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Select Date"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 2, "date-time-picker", [["id", "selectedDate"], ["tabindex", "0"]], null, [[null, "onDateChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onDateChange" === en)) {
                var pd_0 = (_co.setSelectedDate($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_10__["View_ɵk_0"], _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_10__["RenderType_ɵk"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_12__["ɵk"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 114688, null, 0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_12__["ɵk"], [], { modelValue: [0, "modelValue"] }, { onDateChange: "onDateChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 14, "div", [["class", "col-md-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 13, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 3, "div", [["class", "col-md-4 col-xs-4"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 2, "button", [["class", "btn btn-info previous"], ["style", "margin: 0px; float: left;"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.navigateDay((0 - 1)) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-chevron-left"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Previous Day "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, null, null, 3, "div", [["class", "col-md-4 col-xs-4"], ["style", "text-align: center; padding:1px; margin:2px 0px 2px 0px; "]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](21, 0, null, null, 2, "span", [["style", "font-weight: bold;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](22, null, [" ", " "])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](23, 1), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](24, 0, null, null, 4, "div", [["class", "col-md-4 col-xs-4"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](25, 0, null, null, 3, "button", [["class", "btn btn-info next"], ["style", "margin: 0px; float: right;"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.navigateDay(1) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](26, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["\u00A0\u00A0\u00A0\u00A0Next Day"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](28, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-chevron-right"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](29, 0, null, null, 5, "div", [["class", "col-md-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](30, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_AdminDashboardClinicFlowComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](32, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_AdminDashboardClinicFlowComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](34, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](35, 0, null, null, 0, "div", [["class", "clear"]], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_0 = true; _ck(_v, 6, 0, currVal_0); var currVal_1 = _co.selectedDate; _ck(_v, 13, 0, currVal_1); var currVal_3 = (!_co.locations || (_co.locations && (_co.locations.length == 0))); _ck(_v, 32, 0, currVal_3); var currVal_4 = (_co.locations && (_co.locations.length > 0)); _ck(_v, 34, 0, currVal_4); }, function (_ck, _v) { var _co = _v.component; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 22, 0, _ck(_v, 23, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 0), _co.selectedDate)); _ck(_v, 22, 0, currVal_2); });
}
function View_AdminDashboardClinicFlowComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "admin-dashboard-clinic-flow", [], null, null, null, View_AdminDashboardClinicFlowComponent_0, RenderType_AdminDashboardClinicFlowComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _admin_dashboard_clinic_flow__WEBPACK_IMPORTED_MODULE_13__["AdminDashboardClinicFlowComponent"], [_hiv_care_lib_clinic_flow_clinic_flow_cache_service__WEBPACK_IMPORTED_MODULE_4__["ClinicFlowCacheService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var AdminDashboardClinicFlowComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("admin-dashboard-clinic-flow", _admin_dashboard_clinic_flow__WEBPACK_IMPORTED_MODULE_13__["AdminDashboardClinicFlowComponent"], View_AdminDashboardClinicFlowComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/clinic-flow/admin-dashboard-clinic-flow.ts ***!
  \*****************************************************************************************/
/*! exports provided: AdminDashboardClinicFlowComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminDashboardClinicFlowComponent", function() { return AdminDashboardClinicFlowComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _hiv_care_lib_clinic_flow_clinic_flow_cache_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service */ "./src/app/hiv-care-lib/clinic-flow/clinic-flow-cache.service.ts");





var AdminDashboardClinicFlowComponent = /** @class */ /*@__PURE__*/ (function () {
    function AdminDashboardClinicFlowComponent(clinicFlowCache) {
        this.clinicFlowCache = clinicFlowCache;
        this._datePipe = new _angular_common__WEBPACK_IMPORTED_MODULE_1__["DatePipe"]('en-US');
    }
    AdminDashboardClinicFlowComponent.prototype.ngOnInit = function () {
        if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
            this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
        }
        else {
            this.selectedDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.clinicFlowCache.setSelectedDate(this.selectedDate);
        }
    };
    AdminDashboardClinicFlowComponent.prototype.renderClinicFlow = function (locationData) {
        var locations;
        if (locationData && locationData.locations) {
            var locationCheck = lodash__WEBPACK_IMPORTED_MODULE_2__["first"](locationData.locations);
            if (lodash__WEBPACK_IMPORTED_MODULE_2__["isObject"](locationCheck)) {
                locations = locationData.locations.slice().map(function (location) {
                    return location.value;
                });
            }
            else {
                locations = locationData.locations;
            }
            this.clinicFlowCache.setSelectedLocation(locations);
        }
        this.locations = locations;
    };
    AdminDashboardClinicFlowComponent.prototype.setSelectedDate = function (date) {
        this.selectedDate = date;
        this.clinicFlowCache.setSelectedDate(date);
    };
    AdminDashboardClinicFlowComponent.prototype.navigateDay = function (value) {
        if (value) {
            var m = moment__WEBPACK_IMPORTED_MODULE_3__(new Date(this.selectedDate));
            var revisedDate = m.add(value, 'd');
            this.selectedDate = this._datePipe.transform(revisedDate, 'yyyy-MM-dd');
            this.clinicFlowCache.setSelectedDate(this.selectedDate);
        }
    };
    return AdminDashboardClinicFlowComponent;
}());



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/data-analytics-hiv.module.ts":
/*!***************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/data-analytics-hiv.module.ts ***!
  \***************************************************************************/
/*! exports provided: DataAnalyticsHivModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataAnalyticsHivModule", function() { return DataAnalyticsHivModule; });
var DataAnalyticsHivModule = /** @class */ /*@__PURE__*/ (function () {
    function DataAnalyticsHivModule() {
    }
    return DataAnalyticsHivModule;
}());



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/hiv-data-visualization/hiv-overview-visualization.ngfactory.js":
/*!*************************************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/hiv-data-visualization/hiv-overview-visualization.ngfactory.js ***!
  \*************************************************************************************************************/
/*! exports provided: RenderType_HivCareComparativeAnalyticsComponent, View_HivCareComparativeAnalyticsComponent_0, View_HivCareComparativeAnalyticsComponent_Host_0, HivCareComparativeAnalyticsComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivCareComparativeAnalyticsComponent", function() { return RenderType_HivCareComparativeAnalyticsComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareComparativeAnalyticsComponent_0", function() { return View_HivCareComparativeAnalyticsComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareComparativeAnalyticsComponent_Host_0", function() { return View_HivCareComparativeAnalyticsComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareComparativeAnalyticsComponentNgFactory", function() { return HivCareComparativeAnalyticsComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _hiv_care_lib_hiv_visualization_hiv_care_overview_chart_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ngfactory */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_hiv_visualization_hiv_care_overview_chart_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _hiv_care_lib_services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hiv-care-lib/services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/report-filters/report-filters.component.ngfactory */ "./src/app/shared/report-filters/report-filters.component.ngfactory.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/report-filters/report-filters.component */ "./src/app/shared/report-filters/report-filters.component.ts");
/* harmony import */ var _etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../etl-api/indicator-resource.service */ "./src/app/etl-api/indicator-resource.service.ts");
/* harmony import */ var _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");
/* harmony import */ var _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../openmrs-api/program-resource.service */ "./src/app/openmrs-api/program-resource.service.ts");
/* harmony import */ var _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../openmrs-api/program-workflow-resource.service */ "./src/app/openmrs-api/program-workflow-resource.service.ts");
/* harmony import */ var _hiv_overview_visualization__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./hiv-overview-visualization */ "./src/app/data-analytics-dashboard/hiv/hiv-data-visualization/hiv-overview-visualization.ts");
/* harmony import */ var _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../etl-api/clinical-summary-visualization-resource.service */ "./src/app/etl-api/clinical-summary-visualization-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._.._hiv_care_lib_hiv_visualization_hiv_care_overview_chart.component.ngfactory,_.._.._hiv_care_lib_hiv_visualization_hiv_care_overview_chart.component,_angular_router,_.._.._hiv_care_lib_services_clinical_summary_visualization.service,_angular_common,_.._.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._.._shared_report_filters_report_filters.component,_.._.._etl_api_indicator_resource.service,_.._services_data_analytics_dashboard.services,_.._.._openmrs_api_program_resource.service,_.._.._openmrs_api_program_workflow_resource.service,_hiv_overview_visualization,_.._.._etl_api_clinical_summary_visualization_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._.._hiv_care_lib_hiv_visualization_hiv_care_overview_chart.component.ngfactory,_.._.._hiv_care_lib_hiv_visualization_hiv_care_overview_chart.component,_angular_router,_.._.._hiv_care_lib_services_clinical_summary_visualization.service,_angular_common,_.._.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._.._shared_report_filters_report_filters.component,_.._.._etl_api_indicator_resource.service,_.._services_data_analytics_dashboard.services,_.._.._openmrs_api_program_resource.service,_.._.._openmrs_api_program_workflow_resource.service,_hiv_overview_visualization,_.._.._etl_api_clinical_summary_visualization_resource.service PURE_IMPORTS_END */















var styles_HivCareComparativeAnalyticsComponent = [];
var RenderType_HivCareComparativeAnalyticsComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivCareComparativeAnalyticsComponent, data: {} });

function View_HivCareComparativeAnalyticsComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_HivCareComparativeAnalyticsComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 2, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "hiv-care-overview-chart", [], null, null, null, _hiv_care_lib_hiv_visualization_hiv_care_overview_chart_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_HivCareComparativeChartComponent_0"], _hiv_care_lib_hiv_visualization_hiv_care_overview_chart_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_HivCareComparativeChartComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 114688, null, 0, _hiv_care_lib_hiv_visualization_hiv_care_overview_chart_component__WEBPACK_IMPORTED_MODULE_2__["HivCareComparativeChartComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"], _hiv_care_lib_services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_4__["ClinicalSummaryVisualizationService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]], { options: [0, "options"], dates: [1, "dates"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.hivComparativeChartOptions; var currVal_1 = _co.dates; _ck(_v, 2, 0, currVal_0, currVal_1); }, null); }
function View_HivCareComparativeAnalyticsComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 5, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 4, "div", [["class", "col-sm-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeAnalyticsComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](3, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeAnalyticsComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](5, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.loadingHivCare; _ck(_v, 3, 0, currVal_0); var currVal_1 = _co.hivComparativeChartOptions; _ck(_v, 5, 0, currVal_1); }, null); }
function View_HivCareComparativeAnalyticsComponent_4(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 9, "div", [["class", "alert alert-danger fade in"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "a", [["class", "close"], ["data-dismiss", "alert"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["\u00D7"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 3, "h4", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-warning-sign"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" An error occurred while trying to load the report. Please try again. "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, null, 2, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](8, 0, null, null, 1, "small", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](9, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.errorMessage; _ck(_v, 9, 0, currVal_0); }); }
function View_HivCareComparativeAnalyticsComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 0, "span", [["class", "fa fa-bar-chart"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Clinic Overview Visualization"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 9, "div", [["class", ""]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 4, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 3, "div", [["class", "col-sm-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](6, 0, null, null, 2, "report-filters", [], null, [[null, "startDateChange"], [null, "endDateChange"], [null, "generateReport"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("startDateChange" === en)) {
                var pd_0 = ((_co.startDate = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("endDateChange" === en)) {
                var pd_1 = ((_co.endDate = $event) !== false);
                ad = (pd_1 && ad);
            }
            if (("generateReport" === en)) {
                var pd_2 = (_co.generateReport() !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ReportFiltersComponent_0"], _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ReportFiltersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_8__["ReportFiltersComponent"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](8, 4308992, null, 0, _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_8__["ReportFiltersComponent"], [_etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_9__["IndicatorResourceService"], _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_10__["DataAnalyticsDashboardService"], _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_11__["ProgramResourceService"], _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_12__["ProgramWorkFlowResourceService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]], { parentIsBusy: [0, "parentIsBusy"], disableGenerateButton: [1, "disableGenerateButton"], enabledControls: [2, "enabledControls"], startDate: [3, "startDate"], endDate: [4, "endDate"] }, { generateReport: "generateReport", startDateChange: "startDateChange", endDateChange: "endDateChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeAnalyticsComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](10, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeAnalyticsComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](12, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoadingReport; var currVal_1 = true; var currVal_2 = _co.enabledControls; var currVal_3 = _co.startDate; var currVal_4 = _co.endDate; _ck(_v, 8, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4); var currVal_5 = _co.locationUuids; _ck(_v, 10, 0, currVal_5); var currVal_6 = _co.encounteredError; _ck(_v, 12, 0, currVal_6); }, null);
}
function View_HivCareComparativeAnalyticsComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-comparative-chart-analytics", [], null, null, null, View_HivCareComparativeAnalyticsComponent_0, RenderType_HivCareComparativeAnalyticsComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _hiv_overview_visualization__WEBPACK_IMPORTED_MODULE_13__["HivCareComparativeAnalyticsComponent"], [_etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_14__["ClinicalSummaryVisualizationResourceService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["Location"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_10__["DataAnalyticsDashboardService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivCareComparativeAnalyticsComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-comparative-chart-analytics", _hiv_overview_visualization__WEBPACK_IMPORTED_MODULE_13__["HivCareComparativeAnalyticsComponent"], View_HivCareComparativeAnalyticsComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/hiv-data-visualization/hiv-overview-visualization.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/hiv-data-visualization/hiv-overview-visualization.ts ***!
  \***************************************************************************************************/
/*! exports provided: HivCareComparativeAnalyticsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareComparativeAnalyticsComponent", function() { return HivCareComparativeAnalyticsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _hiv_care_lib_hiv_visualization_hiv_care_overview_base_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-visualization/hiv-care-overview-base.component */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-base.component.ts");
/* harmony import */ var _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../etl-api/clinical-summary-visualization-resource.service */ "./src/app/etl-api/clinical-summary-visualization-resource.service.ts");
/* harmony import */ var _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");








var HivCareComparativeAnalyticsComponent = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(HivCareComparativeAnalyticsComponent, _super);
    function HivCareComparativeAnalyticsComponent(visualizationResourceService, route, location, router, dataAnalyticsDashboardService) {
        var _this = _super.call(this, visualizationResourceService, dataAnalyticsDashboardService) || this;
        _this.visualizationResourceService = visualizationResourceService;
        _this.route = route;
        _this.location = location;
        _this.router = router;
        _this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        _this.data = [];
        _this.sectionsDef = [];
        return _this;
    }
    HivCareComparativeAnalyticsComponent.prototype.ngOnInit = function () {
        this.locationUuids = [];
        this.loadReportParamsFromUrl();
    };
    HivCareComparativeAnalyticsComponent.prototype.generateReport = function () {
        this.getLocationsSelected();
        this.storeReportParamsInUrl();
        _super.prototype.generateReport.call(this);
    };
    HivCareComparativeAnalyticsComponent.prototype.loadReportParamsFromUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        var pathHasHistoricalValues = path.queryParams['startDate'] &&
            path.queryParams['endDate'];
        if (path.queryParams['startDate']) {
            this.startDate = new Date(path.queryParams['startDate']);
        }
        if (path.queryParams['endDate']) {
            this.endDate = new Date(path.queryParams['endDate']);
        }
        if (pathHasHistoricalValues) {
            this.generateReport();
        }
    };
    HivCareComparativeAnalyticsComponent.prototype.storeReportParamsInUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'startDate': this.startDate.toUTCString(),
            'endDate': this.endDate.toUTCString(),
        };
        this.location.replaceState(path.toString());
    };
    HivCareComparativeAnalyticsComponent.prototype.getLocationsSelected = function () {
        var _this = this;
        this.dataAnalyticsDashboardService.getSelectedLocations().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (data) {
            if (data) {
                _this.locationUuids = data.locations;
            }
        });
    };
    return HivCareComparativeAnalyticsComponent;
}(_hiv_care_lib_hiv_visualization_hiv_care_overview_base_component__WEBPACK_IMPORTED_MODULE_5__["HivCareComparativeOverviewBaseComponent"]));



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/hiv-summary-indicators/hiv-summary-indicators.ngfactory.js":
/*!*********************************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/hiv-summary-indicators/hiv-summary-indicators.ngfactory.js ***!
  \*********************************************************************************************************/
/*! exports provided: RenderType_HivSummaryIndicatorsComponent, View_HivSummaryIndicatorsComponent_0, View_HivSummaryIndicatorsComponent_Host_0, HivSummaryIndicatorsComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivSummaryIndicatorsComponent", function() { return RenderType_HivSummaryIndicatorsComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryIndicatorsComponent_0", function() { return View_HivSummaryIndicatorsComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryIndicatorsComponent_Host_0", function() { return View_HivSummaryIndicatorsComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryIndicatorsComponentNgFactory", function() { return HivSummaryIndicatorsComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/primeng/components/tabview/tabview.ngfactory */ "./node_modules/primeng/components/tabview/tabview.ngfactory.js");
/* harmony import */ var primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/components/tabview/tabview */ "./node_modules/primeng/components/tabview/tabview.js");
/* harmony import */ var primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ngfactory */ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component */ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/report-filters/report-filters.component.ngfactory */ "./src/app/shared/report-filters/report-filters.component.ngfactory.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/report-filters/report-filters.component */ "./src/app/shared/report-filters/report-filters.component.ts");
/* harmony import */ var _etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../etl-api/indicator-resource.service */ "./src/app/etl-api/indicator-resource.service.ts");
/* harmony import */ var _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");
/* harmony import */ var _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../openmrs-api/program-resource.service */ "./src/app/openmrs-api/program-resource.service.ts");
/* harmony import */ var _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../openmrs-api/program-workflow-resource.service */ "./src/app/openmrs-api/program-workflow-resource.service.ts");
/* harmony import */ var _hiv_summary_indicators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hiv-summary-indicators */ "./src/app/data-analytics-dashboard/hiv/hiv-summary-indicators/hiv-summary-indicators.ts");
/* harmony import */ var _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../etl-api/hiv-summary-indicators-resource.service */ "./src/app/etl-api/hiv-summary-indicators-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._.._.._.._node_modules_primeng_components_tabview_tabview.ngfactory,primeng_components_tabview_tabview,_.._.._hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular.component.ngfactory,_.._.._hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular.component,_angular_router,_angular_common,_.._.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._.._shared_report_filters_report_filters.component,_.._.._etl_api_indicator_resource.service,_.._services_data_analytics_dashboard.services,_.._.._openmrs_api_program_resource.service,_.._.._openmrs_api_program_workflow_resource.service,_hiv_summary_indicators,_.._.._etl_api_hiv_summary_indicators_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._.._.._.._node_modules_primeng_components_tabview_tabview.ngfactory,primeng_components_tabview_tabview,_.._.._hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular.component.ngfactory,_.._.._hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular.component,_angular_router,_angular_common,_.._.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._.._shared_report_filters_report_filters.component,_.._.._etl_api_indicator_resource.service,_.._services_data_analytics_dashboard.services,_.._.._openmrs_api_program_resource.service,_.._.._openmrs_api_program_workflow_resource.service,_hiv_summary_indicators,_.._.._etl_api_hiv_summary_indicators_resource.service PURE_IMPORTS_END */
















var styles_HivSummaryIndicatorsComponent = [];
var RenderType_HivSummaryIndicatorsComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivSummaryIndicatorsComponent, data: {} });

function View_HivSummaryIndicatorsComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_HivSummaryIndicatorsComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 8, "div", [["class", "alert alert-danger fade in"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "a", [["class", "close"], ["data-dismiss", "alert"], ["href", "javascript.void(0);"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["\u00D7"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 3, "h4", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-warning-sign"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" An error occurred while trying to load the report. "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](8, null, [" ", " "]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.errorMessage; _ck(_v, 8, 0, currVal_0); }); }
function View_HivSummaryIndicatorsComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 8, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 7, "p-tabView", [], null, [[null, "onChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onChange" === en)) {
                var pd_0 = (_co.onTabChanged($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_TabView_0"], _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_TabView"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 1097728, null, 1, primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_2__["TabView"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]], null, { onChange: "onChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 1, { tabPanels: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 16777216, null, 0, 4, "p-tabPanel", [["header", "Tabular View"], ["leftIcon", "fa-table"]], null, null, null, _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_TabPanel_0"], _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_TabPanel"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](5, 1228800, [[1, 4]], 1, primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_2__["TabPanel"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]], { header: [0, "header"], leftIcon: [1, "leftIcon"], selected: [2, "selected"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { templates: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, 0, 1, "hiv-summary-tabular", [], null, null, null, _hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_HivSummaryTabularComponent_0"], _hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_HivSummaryTabularComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](8, 114688, null, 0, _hiv_care_lib_hiv_summary_indicators_hiv_summary_tabular_component__WEBPACK_IMPORTED_MODULE_4__["HivSummaryTabularComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]], { data: [0, "data"], sectionDefs: [1, "sectionDefs"], dates: [2, "dates"], gender: [3, "gender"], age: [4, "age"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = "Tabular View"; var currVal_1 = "fa-table"; var currVal_2 = (_co.currentView === "tabular"); _ck(_v, 5, 0, currVal_0, currVal_1, currVal_2); var currVal_3 = _co.data; var currVal_4 = _co.sectionsDef; var currVal_5 = _co.dates; var currVal_6 = _co.gender; var currVal_7 = _co.age; _ck(_v, 8, 0, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7); }, null);
}
function View_HivSummaryIndicatorsComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-equalizer"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" HIV Summary Indicators"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 2, "report-filters", [], null, [[null, "startDateChange"], [null, "endDateChange"], [null, "onAgeChangeFinish"], [null, "onGenderChange"], [null, "onIndicatorChange"], [null, "generateReport"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("startDateChange" === en)) {
                var pd_0 = ((_co.startDate = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("endDateChange" === en)) {
                var pd_1 = ((_co.endDate = $event) !== false);
                ad = (pd_1 && ad);
            }
            if (("onAgeChangeFinish" === en)) {
                var pd_2 = (_co.onAgeChangeFinished($event) !== false);
                ad = (pd_2 && ad);
            }
            if (("onGenderChange" === en)) {
                var pd_3 = (_co.getSelectedGender($event) !== false);
                ad = (pd_3 && ad);
            }
            if (("onIndicatorChange" === en)) {
                var pd_4 = (_co.getSelectedIndicators($event) !== false);
                ad = (pd_4 && ad);
            }
            if (("generateReport" === en)) {
                var pd_5 = (_co.generateReport() !== false);
                ad = (pd_5 && ad);
            }
            return ad;
        }, _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__["View_ReportFiltersComponent_0"], _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_7__["RenderType_ReportFiltersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_9__["ReportFiltersComponent"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](7, 4308992, null, 0, _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_9__["ReportFiltersComponent"], [_etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_10__["IndicatorResourceService"], _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_11__["DataAnalyticsDashboardService"], _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_12__["ProgramResourceService"], _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_13__["ProgramWorkFlowResourceService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]], { start: [0, "start"], end: [1, "end"], parentIsBusy: [2, "parentIsBusy"], enabledControls: [3, "enabledControls"], startDate: [4, "startDate"], endDate: [5, "endDate"], reportName: [6, "reportName"], selectedIndicators: [7, "selectedIndicators"], selectedGender: [8, "selectedGender"] }, { onAgeChangeFinish: "onAgeChangeFinish", onIndicatorChange: "onIndicatorChange", onGenderChange: "onGenderChange", generateReport: "generateReport", startDateChange: "startDateChange", endDateChange: "endDateChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](9, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](11, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoadingReport; _ck(_v, 4, 0, currVal_0); var currVal_1 = _co.ageRangeStart; var currVal_2 = _co.ageRangeEnd; var currVal_3 = _co.isLoadingReport; var currVal_4 = _co.enabledControls; var currVal_5 = _co.startDate; var currVal_6 = _co.endDate; var currVal_7 = _co.reportName; var currVal_8 = _co.selectedIndicators; var currVal_9 = _co.selectedGender; _ck(_v, 7, 0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9); var currVal_10 = _co.encounteredError; _ck(_v, 9, 0, currVal_10); var currVal_11 = (!_co.isLoadingReport && !_co.encounteredError); _ck(_v, 11, 0, currVal_11); }, null);
}
function View_HivSummaryIndicatorsComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-summary-indicator-report", [], null, null, null, View_HivSummaryIndicatorsComponent_0, RenderType_HivSummaryIndicatorsComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _hiv_summary_indicators__WEBPACK_IMPORTED_MODULE_14__["HivSummaryIndicatorsComponent"], [_etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_15__["HivSummaryIndicatorsResourceService"], _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_11__["DataAnalyticsDashboardService"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivSummaryIndicatorsComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-summary-indicator-report", _hiv_summary_indicators__WEBPACK_IMPORTED_MODULE_14__["HivSummaryIndicatorsComponent"], View_HivSummaryIndicatorsComponent_Host_0, { ageRangeStart: "ageRangeStart", ageRangeEnd: "ageRangeEnd" }, {}, []);



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/hiv-summary-indicators/hiv-summary-indicators.ts":
/*!***********************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/hiv-summary-indicators/hiv-summary-indicators.ts ***!
  \***********************************************************************************************/
/*! exports provided: HivSummaryIndicatorsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryIndicatorsComponent", function() { return HivSummaryIndicatorsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hiv_care_lib_hiv_summary_indicators_hiv_summary_report_base_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component */ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component.ts");
/* harmony import */ var _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../etl-api/hiv-summary-indicators-resource.service */ "./src/app/etl-api/hiv-summary-indicators-resource.service.ts");
/* harmony import */ var _services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");








var HivSummaryIndicatorsComponent = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(HivSummaryIndicatorsComponent, _super);
    function HivSummaryIndicatorsComponent(hivSummaryIndicatorsResourceService, dataAnalyticsDashboardService, route, location, router) {
        var _this = _super.call(this, hivSummaryIndicatorsResourceService, dataAnalyticsDashboardService) || this;
        _this.hivSummaryIndicatorsResourceService = hivSummaryIndicatorsResourceService;
        _this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        _this.route = route;
        _this.location = location;
        _this.router = router;
        _this.data = [];
        _this.sectionsDef = [];
        return _this;
    }
    HivSummaryIndicatorsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.parent.parent.parent.params.subscribe(function (params) {
            _this.locationUuids = [];
            if (params.location_uuid) {
                _this.locationUuids.push(params.location_uuid);
            }
        });
        this.loadReportParamsFromUrl();
        this.getLocationsSelected();
    };
    HivSummaryIndicatorsComponent.prototype.generateReport = function () {
        this.getLocationsSelected();
        this.storeReportParamsInUrl();
        _super.prototype.generateReport.call(this);
    };
    HivSummaryIndicatorsComponent.prototype.getLocationsSelected = function () {
        var _this = this;
        this.dataAnalyticsDashboardService.getSelectedIndicatorLocations().subscribe(function (data) {
            if (data) {
                _this.locationUuids = data.locations;
            }
        });
    };
    HivSummaryIndicatorsComponent.prototype.loadReportParamsFromUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        var pathHasHistoricalValues = path.queryParams['startDate'] &&
            path.queryParams['endDate'];
        if (path.queryParams['startDate']) {
            this.startDate = new Date(path.queryParams['startDate']);
        }
        if (path.queryParams['endDate']) {
            this.endDate = new Date(path.queryParams['endDate']);
        }
        if (path.queryParams['indicators']) {
            this.indicators = path.queryParams['indicators'];
            this.formatIndicatorsToSelectArray(this.indicators);
        }
        if (path.queryParams['gender']) {
            this.gender = path.queryParams['gender'];
            this.formatGenderToSelectArray(this.gender);
        }
        if (path.queryParams['startAge']) {
            this.startAge = path.queryParams['startAge'];
        }
        if (path.queryParams['endAge']) {
            this.endAge = path.queryParams['endAge'];
        }
        if (path.queryParams['view']) {
            this.currentView = path.queryParams['view'];
        }
        if (path.queryParams['locationUuids']) {
            this.locationUuids = path.queryParams['locationUuids'];
        }
        if (pathHasHistoricalValues) {
            this.generateReport();
        }
    };
    HivSummaryIndicatorsComponent.prototype.storeReportParamsInUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'endDate': this.endDate.toUTCString(),
            'startDate': this.startDate.toUTCString(),
            'indicators': this.indicators,
            'gender': this.gender === undefined ? '' : this.gender,
            'startAge': this.startAge,
            'endAge': this.endAge,
            'view': this.currentView,
            'locationUuids': this.locationUuids
        };
        this.location.replaceState(path.toString());
    };
    HivSummaryIndicatorsComponent.prototype.formatIndicatorsToSelectArray = function (indicatorParam) {
        var _this = this;
        var arr = indicatorParam.split(',');
        lodash__WEBPACK_IMPORTED_MODULE_4__["each"](arr, function (indicator) {
            var text = _this.translateIndicator(indicator);
            var id = indicator;
            var data = {
                value: id,
                label: text
            };
            _this.selectedIndicators.push(data);
        });
    };
    HivSummaryIndicatorsComponent.prototype.translateIndicator = function (indicator) {
        return indicator.toLowerCase().split('_').map(function (word) {
            return (word.charAt(0) + word.slice(1));
        }).join(' ');
    };
    HivSummaryIndicatorsComponent.prototype.formatGenderToSelectArray = function (genderParam) {
        var _this = this;
        var arr = genderParam.split(',');
        lodash__WEBPACK_IMPORTED_MODULE_4__["each"](arr, function (indicator) {
            var text = indicator;
            var id = indicator;
            var data = {
                value: id,
                label: text
            };
            _this.selectedGender.push(data);
        });
    };
    return HivSummaryIndicatorsComponent;
}(_hiv_care_lib_hiv_summary_indicators_hiv_summary_report_base_component__WEBPACK_IMPORTED_MODULE_5__["HivSummaryIndicatorBaseComponent"]));



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/moh-731/moh-731-report.component.ngfactory.js":
/*!********************************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/moh-731/moh-731-report.component.ngfactory.js ***!
  \********************************************************************************************/
/*! exports provided: RenderType_Moh731ReportComponent, View_Moh731ReportComponent_0, View_Moh731ReportComponent_Host_0, Moh731ReportComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_Moh731ReportComponent", function() { return RenderType_Moh731ReportComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731ReportComponent_0", function() { return View_Moh731ReportComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731ReportComponent_Host_0", function() { return View_Moh731ReportComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731ReportComponentNgFactory", function() { return Moh731ReportComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/primeng/components/tabview/tabview.ngfactory */ "./node_modules/primeng/components/tabview/tabview.ngfactory.js");
/* harmony import */ var primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/components/tabview/tabview */ "./node_modules/primeng/components/tabview/tabview.js");
/* harmony import */ var primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ngfactory */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ts");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-pdf-view.service */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.service.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-tabular.component.ngfactory */ "./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_tabular_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-tabular.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ts");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-filters.component.ngfactory */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ngfactory.js");
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_filters_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-filters.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ts");
/* harmony import */ var _moh_731_report_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./moh-731-report.component */ "./src/app/data-analytics-dashboard/hiv/moh-731/moh-731-report.component.ts");
/* harmony import */ var _etl_api_moh_731_resource_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../etl-api/moh-731-resource.service */ "./src/app/etl-api/moh-731-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._.._node_modules_primeng_components_tabview_tabview.ngfactory,primeng_components_tabview_tabview,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.component,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.service,_.._.._openmrs_api_location_resource.service,_angular_platform_browser,_.._.._hiv_care_lib_moh_731_report_moh_731_tabular.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_tabular.component,_.._.._hiv_care_lib_moh_731_report_moh_731_report_filters.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_report_filters.component,_moh_731_report.component,_.._.._etl_api_moh_731_resource.service,_angular_router PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._.._node_modules_primeng_components_tabview_tabview.ngfactory,primeng_components_tabview_tabview,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.component,_.._.._hiv_care_lib_moh_731_report_moh_731_report_pdf_view.service,_.._.._openmrs_api_location_resource.service,_angular_platform_browser,_.._.._hiv_care_lib_moh_731_report_moh_731_tabular.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_tabular.component,_.._.._hiv_care_lib_moh_731_report_moh_731_report_filters.component.ngfactory,_.._.._hiv_care_lib_moh_731_report_moh_731_report_filters.component,_moh_731_report.component,_.._.._etl_api_moh_731_resource.service,_angular_router PURE_IMPORTS_END */
















var styles_Moh731ReportComponent = [];
var RenderType_Moh731ReportComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_Moh731ReportComponent, data: {} });

function View_Moh731ReportComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_Moh731ReportComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "h4", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-warning-sign"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" An error occurred while trying to load the report. Please try again. "]))], null, null); }
function View_Moh731ReportComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 7, "div", [["class", "alert alert-danger fade in"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "a", [["class", "close"], ["data-dismiss", "alert"], ["href", "#"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["\u00D7"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 2, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](6, 0, null, null, 1, "small", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](7, null, ["", ""]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.statusError; _ck(_v, 4, 0, currVal_0); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.errorMessage; _ck(_v, 7, 0, currVal_1); }); }
function View_Moh731ReportComponent_5(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "button", [["class", "btn btn-primary"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.toggleMohTables() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Go back to tabular view"]))], null, null);
}
function View_Moh731ReportComponent_6(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading patient list...."]))], null, null); }
function View_Moh731ReportComponent_4(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 17, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 16, "p-tabView", [], null, [[null, "onChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onChange" === en)) {
                var pd_0 = (_co.onTabChanged($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_TabView_0"], _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_TabView"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 1097728, null, 1, primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3__["TabView"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]], null, { onChange: "onChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { tabPanels: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 16777216, null, 0, 4, "p-tabPanel", [["header", "Report View"], ["leftIcon", "fa-file-pdf-o "]], null, null, null, _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_TabPanel_0"], _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_TabPanel"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](5, 1228800, [[2, 4]], 1, primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3__["TabPanel"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]], { header: [0, "header"], leftIcon: [1, "leftIcon"], selected: [2, "selected"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 3, { templates: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, 0, 1, "moh-731-pdf", [], null, null, null, _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_MOHReportComponent_0"], _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_MOHReportComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](8, 245760, [[1, 4], ["mohPdf", 4]], 0, _hiv_care_lib_moh_731_report_moh_731_report_pdf_view_component__WEBPACK_IMPORTED_MODULE_5__["MOHReportComponent"], [_hiv_care_lib_moh_731_report_moh_731_report_pdf_view_service__WEBPACK_IMPORTED_MODULE_6__["MOHReportService"], _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_7__["LocationResourceService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__["DomSanitizer"]], { isAggregated: [0, "isAggregated"], selectedLocations: [1, "selectedLocations"], sectionsDef: [2, "sectionsDef"], startDate: [3, "startDate"], endDate: [4, "endDate"], isReleased: [5, "isReleased"], data: [6, "data"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](9, 16777216, null, 0, 8, "p-tabPanel", [["header", "Tabular View"], ["leftIcon", "fa-table"]], null, null, null, _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_TabPanel_0"], _node_modules_primeng_components_tabview_tabview_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_TabPanel"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](10, 1228800, [[2, 4]], 1, primeng_components_tabview_tabview__WEBPACK_IMPORTED_MODULE_3__["TabPanel"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]], { header: [0, "header"], leftIcon: [1, "leftIcon"], selected: [2, "selected"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 4, { templates: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, 0, 1, null, View_Moh731ReportComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](13, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, 0, 1, null, View_Moh731ReportComponent_6)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](15, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](16, 0, null, 0, 1, "moh-731-tabular", [], [[8, "hidden", 0]], [[null, "indicatorSelected"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("indicatorSelected" === en)) {
                var pd_0 = (_co.onIndicatorSelected($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _hiv_care_lib_moh_731_report_moh_731_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["View_Moh731TabularComponent_0"], _hiv_care_lib_moh_731_report_moh_731_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["RenderType_Moh731TabularComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](17, 114688, null, 0, _hiv_care_lib_moh_731_report_moh_731_tabular_component__WEBPACK_IMPORTED_MODULE_10__["Moh731TabularComponent"], [], { data: [0, "data"], sectionDefs: [1, "sectionDefs"], isReleased: [2, "isReleased"] }, { indicatorSelected: "indicatorSelected" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = "Report View"; var currVal_1 = "fa-file-pdf-o "; var currVal_2 = (_co.currentView === "pdf"); _ck(_v, 5, 0, currVal_0, currVal_1, currVal_2); var currVal_3 = _co.isAggregated; var currVal_4 = _co.locationUuids; var currVal_5 = _co.sectionsDef; var currVal_6 = _co.startDate; var currVal_7 = _co.endDate; var currVal_8 = _co.isReleased; var currVal_9 = _co.data; _ck(_v, 8, 0, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9); var currVal_10 = "Tabular View"; var currVal_11 = "fa-table"; var currVal_12 = (_co.currentView === "tabular"); _ck(_v, 10, 0, currVal_10, currVal_11, currVal_12); var currVal_13 = !_co.showTabularView; _ck(_v, 13, 0, currVal_13); var currVal_14 = _co.showPatientListLoader; _ck(_v, 15, 0, currVal_14); var currVal_16 = _co.data; var currVal_17 = _co.sectionsDef; var currVal_18 = _co.isReleased; _ck(_v, 17, 0, currVal_16, currVal_17, currVal_18); }, function (_ck, _v) { var _co = _v.component; var currVal_15 = !_co.showTabularView; _ck(_v, 16, 0, currVal_15); });
}
function View_Moh731ReportComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](671088640, 1, { pdfView: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-equalizer"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" MOH 731 Report"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](5, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](6, 0, null, null, 1, "moh-731-report-filters", [], null, [[null, "startDateChange"], [null, "endDateChange"], [null, "isLegacyVersionChange"], [null, "isAggregatedChange"], [null, "locationUuidsChange"], [null, "generateReport"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("startDateChange" === en)) {
                var pd_0 = ((_co.startDate = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("endDateChange" === en)) {
                var pd_1 = ((_co.endDate = $event) !== false);
                ad = (pd_1 && ad);
            }
            if (("isLegacyVersionChange" === en)) {
                var pd_2 = ((_co.isLegacyReport = $event) !== false);
                ad = (pd_2 && ad);
            }
            if (("isAggregatedChange" === en)) {
                var pd_3 = ((_co.isAggregated = $event) !== false);
                ad = (pd_3 && ad);
            }
            if (("locationUuidsChange" === en)) {
                var pd_4 = ((_co.locationUuids = $event) !== false);
                ad = (pd_4 && ad);
            }
            if (("generateReport" === en)) {
                var pd_5 = (_co.generateReport() !== false);
                ad = (pd_5 && ad);
            }
            return ad;
        }, _hiv_care_lib_moh_731_report_moh_731_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__["View_Moh731ReportFiltersComponent_0"], _hiv_care_lib_moh_731_report_moh_731_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__["RenderType_Moh731ReportFiltersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](7, 114688, null, 0, _hiv_care_lib_moh_731_report_moh_731_report_filters_component__WEBPACK_IMPORTED_MODULE_12__["Moh731ReportFiltersComponent"], [], { locationUuids: [0, "locationUuids"], parentIsBusy: [1, "parentIsBusy"], showIsAggregateControl: [2, "showIsAggregateControl"], showLocationsControl: [3, "showLocationsControl"], startDate: [4, "startDate"], endDate: [5, "endDate"], isAggregated: [6, "isAggregated"], isLegacyVersion: [7, "isLegacyVersion"] }, { generateReport: "generateReport", startDateChange: "startDateChange", endDateChange: "endDateChange", isLegacyVersionChange: "isLegacyVersionChange", isAggregatedChange: "isAggregatedChange", locationUuidsChange: "locationUuidsChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](9, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](11, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = (_co.isLoadingReport || _co.showPatientListLoader); _ck(_v, 5, 0, currVal_0); var currVal_1 = _co.locationUuids; var currVal_2 = _co.isLoadingReport; var currVal_3 = _co.showIsAggregateControl; var currVal_4 = _co.showLocationsControl; var currVal_5 = _co.startDate; var currVal_6 = _co.endDate; var currVal_7 = _co.isAggregated; var currVal_8 = _co.isLegacyReport; _ck(_v, 7, 0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8); var currVal_9 = _co.showInfoMessage; _ck(_v, 9, 0, currVal_9); var currVal_10 = (!_co.isLoadingReport && !_co.showInfoMessage); _ck(_v, 11, 0, currVal_10); }, null);
}
function View_Moh731ReportComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "moh-731-report", [], null, null, null, View_Moh731ReportComponent_0, RenderType_Moh731ReportComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _moh_731_report_component__WEBPACK_IMPORTED_MODULE_13__["Moh731ReportComponent"], [_etl_api_moh_731_resource_service__WEBPACK_IMPORTED_MODULE_14__["Moh731ResourceService"], _angular_router__WEBPACK_IMPORTED_MODULE_15__["ActivatedRoute"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"], _angular_router__WEBPACK_IMPORTED_MODULE_15__["Router"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var Moh731ReportComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("moh-731-report", _moh_731_report_component__WEBPACK_IMPORTED_MODULE_13__["Moh731ReportComponent"], View_Moh731ReportComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/data-analytics-dashboard/hiv/moh-731/moh-731-report.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/data-analytics-dashboard/hiv/moh-731/moh-731-report.component.ts ***!
  \**********************************************************************************/
/*! exports provided: Moh731ReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731ReportComponent", function() { return Moh731ReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rison_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rison-node */ "./node_modules/rison-node/js/rison.js");
/* harmony import */ var rison_node__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(rison_node__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hiv_care_lib_moh_731_report_moh_731_report_base_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hiv-care-lib/moh-731-report/moh-731-report-base.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-base.component.ts");
/* harmony import */ var _etl_api_moh_731_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../etl-api/moh-731-resource.service */ "./src/app/etl-api/moh-731-resource.service.ts");







var Moh731ReportComponent = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Moh731ReportComponent, _super);
    function Moh731ReportComponent(moh731Resource, route, location, router) {
        var _this = _super.call(this, moh731Resource, route, router) || this;
        _this.moh731Resource = moh731Resource;
        _this.route = route;
        _this.location = location;
        _this.router = router;
        _this.data = [];
        _this.sectionsDef = [];
        _this.showIsAggregateControl = true;
        _this.showLocationsControl = true;
        return _this;
    }
    Moh731ReportComponent.prototype.ngOnInit = function () {
        this.loadReportParamsFromUrl();
    };
    Moh731ReportComponent.prototype.generateReport = function () {
        this.storeReportParamsInUrl();
        if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
            _super.prototype.generateReport.call(this);
        }
        else {
            this.errorMessage = 'Locations are required!';
        }
    };
    Moh731ReportComponent.prototype.storeReportParamsInUrl = function () {
        var state = {
            startDate: this.startDate.toUTCString(),
            endDate: this.endDate.toUTCString(),
            isLegacy: this.isLegacyReport,
            view: this.currentView,
            isAggregated: this.isAggregated,
            locations: this.locationUuids
        };
        var stateUrl = rison_node__WEBPACK_IMPORTED_MODULE_4__["encode"](state);
        var path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'state': stateUrl
        };
        this.location.replaceState(path.toString());
    };
    Moh731ReportComponent.prototype.loadReportParamsFromUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        if (path.queryParams['state']) {
            var state = rison_node__WEBPACK_IMPORTED_MODULE_4__["decode"](path.queryParams['state']);
            this.startDate = new Date(state.startDate);
            this.endDate = new Date(state.endDate);
            this.isLegacyReport = state.isLegacy;
            this.currentView = state.view;
            this.isAggregated = state.isAggregated;
            this.locationUuids = state.locations;
        }
        if (path.queryParams['state']) {
            this.generateReport();
        }
    };
    return Moh731ReportComponent;
}(_hiv_care_lib_moh_731_report_moh_731_report_base_component__WEBPACK_IMPORTED_MODULE_5__["Moh731ReportBaseComponent"]));



/***/ }),

/***/ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.css.shim.ngstyle.js":
/*!***********************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.css.shim.ngstyle.js ***!
  \***********************************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ngfactory.js":
/*!****************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ngfactory.js ***!
  \****************************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsCreatorsListComponent, View_DataEntryStatisticsCreatorsListComponent_0, View_DataEntryStatisticsCreatorsListComponent_Host_0, DataEntryStatisticsCreatorsListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsCreatorsListComponent", function() { return RenderType_DataEntryStatisticsCreatorsListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsCreatorsListComponent_0", function() { return View_DataEntryStatisticsCreatorsListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsCreatorsListComponent_Host_0", function() { return View_DataEntryStatisticsCreatorsListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsCreatorsListComponentNgFactory", function() { return DataEntryStatisticsCreatorsListComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_creators_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-creators-list.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_entry_statistics_creators_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-creators-list.component */ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_creators_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_creators_list.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_creators_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_creators_list.component PURE_IMPORTS_END */









var styles_DataEntryStatisticsCreatorsListComponent = [_data_entry_statistics_creators_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsCreatorsListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsCreatorsListComponent, data: {} });

function View_DataEntryStatisticsCreatorsListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, ["From ", " to ", " "])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](2, 2), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](3, 2)], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 0, _ck(_v, 2, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.params.startDate, "dd-MMMM-yyyy")); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 1, _ck(_v, 3, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.params.endDate, "dd-MMMM-yyyy")); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_DataEntryStatisticsCreatorsListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 18, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 10, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](5, null, ["", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsCreatorsListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 0, "hr", [["class", "intro-divider"], ["width", "40%"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 450px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 4898816, [["statsGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"], columnDefs: [2, "columnDefs"], pinnedBottomRowData: [3, "pinnedBottomRowData"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](603979776, 1, { columns: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 5, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](18, null, [" Total Encounters : ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 0, "p", [], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_1 = ((_co.params.startDate !== "") && (_co.params.endDate !== "")); _ck(_v, 7, 0, currVal_1); var currVal_2 = _co.gridOptions; var currVal_3 = _co.creatorRowData; var currVal_4 = _co.dataEntryEncounterColdef; var currVal_5 = _co.pinnedBottomRowData; _ck(_v, 12, 0, currVal_2, currVal_3, currVal_4, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.title; _ck(_v, 5, 0, currVal_0); var currVal_6 = _co.totalEncounters; _ck(_v, 18, 0, currVal_6); }); }
function View_DataEntryStatisticsCreatorsListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-creators-list", [], null, null, null, View_DataEntryStatisticsCreatorsListComponent_0, RenderType_DataEntryStatisticsCreatorsListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _data_entry_statistics_creators_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsCreatorsListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsCreatorsListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-creators-list", _data_entry_statistics_creators_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsCreatorsListComponent"], View_DataEntryStatisticsCreatorsListComponent_Host_0, { dataEntryEncounters: "dataEntryEncounters", params: "params" }, { patientListParams: "patientListParams" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ts":
/*!******************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ts ***!
  \******************************************************************************************************/
/*! exports provided: DataEntryStatisticsCreatorsListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsCreatorsListComponent", function() { return DataEntryStatisticsCreatorsListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


var DataEntryStatisticsCreatorsListComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsCreatorsListComponent(_cd) {
        this._cd = _cd;
        this.title = 'Encounters Per Type Per Creator';
        this.pinnedBottomRowData = [];
        this.allClicalEncounters = [];
        this.totalEncounters = 0;
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            pagination: true,
            paginationPageSize: 300
        };
        this.dataEntryEncounters = [];
        this.patientListParams = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.dataEntryEncounterColdef = [];
        this.creatorStats = [];
        this.creatorRowData = [];
    }
    DataEntryStatisticsCreatorsListComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsCreatorsListComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsCreatorsListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.dataEntryEncounters && this.dataEntryEncounters.length > 0) {
            this.processCreatorData();
        }
        else {
            this.creatorRowData = [];
        }
    };
    DataEntryStatisticsCreatorsListComponent.prototype.processCreatorData = function () {
        var _this = this;
        var trackColumns = [];
        var dataEntryStats = this.dataEntryEncounters;
        this.dataEntryEncounterColdef = [];
        this.pinnedBottomRowData = [];
        this.dataEntryEncounterColdef.push({
            headerName: 'Location',
            field: 'location',
            // pinned: 'left',
            rowGroup: true,
            hide: true
        }, {
            headerName: 'Creator',
            field: 'creators'
        }, {
            headerName: 'Total',
            field: 'total',
            onCellClicked: function (column) {
                var patientListParams = {
                    'creatorUuid': column.data.creatorUuid,
                    'locationUuids': column.data.locationUuid,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined') {
                    return '';
                }
                else {
                    return '<a href="javascript:void(0);" title="providercount">'
                        + column.value + '</a>';
                }
            }
        }, {
            headerName: 'Total Clinical Encounters',
            field: 'total_clinical',
            onCellClicked: function (column) {
                var patientListParams = {
                    'creatorUuid': column.data.creatorUuid,
                    'locationUuids': column.data.locationUuid,
                    'encounterTypeUuids': column.data.clinicalEncounters,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined' || column.value === 0) {
                    return '';
                }
                else {
                    return '<a href="javascript:void(0);" title="providercount">'
                        + column.value + '</a>';
                }
            }
        });
        this.gridOptions.groupDefaultExpanded = -1;
        var creatorMap = new Map();
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](dataEntryStats, function (stat) {
            var formId = stat.encounter_type_id;
            var creatorId = stat.creator_id;
            var encounterTypeUuid = stat.encounter_type_uuid;
            if (lodash__WEBPACK_IMPORTED_MODULE_1__["includes"](trackColumns, formId) === false) {
                _this.dataEntryEncounterColdef.push({
                    headerName: stat.encounter_type,
                    field: stat.encounter_type,
                    onCellClicked: function (column) {
                        var patientListParams = {
                            'creatorUuid': column.data.creatorUuid,
                            'encounterTypeUuids': encounterTypeUuid,
                            'locationUuids': column.data.locationUuid,
                            'startDate': _this.params.startDate,
                            'endDate': _this.params.endDate
                        };
                        _this.patientListParams.emit(patientListParams);
                    },
                    cellRenderer: function (column) {
                        if (typeof column.value === 'undefined' || column.value === 0) {
                            return '';
                        }
                        else {
                            return '<a href="javascript:void(0);" title="providercount">'
                                + column.value + '</a>';
                        }
                    }
                });
                trackColumns.push(formId);
            }
            var creatorObj = {
                'encounters': [
                    {
                        'encounter_type': stat.encounter_type,
                        'encounterUuid': stat.encounter_type_uuid,
                        'encounters_count': stat.encounters_count,
                        'is_clinical': stat.is_clinical_encounter
                    }
                ],
                'creatorUuid': stat.user_uuid,
                'creatorName': stat.creator_name,
                'location': stat.location,
                'locationUuid': stat.location_uuid
            };
            var creatorSaved = creatorMap.get(creatorId);
            if (typeof creatorSaved !== 'undefined') {
                creatorSaved.encounters.push({
                    'encounter_type': stat.encounter_type,
                    'encounterUuid': stat.encounter_type_uuid,
                    'encounters_count': stat.encounters_count,
                    'is_clinical': stat.is_clinical_encounter,
                    'location': stat.location,
                    'locationUuid': stat.location_uuid
                });
            }
            else {
                creatorMap.set(creatorId, creatorObj);
            }
        });
        this.generatecreatorRowData(creatorMap);
    };
    DataEntryStatisticsCreatorsListComponent.prototype.generatecreatorRowData = function (creatorMap) {
        var _this = this;
        var rowArray = [];
        var colSumMap = new Map();
        var totalCreatorEncounters = 0;
        var totalCreatorClinicalEncounters = 0;
        this.allClicalEncounters = [];
        creatorMap.forEach(function (creatorItem) {
            var forms = creatorItem.encounters;
            var totalEncounters = 0;
            var totalClinical = 0;
            var specificcreator = {
                creators: creatorItem.creatorName,
                creatorUuid: creatorItem.creatorUuid,
                location: creatorItem.location,
                locationUuid: creatorItem.locationUuid,
                clinicalEncounters: []
            };
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](forms, function (form) {
                specificcreator[form.encounter_type] = form.encounters_count;
                totalEncounters += form.encounters_count;
                if (form.is_clinical === 1) {
                    totalClinical += form.encounters_count;
                    specificcreator.clinicalEncounters.push(form.encounterUuid);
                    _this.allClicalEncounters.push(form.encounterUuid);
                }
                var colTotal = colSumMap.get(form.encounter_type);
                if (typeof colTotal === 'undefined') {
                    colSumMap.set(form.encounter_type, form.encounters_count);
                }
                else {
                    var newTotal = colTotal + form.encounters_count;
                    colSumMap.set(form.encounter_type, newTotal);
                }
            });
            totalCreatorEncounters += totalEncounters;
            specificcreator.total = totalEncounters;
            specificcreator.total_clinical = totalClinical;
            totalCreatorClinicalEncounters += totalClinical;
            rowArray.push(specificcreator);
        });
        this.totalEncounters = totalCreatorEncounters;
        var totalRow = this.createTotalsRow(colSumMap, totalCreatorEncounters, totalCreatorClinicalEncounters);
        var totalRowArray = [];
        totalRowArray.push(totalRow);
        this.creatorRowData = rowArray;
        this.pinnedBottomRowData = totalRowArray;
        this.setPinnedRow();
    };
    DataEntryStatisticsCreatorsListComponent.prototype.createTotalsRow = function (totalsMap, totalCreatorEncounters, totalCreatorClinicalEncounters) {
        var rowTotalObj = {
            'creators': 'Totals',
            'creatorUuid': '',
            'total': totalCreatorEncounters,
            'total_clinical': totalCreatorClinicalEncounters,
            'clinicalEncounters': lodash__WEBPACK_IMPORTED_MODULE_1__["uniq"](this.allClicalEncounters),
            'locationUuid': this.params.locationUuids,
        };
        totalsMap.forEach(function (monthTotal, index) {
            rowTotalObj[index] = monthTotal;
        });
        return rowTotalObj;
    };
    DataEntryStatisticsCreatorsListComponent.prototype.setPinnedRow = function () {
        if (this.gridOptions.api) {
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
        return true;
    };
    return DataEntryStatisticsCreatorsListComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.css.shim.ngstyle.js":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.css.shim.ngstyle.js ***!
  \*****************************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ngfactory.js":
/*!**********************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ngfactory.js ***!
  \**********************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsDailyListComponent, View_DataEntryStatisticsDailyListComponent_0, View_DataEntryStatisticsDailyListComponent_Host_0, DataEntryStatisticsDailyListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsDailyListComponent", function() { return RenderType_DataEntryStatisticsDailyListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsDailyListComponent_0", function() { return View_DataEntryStatisticsDailyListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsDailyListComponent_Host_0", function() { return View_DataEntryStatisticsDailyListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsDailyListComponentNgFactory", function() { return DataEntryStatisticsDailyListComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_daily_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-daily-list.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_entry_statistics_daily_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-daily-list.component */ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_daily_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_daily_list.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_daily_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_daily_list.component PURE_IMPORTS_END */









var styles_DataEntryStatisticsDailyListComponent = [_data_entry_statistics_daily_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsDailyListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsDailyListComponent, data: {} });

function View_DataEntryStatisticsDailyListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, ["From ", " to ", " "])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](2, 2), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](3, 2)], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 0, _ck(_v, 2, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.params.startDate, "dd-MMMM-yyyy")); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 1, _ck(_v, 3, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.params.endDate, "dd-MMMM-yyyy")); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_DataEntryStatisticsDailyListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 18, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 10, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](5, null, ["", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsDailyListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 0, "hr", [["class", "intro-divider"], ["width", "40%"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 450px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 4898816, [["statsGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"], columnDefs: [2, "columnDefs"], pinnedBottomRowData: [3, "pinnedBottomRowData"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](603979776, 1, { columns: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 5, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](18, null, [" Total Encounters : ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 0, "p", [], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_1 = ((_co.params.startDate !== "") && (_co.params.endDate !== "")); _ck(_v, 7, 0, currVal_1); var currVal_2 = _co.gridOptions; var currVal_3 = _co.dataEntryRowData; var currVal_4 = _co.dataEntryEncounterColdef; var currVal_5 = _co.pinnedBottomRowData; _ck(_v, 12, 0, currVal_2, currVal_3, currVal_4, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.title; _ck(_v, 5, 0, currVal_0); var currVal_6 = _co.totalEncounters; _ck(_v, 18, 0, currVal_6); }); }
function View_DataEntryStatisticsDailyListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-daily-list", [], null, null, null, View_DataEntryStatisticsDailyListComponent_0, RenderType_DataEntryStatisticsDailyListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _data_entry_statistics_daily_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsDailyListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsDailyListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-daily-list", _data_entry_statistics_daily_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsDailyListComponent"], View_DataEntryStatisticsDailyListComponent_Host_0, { dataEntryEncounters: "dataEntryEncounters", params: "params" }, { patientListParams: "patientListParams" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ts ***!
  \************************************************************************************************/
/*! exports provided: DataEntryStatisticsDailyListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsDailyListComponent", function() { return DataEntryStatisticsDailyListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);



var DataEntryStatisticsDailyListComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsDailyListComponent(_cd) {
        var _this = this;
        this._cd = _cd;
        this.title = 'Encounter Types Per Day';
        this.totalEncounters = 0;
        this.pinnedBottomRowData = [];
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            onGridSizeChanged: function () {
                if (_this.gridOptions.api) {
                    _this.gridOptions.api.sizeColumnsToFit();
                }
            },
            onGridReady: function (params) {
                if (_this.gridOptions.api) {
                    _this.gridOptions.api.sizeColumnsToFit();
                    // this.gridOptions.groupDefaultExpanded = -1;
                }
            }
        };
        this.patientListParams = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.dataEntryEncounterColdef = [];
        this.dataEntryStats = [];
    }
    DataEntryStatisticsDailyListComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsDailyListComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsDailyListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.dataEntryEncounters
            && this.dataEntryEncounters.length > 0) {
            this.processEncounterListData();
        }
        else {
            this.dataEntryRowData = [];
        }
    };
    // process encounter list data
    DataEntryStatisticsDailyListComponent.prototype.processEncounterListData = function () {
        var _this = this;
        var trackColumns = [];
        var dataEntryEncounters = this.dataEntryEncounters;
        var encounterMap = new Map();
        this.dataEntryEncounterColdef = [];
        this.pinnedBottomRowData = [];
        this.dataEntryEncounterColdef.push({
            headerName: 'Location',
            field: 'location',
            // pinned: 'left',
            rowGroup: true,
            hide: true
        }, {
            headerName: 'Encounter Types',
            field: 'encounter_type' // 'encounterType'
        }, {
            headerName: 'Total',
            field: 'rowTotals',
            onCellClicked: function (column) {
                var patientListParams = {
                    'providerUuid': _this.params.providerUuid,
                    'locationUuids': column.data.locationUuid,
                    'encounterTypeUuids': column.data.encounterTypeUuid,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined') {
                    return ' ';
                }
                else {
                    return '<a href="javascript:void(0);" title="providercount">'
                        + column.value + '</a>';
                }
            }
        });
        this.gridOptions.groupDefaultExpanded = -1;
        var dynamicCols = [];
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](dataEntryEncounters, function (stat) {
            // load the other columns based on date
            var encounterDate = moment__WEBPACK_IMPORTED_MODULE_2__(stat.date).format('DD-MM-YYYY');
            // let startDate = Moment(stat.date).toISOString();
            // let encounterId = stat.encounter_type_id;
            if (lodash__WEBPACK_IMPORTED_MODULE_1__["includes"](trackColumns, encounterDate) === false) {
                dynamicCols.push({
                    headerName: encounterDate,
                    field: encounterDate,
                    onCellClicked: function (column) {
                        var patientListParams = {
                            'startDate': moment__WEBPACK_IMPORTED_MODULE_2__(stat.date).format('YYYY-MM-DD'),
                            'encounterTypeUuids': column.data.encounterTypeUuid,
                            'endDate': moment__WEBPACK_IMPORTED_MODULE_2__(stat.date).format('YYYY-MM-DD'),
                            'locationUuids': column.data.locationUuid,
                            'providerUuid': _this.params.providerUuid,
                        };
                        _this.patientListParams.emit(patientListParams);
                    },
                    cellRenderer: function (column) {
                        if (typeof column.value === 'undefined') {
                            return ' ';
                        }
                        else {
                            return '<a href="javascript:void(0);" title="Identifiers">'
                                + column.value + '</a>';
                        }
                    }
                });
                trackColumns.push(encounterDate);
            }
            var encounterObj = {
                'location': stat.location,
                'locationUuid': stat.locationUuid,
                'encounterTypes': []
            };
            var e = {
                'encounterTypeUuid': stat.encounter_type_uuid,
                'encounterName': stat.encounter_type,
                'encounterCounts': [
                    {
                        'encounterDate': encounterDate,
                        'encounterCount': stat.encounters_count
                    }
                ]
            };
            var savedEncounter = encounterMap.get(stat.location);
            if (typeof savedEncounter !== 'undefined') {
                var savedEncounterTypes = savedEncounter.encounterTypes;
                var savedSpecificEncounter = savedEncounterTypes[stat.encounter_type];
                if (typeof savedSpecificEncounter !== 'undefined') {
                    savedEncounter.encounterTypes[stat.encounter_type].encounterCounts.push({
                        'encounterDate': encounterDate,
                        'encounterCount': stat.encounters_count
                    });
                }
                else {
                    savedEncounter.encounterTypes[stat.encounter_type] = e;
                }
                encounterMap.set(stat.location, savedEncounter);
            }
            else {
                encounterObj.encounterTypes[stat.encounter_type] = e;
                encounterMap.set(stat.location, encounterObj);
            }
        });
        // sort col defs based on dates i.e first to last date
        var sortedDymanicCols = this.sortColumnHeadersByDate(dynamicCols);
        this.mergeColsDef(sortedDymanicCols);
        this.processEncounterRows(encounterMap);
    };
    DataEntryStatisticsDailyListComponent.prototype.sortColumnHeadersByDate = function (columns) {
        return columns.sort(function (a, b) {
            var splitDateA = (a.field).split('-');
            var splitDateB = (b.field).split('-');
            // create date object for comparison
            var dateA = new Date(splitDateA[2], splitDateA[1], splitDateA[0]);
            var dateB = new Date(splitDateB[2], splitDateB[1], splitDateB[0]);
            if (dateA > dateB) {
                return 1;
            }
            else if (dateA < dateB) {
                return -1;
            }
            else {
                return 0;
            }
        });
    };
    DataEntryStatisticsDailyListComponent.prototype.mergeColsDef = function (dynamicCols) {
        var _this = this;
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](dynamicCols, function (col) {
            _this.dataEntryEncounterColdef.push(col);
        });
    };
    DataEntryStatisticsDailyListComponent.prototype.processEncounterRows = function (encounterMap) {
        var allRows = [];
        var totalEncounters = 0;
        encounterMap.forEach(function (encounterItem, encounterIndex) {
            var locationName = encounterItem.location;
            var locationUuid = encounterItem.locationUuid;
            var encounterTypes = encounterItem.encounterTypes;
            Object.keys(encounterTypes).forEach(function (key) {
                var encounterRow = {
                    'rowTotals': 0
                };
                encounterRow['location'] = locationName;
                encounterRow['locationUuid'] = locationUuid;
                encounterRow['encounter_type'] = key;
                encounterRow['encounterTypeUuid'] = encounterTypes[key].encounterTypeUuid;
                var encounterType = encounterTypes[key];
                var encounterCounts = encounterType.encounterCounts;
                var rowTotal = 0;
                lodash__WEBPACK_IMPORTED_MODULE_1__["each"](encounterCounts, function (encounterCount) {
                    encounterRow[encounterCount.encounterDate] = encounterCount.encounterCount;
                    rowTotal += encounterCount.encounterCount;
                });
                encounterRow['rowTotals'] = rowTotal;
                totalEncounters += rowTotal;
                allRows.push(encounterRow);
            });
        });
        this.dataEntryRowData = allRows;
        this.totalEncounters = totalEncounters;
    };
    DataEntryStatisticsDailyListComponent.prototype.createTotalsRow = function (totalsMap, totalEncounters) {
        var rowTotalObj = {
            'encounterUuid': '',
            'encounterType': 'Total',
            'rowTotals': totalEncounters
        };
        totalsMap.forEach(function (dateTotal, index) {
            rowTotalObj[index] = dateTotal;
        });
        return rowTotalObj;
    };
    DataEntryStatisticsDailyListComponent.prototype.setPinnedRow = function () {
        if (this.gridOptions.api) {
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
        return true;
    };
    return DataEntryStatisticsDailyListComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.css.shim.ngstyle.js":
/*!******************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-encounters.component.css.shim.ngstyle.js ***!
  \******************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [".loader[_ngcontent-%COMP%] {\n    position: absolute;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    text-align: center;\n    z-index: 9;\n    box-sizing: border-box;\n    background-color: #fff;\n    color: #fff;\n    opacity: .8;\n  }\n  \n  .loader[_ngcontent-%COMP%]   .fa[_ngcontent-%COMP%]:before {\n    margin-right: 12px;\n    display: inline-block;\n  }\n  \n  .loader[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    padding: 12px;\n    background-color: #0d6aad;\n    border-radius: 6px;\n    position: relative;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n    display: inline-block;\n  }\n  \n  .fa-spin[_ngcontent-%COMP%] {\n    width: 16px;\n    margin-right: 8px;\n  }"];



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ngfactory.js":
/*!***********************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ngfactory.js ***!
  \***********************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsEncountersComponent, View_DataEntryStatisticsEncountersComponent_0, View_DataEntryStatisticsEncountersComponent_Host_0, DataEntryStatisticsEncountersComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsEncountersComponent", function() { return RenderType_DataEntryStatisticsEncountersComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsEncountersComponent_0", function() { return View_DataEntryStatisticsEncountersComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsEncountersComponent_Host_0", function() { return View_DataEntryStatisticsEncountersComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsEncountersComponentNgFactory", function() { return DataEntryStatisticsEncountersComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_encounters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-encounters.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _daily_list_data_entry_statistics_daily_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./daily-list/data-entry-statistics-daily-list.component.ngfactory */ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ngfactory.js");
/* harmony import */ var _daily_list_data_entry_statistics_daily_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./daily-list/data-entry-statistics-daily-list.component */ "./src/app/data-entry-statistics/daily-list/data-entry-statistics-daily-list.component.ts");
/* harmony import */ var _monthly_list_data_entry_statistics_monthly_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./monthly-list/data-entry-statistics-monthly-list.component.ngfactory */ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ngfactory.js");
/* harmony import */ var _monthly_list_data_entry_statistics_monthly_list_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./monthly-list/data-entry-statistics-monthly-list.component */ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ts");
/* harmony import */ var _providers_list_data_entry_statistics_providers_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./providers-list/data-entry-statistics-providers-list.component.ngfactory */ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ngfactory.js");
/* harmony import */ var _providers_list_data_entry_statistics_providers_list_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./providers-list/data-entry-statistics-providers-list.component */ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ts");
/* harmony import */ var _creators_list_data_entry_statistics_creators_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./creators-list/data-entry-statistics-creators-list.component.ngfactory */ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ngfactory.js");
/* harmony import */ var _creators_list_data_entry_statistics_creators_list_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./creators-list/data-entry-statistics-creators-list.component */ "./src/app/data-entry-statistics/creators-list/data-entry-statistics-creators-list.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _data_entry_statistics_encounters_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./data-entry-statistics-encounters.component */ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_encounters.component.css.shim.ngstyle,_angular_core,_daily_list_data_entry_statistics_daily_list.component.ngfactory,_daily_list_data_entry_statistics_daily_list.component,_monthly_list_data_entry_statistics_monthly_list.component.ngfactory,_monthly_list_data_entry_statistics_monthly_list.component,_providers_list_data_entry_statistics_providers_list.component.ngfactory,_providers_list_data_entry_statistics_providers_list.component,_creators_list_data_entry_statistics_creators_list.component.ngfactory,_creators_list_data_entry_statistics_creators_list.component,_angular_common,_data_entry_statistics_encounters.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_encounters.component.css.shim.ngstyle,_angular_core,_daily_list_data_entry_statistics_daily_list.component.ngfactory,_daily_list_data_entry_statistics_daily_list.component,_monthly_list_data_entry_statistics_monthly_list.component.ngfactory,_monthly_list_data_entry_statistics_monthly_list.component,_providers_list_data_entry_statistics_providers_list.component.ngfactory,_providers_list_data_entry_statistics_providers_list.component,_creators_list_data_entry_statistics_creators_list.component.ngfactory,_creators_list_data_entry_statistics_creators_list.component,_angular_common,_data_entry_statistics_encounters.component PURE_IMPORTS_END */












var styles_DataEntryStatisticsEncountersComponent = [_data_entry_statistics_encounters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsEncountersComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsEncountersComponent, data: {} });

function View_DataEntryStatisticsEncountersComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-daily-list", [], null, [[null, "patientListParams"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("patientListParams" === en)) {
                var pd_0 = (_co.getPatientListParams($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _daily_list_data_entry_statistics_daily_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_DataEntryStatisticsDailyListComponent_0"], _daily_list_data_entry_statistics_daily_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_DataEntryStatisticsDailyListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _daily_list_data_entry_statistics_daily_list_component__WEBPACK_IMPORTED_MODULE_3__["DataEntryStatisticsDailyListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { dataEntryEncounters: [0, "dataEntryEncounters"], params: [1, "params"] }, { patientListParams: "patientListParams" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.dataEntryEncounterData; var currVal_1 = _co.params; _ck(_v, 1, 0, currVal_0, currVal_1); }, null);
}
function View_DataEntryStatisticsEncountersComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-monthly-list", [], null, [[null, "patientListParams"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("patientListParams" === en)) {
                var pd_0 = (_co.getPatientListParams($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _monthly_list_data_entry_statistics_monthly_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_DataEntryStatisticsMonthlyListComponent_0"], _monthly_list_data_entry_statistics_monthly_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_DataEntryStatisticsMonthlyListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _monthly_list_data_entry_statistics_monthly_list_component__WEBPACK_IMPORTED_MODULE_5__["DataEntryStatisticsMonthlyListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { params: [0, "params"], dataEntryEncounters: [1, "dataEntryEncounters"] }, { patientListParams: "patientListParams" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.params; var currVal_1 = _co.dataEntryEncounterData; _ck(_v, 1, 0, currVal_0, currVal_1); }, null);
}
function View_DataEntryStatisticsEncountersComponent_4(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-provider-list", [], null, [[null, "patientListParams"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("patientListParams" === en)) {
                var pd_0 = (_co.getPatientListParams($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _providers_list_data_entry_statistics_providers_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_DataEntryStatisticsProviderListComponent_0"], _providers_list_data_entry_statistics_providers_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_DataEntryStatisticsProviderListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _providers_list_data_entry_statistics_providers_list_component__WEBPACK_IMPORTED_MODULE_7__["DataEntryStatisticsProviderListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { dataEntryEncounters: [0, "dataEntryEncounters"], params: [1, "params"] }, { patientListParams: "patientListParams" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.dataEntryEncounterData; var currVal_1 = _co.params; _ck(_v, 1, 0, currVal_0, currVal_1); }, null);
}
function View_DataEntryStatisticsEncountersComponent_5(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-creators-list", [], null, [[null, "patientListParams"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("patientListParams" === en)) {
                var pd_0 = (_co.getPatientListParams($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _creators_list_data_entry_statistics_creators_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__["View_DataEntryStatisticsCreatorsListComponent_0"], _creators_list_data_entry_statistics_creators_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__["RenderType_DataEntryStatisticsCreatorsListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _creators_list_data_entry_statistics_creators_list_component__WEBPACK_IMPORTED_MODULE_9__["DataEntryStatisticsCreatorsListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { dataEntryEncounters: [0, "dataEntryEncounters"], params: [1, "params"] }, { patientListParams: "patientListParams" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.dataEntryEncounterData; var currVal_1 = _co.params; _ck(_v, 1, 0, currVal_0, currVal_1); }, null);
}
function View_DataEntryStatisticsEncountersComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 8, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsEncountersComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsEncountersComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsEncountersComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsEncountersComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.showEncountersList; _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.showMontlyList; _ck(_v, 4, 0, currVal_1); var currVal_2 = _co.showProviderList; _ck(_v, 6, 0, currVal_2); var currVal_3 = _co.showCreatorsList; _ck(_v, 8, 0, currVal_3); }, null); }
function View_DataEntryStatisticsEncountersComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsEncountersComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = (_co.dataEntryEncounterData.length > 0); _ck(_v, 3, 0, currVal_0); }, null); }
function View_DataEntryStatisticsEncountersComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-encounters", [], null, null, null, View_DataEntryStatisticsEncountersComponent_0, RenderType_DataEntryStatisticsEncountersComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _data_entry_statistics_encounters_component__WEBPACK_IMPORTED_MODULE_11__["DataEntryStatisticsEncountersComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsEncountersComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-encounters", _data_entry_statistics_encounters_component__WEBPACK_IMPORTED_MODULE_11__["DataEntryStatisticsEncountersComponent"], View_DataEntryStatisticsEncountersComponent_Host_0, { dataEntryEncounterData: "dataEntryEncounterData", params: "params" }, { patientListParams: "patientListParams" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ts ***!
  \*************************************************************************************/
/*! exports provided: DataEntryStatisticsEncountersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsEncountersComponent", function() { return DataEntryStatisticsEncountersComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var DataEntryStatisticsEncountersComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsEncountersComponent(_cd) {
        this._cd = _cd;
        this.title = '';
        this.dataEntryEncounterData = [];
        this.patientListParams = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.dataEntryEncounters = [];
        this.showCreatorsList = false;
        this.showEncountersList = false;
        this.showMontlyList = false;
        this.showProviderList = false;
        this.sizeColumns = true;
        this.dataEntryEncounterColdef = [];
    }
    DataEntryStatisticsEncountersComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsEncountersComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsEncountersComponent.prototype.ngOnChanges = function (changes) {
        if (changes.dataEntryEncounterData
            && this.dataEntryEncounterData.length > 0) {
            this.processEncounterData(this.params);
        }
        else {
            this.dataEntryEncounters = [];
        }
    };
    DataEntryStatisticsEncountersComponent.prototype.processEncounterData = function (params) {
        var viewType = params.subType;
        this.resetAllLists();
        switch (viewType) {
            case 'by-date-by-encounter-type':
                this.showEncountersList = true;
                this.title = 'Encounters per type per day';
                break;
            case 'by-month-by-encounter-type':
                this.showMontlyList = true;
                this.title = 'Encounters per type per Month';
                break;
            case 'by-provider-by-encounter-type':
                this.showProviderList = true;
                this.title = 'Encounters per type per Provider';
                break;
            case 'by-creator-by-encounter-type':
                this.showCreatorsList = true;
                this.title = 'Encounters per type per Creator';
                break;
            default:
        }
    };
    DataEntryStatisticsEncountersComponent.prototype.resetAllLists = function () {
        this.showCreatorsList = false;
        this.showMontlyList = false;
        this.showProviderList = false;
        this.showEncountersList = false;
    };
    DataEntryStatisticsEncountersComponent.prototype.getPatientListParams = function ($event) {
        this.patientListParams.emit($event);
    };
    return DataEntryStatisticsEncountersComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.css.shim.ngstyle.js":
/*!*********************************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.css.shim.ngstyle.js ***!
  \*********************************************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [".picker-calendar[_ngcontent-%COMP%]   .picker-calendar-row[_ngcontent-%COMP%]{\nwidth:400px !important;\n}\n\n.list-group-item[_ngcontent-%COMP%]:focus, .list-group-item[_ngcontent-%COMP%]:hover {\n    z-index: 2;\n    color: #fff;\n    background-color: #337ab7;\n    border-color: #337ab7;\n    cursor: pointer;\n  }\n\n.list-group-item[_ngcontent-%COMP%]:hover   a[_ngcontent-%COMP%]{\n    color: #fff;\n  }\n\n.filter-input[_ngcontent-%COMP%]{\n    margin: 5px;\n    margin-bottom: 5px;\n\n  }\n\n.toggle-filters[_ngcontent-%COMP%]{\n    color: green;\n  }\n\n.dynamic-provider-list[_ngcontent-%COMP%]{\n    z-index: 1;\n    position: absolute;\n    width: 400px;;\n  }\n\n.action-btn-section[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{\n    margin-top: 10px;\n  }\n\n#provider-input[_ngcontent-%COMP%]{\n     height:45px;\n  }\n\n.filter-btn[_ngcontent-%COMP%] {\n    height: 42px;\n    margin-left: -15px;\n  }\n\n.input-row[_ngcontent-%COMP%]{\n    margin-top: 10px;\n  }"];



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ngfactory.js":
/*!**************************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ngfactory.js ***!
  \**************************************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsFiltersComponent, View_DataEntryStatisticsFiltersComponent_0, View_DataEntryStatisticsFiltersComponent_Host_0, DataEntryStatisticsFiltersComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsFiltersComponent", function() { return RenderType_DataEntryStatisticsFiltersComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsFiltersComponent_0", function() { return View_DataEntryStatisticsFiltersComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsFiltersComponent_Host_0", function() { return View_DataEntryStatisticsFiltersComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsFiltersComponentNgFactory", function() { return DataEntryStatisticsFiltersComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_filters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-filters.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component.ngfactory */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component.ngfactory.js");
/* harmony import */ var angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../node_modules/ngx-openmrs-formentry/dist/ngx-formentry/ngx-openmrs-formentry.ngfactory */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/ngx-openmrs-formentry.ngfactory.js");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");
/* harmony import */ var _data_entry_statistics_filters_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-filters.component */ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../openmrs-api/provider-resource.service */ "./src/app/openmrs-api/provider-resource.service.ts");
/* harmony import */ var _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../openmrs-api/user.service */ "./src/app/openmrs-api/user.service.ts");
/* harmony import */ var _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../openmrs-api/encounter-resource.service */ "./src/app/openmrs-api/encounter-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_filters.component.css.shim.ngstyle,_angular_core,_.._.._.._node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect.component.ngfactory,angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect.component,_angular_forms,_angular_common,_.._.._.._node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry.ngfactory,ngx_openmrs_formentry_dist_ngx_formentry,_data_entry_statistics_filters.component,_.._openmrs_api_location_resource.service,_.._openmrs_api_provider_resource.service,_.._openmrs_api_user.service,_.._openmrs_api_encounter_resource.service,_angular_router,_.._etl_api_data_entry_statistics_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_filters.component.css.shim.ngstyle,_angular_core,_.._.._.._node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect.component.ngfactory,angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect.component,_angular_forms,_angular_common,_.._.._.._node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry.ngfactory,ngx_openmrs_formentry_dist_ngx_formentry,_data_entry_statistics_filters.component,_.._openmrs_api_location_resource.service,_.._openmrs_api_provider_resource.service,_.._openmrs_api_user.service,_.._openmrs_api_encounter_resource.service,_angular_router,_.._etl_api_data_entry_statistics_resource.service PURE_IMPORTS_END */















var styles_DataEntryStatisticsFiltersComponent = [_data_entry_statistics_filters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsFiltersComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsFiltersComponent, data: {} });

function View_DataEntryStatisticsFiltersComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "div", [["class", "alert alert-danger"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayMsg.message; _ck(_v, 3, 0, currVal_0); }); }
function View_DataEntryStatisticsFiltersComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "button", [["class", "pull-right"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.hideFilter() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-angle-down fa-2x fa-fw toggle-filters"]], null, null, null, null, null))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "button", [["class", "pull-right"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.showFilter() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-angle-left fa-2x fa-fw toggle-filters"]], null, null, null, null, null))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_6(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "button", [["class", "btn filter-btn"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.resetLocations() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-trash fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Select None"]))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_7(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "button", [["class", "btn filter-btn"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.resetEncounterTypes() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-trash fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Select None"]))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_9(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "button", [["class", "btn filter-btn"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.resetCreators() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-trash fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Select None"]))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_8(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 15, "div", [["class", "col-md-6 col-lg-6 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 14, "div", [["class", "row input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 13, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 2, "div", [["class", "col-lg-12 col-md-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Creator"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 6, "div", [["class", "col-lg-9 col-md-9 col-sm-9 col-xs-9"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 5, "angular2-multiselect", [["name", "form-filter"]], [[8, "className", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "onSelect"], [null, "onDeSelect"], [null, "keyup"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.creator = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("onSelect" === en)) {
                var pd_1 = (_co.creatorSelect($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("onDeSelect" === en)) {
                var pd_2 = (_co.creatorDeselect($event) !== false);
                ad = (pd_2 && ad);
            }
            if (("keyup" === en)) {
                var pd_3 = (_co.searchCreator($event.target.value) !== false);
                ad = (pd_3 && ad);
            }
            return ad;
        }, _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_AngularMultiSelect_0"], _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_AngularMultiSelect"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 376832, null, 0, angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"], [], { data: [0, "data"], settings: [1, "settings"] }, { onSelect: "onSelect", onDeSelect: "onDeSelect" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"]]], { name: [0, "name"], model: [1, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](13, 0, null, null, 2, "div", [["class", "col-lg-3 col-md-3 col-sm-3 col-xs-3"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_9)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](15, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_8 = _co.creators; var currVal_9 = _co.multpleSelectDropDownSettings; _ck(_v, 8, 0, currVal_8, currVal_9); var currVal_10 = "form-filter"; var currVal_11 = _co.creator; _ck(_v, 10, 0, currVal_10, currVal_11); var currVal_12 = (_co.creator.length > 0); _ck(_v, 15, 0, currVal_12); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).defaultSettings.classes; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassUntouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassTouched; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassPristine; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassDirty; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassValid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassInvalid; var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassPending; _ck(_v, 7, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7); });
}
function View_DataEntryStatisticsFiltersComponent_12(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "li", [["class", "list-group-item"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.selectProvider(_v.context.$implicit) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, [" ", " "]))], null, function (_ck, _v) { var currVal_0 = _v.context.$implicit.name; _ck(_v, 1, 0, currVal_0); });
}
function View_DataEntryStatisticsFiltersComponent_11(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "ul", [["class", "list-group dynamic-provider-list"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "a", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_12)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.providers; _ck(_v, 3, 0, currVal_0); }, null); }
function View_DataEntryStatisticsFiltersComponent_13(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "button", [["class", "btn filter-btn"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.resetProvider() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "i", [["class", "fa fa-trash fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Select None"]))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_10(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 17, "div", [["class", "col-md-6 col-lg-6 col-sm-4 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 16, "div", [["class", "row input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 15, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 2, "div", [["class", "col-lg-12 col-md-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Provider"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 8, "div", [["class", "col-lg-9 col-md-9 col-sm-9 col-xs-9"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 5, "input", [["class", "form-control"], ["id", "provider-input"], ["placeholder", "Type to search"], ["type", "text"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "keyup"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("input" === en)) {
                var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8)._handleInput($event.target.value) !== false);
                ad = (pd_0 && ad);
            }
            if (("blur" === en)) {
                var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).onTouched() !== false);
                ad = (pd_1 && ad);
            }
            if (("compositionstart" === en)) {
                var pd_2 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8)._compositionStart() !== false);
                ad = (pd_2 && ad);
            }
            if (("compositionend" === en)) {
                var pd_3 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8)._compositionEnd($event.target.value) !== false);
                ad = (pd_3 && ad);
            }
            if (("ngModelChange" === en)) {
                var pd_4 = ((_co.provider = $event) !== false);
                ad = (pd_4 && ad);
            }
            if (("keyup" === en)) {
                var pd_5 = (_co.searchProvider($event.target.value) !== false);
                ad = (pd_5 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_11)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 2, "div", [["class", "col-lg-3 col-md-3 col-sm-3 col-xs-3"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_13)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](17, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_7 = _co.provider; _ck(_v, 10, 0, currVal_7); var currVal_8 = _co.providers; _ck(_v, 14, 0, currVal_8); var currVal_9 = (_co.provider.length > 0); _ck(_v, 17, 0, currVal_9); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassUntouched; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassTouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassPristine; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassDirty; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassValid; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassInvalid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 12).ngClassPending; _ck(_v, 7, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); });
}
function View_DataEntryStatisticsFiltersComponent_14(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "div", [["class", "col-md-6 col-lg-6 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 5, "div", [["class", "form-group input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Start Date"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "date-time-picker", [["tabindex", "0"]], [[8, "id", 0]], [[null, "onDateChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onDateChange" === en)) {
                var pd_0 = (_co.getSelectedStartDate($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ɵk_0"], _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ɵk"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 114688, null, 0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"], [], { modelValue: [0, "modelValue"] }, { onDateChange: "onDateChange" })], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.selectedStartDate; _ck(_v, 6, 0, currVal_1); }, function (_ck, _v) { var currVal_0 = "selectedStartDate"; _ck(_v, 4, 0, currVal_0); });
}
function View_DataEntryStatisticsFiltersComponent_15(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "div", [["class", "col-md-6 col-lg-6 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 5, "div", [["class", "form-group input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["End Date"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "date-time-picker", [["tabindex", "0"]], [[8, "id", 0]], [[null, "onDateChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onDateChange" === en)) {
                var pd_0 = (_co.getSelectedEndDate($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ɵk_0"], _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ɵk"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 114688, null, 0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"], [], { modelValue: [0, "modelValue"] }, { onDateChange: "onDateChange" })], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.selectedEndDate; _ck(_v, 6, 0, currVal_1); }, function (_ck, _v) { var currVal_0 = "selectedEndDate"; _ck(_v, 4, 0, currVal_0); });
}
function View_DataEntryStatisticsFiltersComponent_16(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "div", [["class", "col-md-6 col-lg-6 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 5, "div", [["class", "form-group input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Start Month"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "date-time-picker", [["showMonths", "true"], ["tabindex", "0"]], [[8, "id", 0]], [[null, "onDateChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onDateChange" === en)) {
                var pd_0 = (_co.getSelectedStartMonth($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["View_ɵk_0"], _node_modules_ngx_openmrs_formentry_dist_ngx_formentry_ngx_openmrs_formentry_ngfactory__WEBPACK_IMPORTED_MODULE_6__["RenderType_ɵk"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 114688, null, 0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_7__["ɵk"], [], { modelValue: [0, "modelValue"] }, { onDateChange: "onDateChange" })], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.selectedStartMonth; _ck(_v, 6, 0, currVal_1); }, function (_ck, _v) { var currVal_0 = "selectedStartMonth"; _ck(_v, 4, 0, currVal_0); });
}
function View_DataEntryStatisticsFiltersComponent_5(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 42, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 15, "div", [["class", "col-md-6 col-lg-6 col-sm-6 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 14, "div", [["class", "row input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 13, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "div", [["class", "col-lg-12 col-md-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Location"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 6, "div", [["class", "col-lg-9 col-md-9 col-sm-9 col-xs-9"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 5, "angular2-multiselect", [["name", "location-filter"]], [[8, "className", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "onSelect"], [null, "onDeSelect"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.location = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("onSelect" === en)) {
                var pd_1 = (_co.locationSelect($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("onDeSelect" === en)) {
                var pd_2 = (_co.locationDeselect($event) !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_AngularMultiSelect_0"], _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_AngularMultiSelect"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](9, 376832, null, 0, angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"], [], { data: [0, "data"], settings: [1, "settings"] }, { onSelect: "onSelect", onDeSelect: "onDeSelect" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"]]], { name: [0, "name"], model: [1, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 2, "div", [["class", "col-lg-3 col-md-3 col-sm-3 col-xs-3"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_6)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 15, "div", [["class", "col-md-6 col-lg-6 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](18, 0, null, null, 14, "div", [["class", "row input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 13, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, null, null, 2, "div", [["class", "col-lg-12 col-md-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](21, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Encounter Type"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](23, 0, null, null, 6, "div", [["class", "col-lg-9 col-md-9 col-sm-9 col-xs-9"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](24, 0, null, null, 5, "angular2-multiselect", [["name", "provider-filter"]], [[8, "className", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "onSelect"], [null, "onDeSelect"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.encounterType = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("onSelect" === en)) {
                var pd_1 = (_co.encounterTypeSelect($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("onDeSelect" === en)) {
                var pd_2 = (_co.encounterTypeDeselect($event) !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_AngularMultiSelect_0"], _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_AngularMultiSelect"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 376832, null, 0, angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"], [], { data: [0, "data"], settings: [1, "settings"] }, { onSelect: "onSelect", onDeSelect: "onDeSelect" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](27, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"]]], { name: [0, "name"], model: [1, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](29, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](30, 0, null, null, 2, "div", [["class", "col-lg-3 col-md-3 col-sm-3 col-xs-3"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_7)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](32, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_8)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](34, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_10)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](36, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_14)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](38, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_15)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](40, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_16)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](42, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_8 = _co.locations; var currVal_9 = _co.multpleSelectDropDownSettings; _ck(_v, 9, 0, currVal_8, currVal_9); var currVal_10 = "location-filter"; var currVal_11 = _co.location; _ck(_v, 11, 0, currVal_10, currVal_11); var currVal_12 = (_co.location.length > 0); _ck(_v, 16, 0, currVal_12); var currVal_21 = _co.encounterTypes; var currVal_22 = _co.multpleSelectDropDownSettings; _ck(_v, 25, 0, currVal_21, currVal_22); var currVal_23 = "provider-filter"; var currVal_24 = _co.encounterType; _ck(_v, 27, 0, currVal_23, currVal_24); var currVal_25 = (_co.encounterType.length > 0); _ck(_v, 32, 0, currVal_25); var currVal_26 = _co.selectedView.encounterTypePerCreator; _ck(_v, 34, 0, currVal_26); var currVal_27 = !_co.selectedView.encounterTypePerCreator; _ck(_v, 36, 0, currVal_27); var currVal_28 = ((_co.selectedView.encounterTypePerDay || _co.selectedView.encounterTypePerProvider) || _co.selectedView.encounterTypePerCreator); _ck(_v, 38, 0, currVal_28); var currVal_29 = (_co.selectedView.encounterTypePerCreator || _co.selectedView.encounterTypePerProvider); _ck(_v, 40, 0, currVal_29); var currVal_30 = _co.selectedView.encounterTypePerMonth; _ck(_v, 42, 0, currVal_30); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9).defaultSettings.classes; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassUntouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassTouched; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPristine; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassDirty; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassValid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassInvalid; var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPending; _ck(_v, 8, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7); var currVal_13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).defaultSettings.classes; var currVal_14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassUntouched; var currVal_15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassTouched; var currVal_16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassPristine; var currVal_17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassDirty; var currVal_18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassValid; var currVal_19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassInvalid; var currVal_20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassPending; _ck(_v, 24, 0, currVal_13, currVal_14, currVal_15, currVal_16, currVal_17, currVal_18, currVal_19, currVal_20); });
}
function View_DataEntryStatisticsFiltersComponent_17(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "button", [["class", "btn btn-success"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.previousWeek() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-angle-left fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Previous 7 days"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "button", [["class", "btn btn-success"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.nextWeek() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Next 7 days "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 0, "i", [["class", "fa fa-angle-right fa-fw"]], null, null, null, null, null))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_18(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 6, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "button", [["class", "btn btn-success"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.previousYear() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-angle-left fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Previous 12 Months"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 2, "button", [["class", "btn btn-success"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.nextYear() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Next 12 Months "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 0, "i", [["class", "fa fa-angle-right fa-fw"]], null, null, null, null, null))], null, null);
}
function View_DataEntryStatisticsFiltersComponent_4(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 16, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 13, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 12, "div", [["clas", "row input-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 6, "div", [["class", "col-md-2 col-lg-2 col-sm-3 col-xs-12 action-btn-section"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 2, "button", [["class", "btn btn-primary load-clear"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.search() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 0, "i", [["class", "fa fa-search fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Load"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 2, "button", [["class", "btn btn-danger load-clear"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.resetAll() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 0, "i", [["class", "fa fa-trash fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Clear"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 4, "div", [["class", "col-md-4 col-lg-4 col-sm-4 col-xs-12 action-btn-section"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_17)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_18)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.showFilters; _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.selectedView.encounterTypePerDay; _ck(_v, 14, 0, currVal_1); var currVal_2 = _co.selectedView.encounterTypePerMonth; _ck(_v, 16, 0, currVal_2); }, null);
}
function View_DataEntryStatisticsFiltersComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 19, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 7, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 4, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 10, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 9, "div", [["class", "col-md-4 col-lg-4 col-sm-4 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 8, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](12, 0, null, null, 1, "label", [["class", "control-label"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Select View"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 5, "angular2-multiselect", [["name", "view-filter"]], [[8, "className", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "onSelect"], [null, "onDeSelect"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.view = $event) !== false);
                ad = (pd_0 && ad);
            }
            if (("onSelect" === en)) {
                var pd_1 = (_co.selectView($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("onDeSelect" === en)) {
                var pd_2 = (_co.viewDeselect($event) !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_AngularMultiSelect_0"], _node_modules_angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_AngularMultiSelect"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](15, 376832, null, 0, angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"], [], { data: [0, "data"], settings: [1, "settings"] }, { onSelect: "onSelect", onDeSelect: "onDeSelect" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [angular2_multiselect_dropdown_angular2_multiselect_dropdown_multiselect_component__WEBPACK_IMPORTED_MODULE_3__["AngularMultiSelect"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](17, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALUE_ACCESSOR"]]], { name: [0, "name"], model: [1, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](19, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsFiltersComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](21, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.displayMsg.show; _ck(_v, 3, 0, currVal_0); var currVal_1 = _co.showFilters; _ck(_v, 6, 0, currVal_1); var currVal_2 = !_co.showFilters; _ck(_v, 8, 0, currVal_2); var currVal_11 = _co.views; var currVal_12 = _co.singleSelectDropDownSettings; _ck(_v, 15, 0, currVal_11, currVal_12); var currVal_13 = "view-filter"; var currVal_14 = _co.view; _ck(_v, 17, 0, currVal_13, currVal_14); var currVal_15 = (_co.view.length > 0); _ck(_v, 21, 0, currVal_15); }, function (_ck, _v) { var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 15).defaultSettings.classes; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassUntouched; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassTouched; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassPristine; var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassDirty; var currVal_8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassValid; var currVal_9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassInvalid; var currVal_10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 19).ngClassPending; _ck(_v, 14, 0, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9, currVal_10); });
}
function View_DataEntryStatisticsFiltersComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-filters", [], null, null, null, View_DataEntryStatisticsFiltersComponent_0, RenderType_DataEntryStatisticsFiltersComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4440064, null, 0, _data_entry_statistics_filters_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsFiltersComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_9__["LocationResourceService"], _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_10__["ProviderResourceService"], _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_11__["UserService"], _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_12__["EncounterResourceService"], _angular_router__WEBPACK_IMPORTED_MODULE_13__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_13__["Router"], _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_14__["DataEntryStatisticsService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsFiltersComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-filters", _data_entry_statistics_filters_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsFiltersComponent"], View_DataEntryStatisticsFiltersComponent_Host_0, {}, { filterParams: "filterParams", viewSelected: "viewSelected", filterReset: "filterReset" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ts":
/*!****************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ts ***!
  \****************************************************************************************************************/
/*! exports provided: DataEntryStatisticsFiltersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsFiltersComponent", function() { return DataEntryStatisticsFiltersComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../openmrs-api/provider-resource.service */ "./src/app/openmrs-api/provider-resource.service.ts");
/* harmony import */ var _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../openmrs-api/user.service */ "./src/app/openmrs-api/user.service.ts");
/* harmony import */ var _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../openmrs-api/encounter-resource.service */ "./src/app/openmrs-api/encounter-resource.service.ts");
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");










var DataEntryStatisticsFiltersComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsFiltersComponent(_cd, _locationResourceService, _providerResourceService, _userService, _encounterResourceService, route, router, _dataEntryStatisticsService) {
        this._cd = _cd;
        this._locationResourceService = _locationResourceService;
        this._providerResourceService = _providerResourceService;
        this._userService = _userService;
        this._encounterResourceService = _encounterResourceService;
        this.route = route;
        this.router = router;
        this._dataEntryStatisticsService = _dataEntryStatisticsService;
        this.filterParams = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.viewSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.filterReset = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.sendRequest = true;
        this.today = moment__WEBPACK_IMPORTED_MODULE_4__().format();
        this.params = [];
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            pagination: true,
            paginationPageSize: 300
        };
        this.views = [];
        this.view = [];
        this.showFilters = true;
        this.locations = [];
        this.location = [];
        this.filtersCount = 0;
        this.locationMap = new Map();
        this.creator = [];
        this.encounterType = [];
        this.encounterTypes = [];
        this.encounterMap = new Map();
        this.providers = [];
        this.provider = '';
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__().format();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
        this.subType = '';
        this.groupBy = ['groupByLocationId', 'groupByDate', 'groupByEncounterTypeId'];
        this.selectedLocation = [];
        this.selectedCreatorUuid = [];
        this.selectedProviderUuid = '';
        this.selectedEncounterTypes = [];
        this.selectedView = {
            encounterTypePerDay: false,
            encounterTypePerMonth: false,
            encounterTypePerProvider: false,
            encounterTypePerCreator: false
        };
        this.selectedViewType = '';
        this.viewMap = new Map();
        this.locationDropdownSettings = {
            'singleSelection': false,
            'text': 'Select or enter to search',
            'selectAllText': 'Select All',
            'unSelectAllText': 'UnSelect All',
            'enableSearchFilter': true,
            'enableCheckAll': false
        };
        this.statsDropdownSettings = {
            singleSelection: true,
            text: 'Select or enter to search',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true
        };
        this.singleSelectDropDownSettings = {
            singleSelection: true,
            text: 'Select or enter to search',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: false
        };
        this.multpleSelectDropDownSettings = {
            singleSelection: false,
            text: 'Select or enter to search',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: false,
            badgeShowLimit: 10
        };
        this.dropdownSettings = {
            'singleSelection': false,
            'text': 'Select or enter to search',
            'selectAllText': 'Select All',
            'unSelectAllText': 'UnSelect All',
            'enableSearchFilter': true,
            'enableCheckAll': true
        };
        this.displayMsg = { 'show': false, 'message': '' };
        this.selectedStartMonth = moment__WEBPACK_IMPORTED_MODULE_4__().format('YYYY-MM');
        this.dataEntryCreatorColdef = [];
        this.creatorStats = [];
        this.filterCount = 0;
    }
    DataEntryStatisticsFiltersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadFilters();
        this.viewSelected.emit(this.selectedView);
        this.route
            .queryParams
            .subscribe(function (params) {
            if (params) {
                _this.params = params;
                setTimeout(function () {
                    _this.loadFilterFromUrlParams(params);
                }, 500);
            }
        }, function (error) {
            console.error('Error', error);
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.ngOnDestroy = function () { };
    DataEntryStatisticsFiltersComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsFiltersComponent.prototype.loadFilters = function () {
        this.getLocations();
        this.getDataEntryEncounterTypes();
        this.getEncounterTypes();
    };
    DataEntryStatisticsFiltersComponent.prototype.loadFilterFromUrlParams = function (params) {
        if (params.startDate && params.view) {
            var newParams = {
                'view': '',
                'locationUuids': [],
                'startDate': '',
                'endDate': '',
                'encounterTypeUuids': [],
                'providerUuid': [],
                'groupBy': []
            };
            if (params.view) {
                this.view = [];
                var views = this.loadFilterFromMap(params.view, this.viewMap);
                this.view = views;
                newParams.view = params.view;
                this.toggleSelectedView(params.view);
            }
            if (params.locationUuids) {
                this.location = [];
                var locations = this.loadFilterFromMap(params.locationUuids, this.locationMap);
                this.location = locations;
                newParams.locationUuids = params.locationUuids;
            }
            if (params.startDate) {
                this.selectedStartDate = params.startDate;
                newParams.startDate = params.startDate;
            }
            if (params.endDate) {
                this.selectedEndDate = params.endDate;
                newParams.endDate = params.endDate;
            }
            if (params.encounterTypeUuids) {
                this.encounterType = [];
                var encounterTypes = this.loadFilterFromMap(params.encounterTypeUuids, this.encounterMap);
                this.encounterType = encounterTypes;
                newParams.encounterTypeUuids = params.encounterTypeUuids;
            }
            if (params.groupBy) {
                newParams.groupBy = params.groupBy;
            }
            if (params.subType) {
                newParams.subType = params.subType;
                this.subType = params.subType;
            }
            if (params.providerUuid) {
                this.provider = '';
                this.selectedProviderUuid = '';
                this.providers = [];
                newParams.providerUuid = params.providerUuid;
                this.loadProvider(params.providerUuid);
            }
            if (params.creatorUuid) {
                this.creator = [];
                this.selectedCreatorUuid = [];
                this.creators = [];
                newParams.creatorUuid = params.creatorUuid;
                this.loadCreator(params.creatorUuid);
            }
            this.filterParams.emit(newParams);
        }
    };
    DataEntryStatisticsFiltersComponent.prototype.isString = function (value) {
        if (typeof value === 'string') {
            return true;
        }
        else {
            return false;
        }
    };
    DataEntryStatisticsFiltersComponent.prototype.loadFilterFromMap = function (values, map) {
        var filterArray = [];
        if (this.isString(values)) {
            var selectedType = map.get(values);
            filterArray.push(selectedType);
        }
        else {
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                var selectedType = map.get(value);
                filterArray.push(selectedType);
            }
        }
        return filterArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.loadProvider = function (providerUuid) {
        var _this = this;
        this._providerResourceService.getProviderByUuid(providerUuid).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (provider) {
            _this.provider = provider.display;
            _this.selectedProviderUuid = provider.uuid;
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.loadCreator = function (creatorUuids) {
        var _this = this;
        var isString = this.isString(creatorUuids);
        var creatorArray = [];
        if (!isString) {
            lodash__WEBPACK_IMPORTED_MODULE_3__["each"](creatorUuids, function (creatorUuid) {
                _this._userService.getUserByUuid(creatorUuid).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (result) {
                    var specificCreator = {
                        'id': result.uuid,
                        'itemName': result.person.display
                    };
                    creatorArray.push(specificCreator);
                });
            });
        }
        else {
            this._userService.getUserByUuid(creatorUuids).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (result) {
                var specificCreator = {
                    'id': result.uuid,
                    'itemName': result.person.display
                };
                creatorArray.push(specificCreator);
            });
        }
        this.creator = creatorArray;
        this.creators = creatorArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.getDataEntryEncounterTypes = function () {
        var _this = this;
        this._dataEntryStatisticsService
            .getDataEntryStatisticsTypes().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (result) {
            if (result) {
                var viewTypes = result;
                _this.processViewTypes(viewTypes);
            }
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.getLocations = function () {
        var _this = this;
        this._locationResourceService.getLocations().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (result) {
            var locations = result;
            _this.processLocations(locations);
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.creatorSelect = function ($event) {
        this.loadSelectedCreator();
    };
    DataEntryStatisticsFiltersComponent.prototype.creatorDeselect = function ($event) {
        this.loadSelectedCreator();
    };
    DataEntryStatisticsFiltersComponent.prototype.loadSelectedCreator = function () {
        var creatorArray = [];
        this.selectedCreatorUuid = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](this.creator, function (creator) {
            creatorArray.push(creator.id);
        });
        this.selectedCreatorUuid = creatorArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.processViewTypes = function (viewTypes) {
        var _this = this;
        var viewsArray = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](viewTypes, function (view) {
            var specificView = { id: view.id, itemName: view.subType };
            _this.viewMap.set(view.id, specificView);
            viewsArray.push(specificView);
        });
        this.views = viewsArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.processLocations = function (locations) {
        var _this = this;
        var locationArray = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](locations, function (location) {
            var specificLocation = { id: location.uuid, itemName: location.display };
            _this.locationMap.set(location.uuid, specificLocation);
            locationArray.push(specificLocation);
        });
        this.locations = locationArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.selectView = function ($event) {
        this.resetViews();
        var view = $event.id;
        this.toggleViewParams(view);
        this.selectedViewType = view;
        this.showFilters = true;
        this.filterReset.emit(true);
    };
    DataEntryStatisticsFiltersComponent.prototype.locationSelect = function ($event) {
        this.loadSelectedLocation();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetLocations = function () {
        this.location = [];
        this.loadSelectedLocation();
    };
    DataEntryStatisticsFiltersComponent.prototype.locationDeselect = function ($event) {
        this.loadSelectedLocation();
    };
    DataEntryStatisticsFiltersComponent.prototype.loadSelectedLocation = function () {
        var _this = this;
        var locationsArray = this.location;
        this.selectedLocation = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](locationsArray, function (locationItem) {
            _this.selectedLocation.push(locationItem.id);
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.getEncounterTypes = function () {
        var _this = this;
        this._encounterResourceService.getEncounterTypes('all').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (results) {
            if (results) {
                _this.processEncounterTypes(results);
            }
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.processEncounterTypes = function (encounterTypes) {
        var _this = this;
        var encounterTypesArray = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](encounterTypes, function (encounterType) {
            var specificEncounterType = {
                'id': encounterType.uuid,
                'itemName': encounterType.display
            };
            _this.encounterMap.set(encounterType.uuid, specificEncounterType);
            encounterTypesArray.push(specificEncounterType);
        });
        this.encounterTypes = encounterTypesArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.encounterTypeSelect = function ($event) {
        this.loadSelectedEncounterType();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetEncounterTypes = function () {
        this.encounterType = [];
        this.loadSelectedEncounterType();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetCreators = function () {
        this.creator = [];
        this.loadSelectedCreator();
    };
    DataEntryStatisticsFiltersComponent.prototype.encounterTypeDeselect = function ($event) {
        this.loadSelectedEncounterType();
    };
    DataEntryStatisticsFiltersComponent.prototype.loadSelectedEncounterType = function () {
        var _this = this;
        this.selectedEncounterTypes = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](this.encounterType, function (encounter) {
            _this.selectedEncounterTypes.push(encounter.id);
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.getSelectedStartDate = function ($event) {
        var selectedDate = $event;
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedDate).add(6, 'days').toISOString();
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedDate).toISOString();
    };
    DataEntryStatisticsFiltersComponent.prototype.getSelectedEndDate = function ($event) {
        var selectedDate = $event;
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedDate).toISOString();
    };
    DataEntryStatisticsFiltersComponent.prototype.getSelectedStartMonth = function ($event) {
        var selectedDate = moment__WEBPACK_IMPORTED_MODULE_4__($event).format('YYYY-MM-DD');
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedDate).startOf('month').toISOString();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(12, 'months').toISOString();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetViews = function () {
        this.selectedView = {
            encounterTypePerDay: false,
            encounterTypePerMonth: false,
            encounterTypePerProvider: false,
            encounterTypePerCreator: false
        };
    };
    DataEntryStatisticsFiltersComponent.prototype.toggleViewParams = function (view) {
        this.resetFilter();
        this.toggleSelectedView(view);
        switch (view) {
            case 'view1':
                this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__().format();
                this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
                this.subType = 'by-date-by-encounter-type';
                this.groupBy = ['groupByLocationId', 'groupByDate', 'groupByEncounterTypeId'];
                break;
            case 'view2':
                this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__().startOf('month').toISOString();
                this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(12, 'months').format();
                this.subType = 'by-month-by-encounter-type';
                this.groupBy = ['groupByLocationId', 'groupByMonth', 'groupByEncounterTypeId'];
                break;
            case 'view3':
                this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__().format();
                this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
                this.subType = 'by-provider-by-encounter-type';
                this.groupBy = ['groupByLocationId', 'groupByProviderId', 'groupByEncounterTypeId'];
                break;
            case 'view4':
                this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__().format();
                this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
                this.subType = 'by-creator-by-encounter-type';
                this.groupBy = ['groupByLocationId', 'groupByCreatorId', 'groupByEncounterTypeId'];
                break;
            default:
        }
    };
    DataEntryStatisticsFiltersComponent.prototype.toggleSelectedView = function (view) {
        this.resetViews();
        this.selectedViewType = view;
        switch (view) {
            case 'view1':
                this.selectedView.encounterTypePerDay = true;
                break;
            case 'view2':
                this.selectedView.encounterTypePerMonth = true;
                break;
            case 'view3':
                this.selectedView.encounterTypePerProvider = true;
                break;
            case 'view4':
                this.selectedView.encounterTypePerCreator = true;
                break;
            default:
        }
        this.viewSelected.emit(this.selectedView);
    };
    DataEntryStatisticsFiltersComponent.prototype.viewDeselect = function ($event) {
    };
    DataEntryStatisticsFiltersComponent.prototype.searchProvider = function (providerSearchTerm) {
        var _this = this;
        if (providerSearchTerm.length > 3) {
            this._providerResourceService
                .searchProvider(providerSearchTerm).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (results) {
                if (results) {
                    _this.processProviders(results);
                }
            });
        }
        if (providerSearchTerm.length === 0) {
            this.selectedProviderUuid = '';
        }
    };
    DataEntryStatisticsFiltersComponent.prototype.processProviders = function (providers) {
        var providersArray = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](providers, function (provider) {
            var providerPerson = provider.person;
            if (providerPerson !== null) {
                var specificProvider = {
                    'name': provider.display,
                    'uuid': provider.uuid
                };
                providersArray.push(specificProvider);
            }
        });
        this.providers = providersArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.selectProvider = function (provider) {
        this.provider = provider.name;
        this.selectedProviderUuid = provider.uuid;
        this.providers = [];
    };
    DataEntryStatisticsFiltersComponent.prototype.resetProvider = function () {
        this.provider = '';
        this.selectedProviderUuid = '';
        this.providers = [];
    };
    DataEntryStatisticsFiltersComponent.prototype.searchCreator = function (creatorSearchTerm) {
        var _this = this;
        this._userService
            .searchUsers(creatorSearchTerm).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (results) {
            if (results) {
                _this.processCreators(results);
            }
        });
    };
    DataEntryStatisticsFiltersComponent.prototype.processCreators = function (creators) {
        var creatorsArray = [];
        lodash__WEBPACK_IMPORTED_MODULE_3__["each"](creators, function (creator) {
            var providerPerson = creator.person;
            if (providerPerson !== null) {
                var specificCreator = {
                    'itemName': creator.person.display,
                    'id': creator.uuid
                };
                creatorsArray.push(specificCreator);
            }
        });
        this.creators = creatorsArray;
    };
    DataEntryStatisticsFiltersComponent.prototype.search = function () {
        this.sendRequest = true;
        this.setQueryParams();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetDisplayMsg = function () {
        this.displayMsg = { 'show': false, 'message': '' };
    };
    DataEntryStatisticsFiltersComponent.prototype.setQueryParams = function () {
        this.params = {
            'groupBy': this.groupBy,
            'locationUuids': this.selectedLocation,
            'creatorUuid': this.selectedCreatorUuid,
            'providerUuid': this.selectedProviderUuid,
            'encounterTypeUuids': this.selectedEncounterTypes,
            'startDate': moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).format(),
            'endDate': moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedEndDate).format(),
            'subType': this.subType,
            'view': this.selectedViewType
        };
        var currentParams = this.route.snapshot.queryParams;
        var navigationData = {
            queryParams: this.params,
            replaceUrl: true
        };
        var currentUrl = this.router.url;
        var routeUrl = currentUrl.split('?')[0];
        this.router.navigate([routeUrl], navigationData);
    };
    DataEntryStatisticsFiltersComponent.prototype.hideFilter = function () {
        this.showFilters = false;
    };
    DataEntryStatisticsFiltersComponent.prototype.showFilter = function () {
        this.showFilters = true;
    };
    DataEntryStatisticsFiltersComponent.prototype.previousWeek = function () {
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).subtract(7, 'days').format();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
        this.search();
    };
    DataEntryStatisticsFiltersComponent.prototype.nextWeek = function () {
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(7, 'days').format();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(6, 'days').format();
        this.search();
    };
    DataEntryStatisticsFiltersComponent.prototype.previousYear = function () {
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).subtract(12, 'months').format();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(11, 'months').format();
        this.search();
    };
    DataEntryStatisticsFiltersComponent.prototype.nextYear = function () {
        this.selectedStartDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(12, 'months').format();
        this.selectedEndDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.selectedStartDate).add(11, 'months').format();
        this.search();
    };
    DataEntryStatisticsFiltersComponent.prototype.resetFilter = function () {
        this.location = [];
        this.encounterType = [];
        this.creator = [];
        this.provider = '';
        this.selectedLocation = [];
        this.selectedCreatorUuid = [];
        this.selectedEncounterTypes = [];
        this.selectedProviderUuid = '';
    };
    DataEntryStatisticsFiltersComponent.prototype.resetAll = function () {
        this.resetFilter();
        this.view = [];
        this.sendRequest = false;
        // this.setQueryParams();
        this.filterReset.emit(true);
    };
    return DataEntryStatisticsFiltersComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.css.shim.ngstyle.js":
/*!********************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.css.shim.ngstyle.js ***!
  \********************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.ngfactory.js":
/*!*************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.ngfactory.js ***!
  \*************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsPatientListComponent, View_DataEntryStatisticsPatientListComponent_0, View_DataEntryStatisticsPatientListComponent_Host_0, DataEntryStatisticsPatientListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsPatientListComponent", function() { return RenderType_DataEntryStatisticsPatientListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsPatientListComponent_0", function() { return View_DataEntryStatisticsPatientListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsPatientListComponent_Host_0", function() { return View_DataEntryStatisticsPatientListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsPatientListComponentNgFactory", function() { return DataEntryStatisticsPatientListComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_patient_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-patient-list.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_entry_statistics_patient_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-patient-list.component */ "./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_patient_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_patient_list.component,_angular_router,_etl_api_data_entry_statistics_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_patient_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_patient_list.component,_angular_router,_etl_api_data_entry_statistics_resource.service PURE_IMPORTS_END */











var styles_DataEntryStatisticsPatientListComponent = [_data_entry_statistics_patient_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsPatientListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsPatientListComponent, data: {} });

function View_DataEntryStatisticsPatientListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.message; _ck(_v, 3, 0, currVal_0); }); }
function View_DataEntryStatisticsPatientListComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, ["From ", " to ", ""])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](2, 2), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](3, 2)], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 0, _ck(_v, 2, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.startDate, "dd-MMMM-yyyy")); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 1, _ck(_v, 3, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co.endDate, "dd-MMMM-yyyy")); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_DataEntryStatisticsPatientListComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 18, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsPatientListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 3, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 2, "button", [["class", "btn btn-primary"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.back() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 0, "i", [["class", "fa fa-angle-left fa-fw"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Back"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 10, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 3, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](11, null, ["", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsPatientListComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 0, "hr", [["class", "intro-divider"], ["width", "40%"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 450px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](18, 4898816, [["statsPatientList", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"], columnDefs: [2, "columnDefs"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](603979776, 1, { columns: 1 })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.busy; _ck(_v, 4, 0, currVal_0); var currVal_2 = ((_co.startDate !== "") && (_co.endDate !== "")); _ck(_v, 13, 0, currVal_2); var currVal_3 = _co.gridOptions; var currVal_4 = _co.rowData; var currVal_5 = _co.dataEntryPatientListColdef; _ck(_v, 18, 0, currVal_3, currVal_4, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.title; _ck(_v, 11, 0, currVal_1); });
}
function View_DataEntryStatisticsPatientListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-patient-list", [], null, null, null, View_DataEntryStatisticsPatientListComponent_0, RenderType_DataEntryStatisticsPatientListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4308992, null, 0, _data_entry_statistics_patient_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsPatientListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"], _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_10__["DataEntryStatisticsService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsPatientListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-patient-list", _data_entry_statistics_patient_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsPatientListComponent"], View_DataEntryStatisticsPatientListComponent_Host_0, { patientList: "patientList", startDate: "startDate", endDate: "endDate" }, {}, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics-patient-list.component.ts ***!
  \***************************************************************************************/
/*! exports provided: DataEntryStatisticsPatientListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsPatientListComponent", function() { return DataEntryStatisticsPatientListComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");






var DataEntryStatisticsPatientListComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsPatientListComponent(_cd, _router, _route, _location, _dataEntryStatisticsService) {
        var _this = this;
        this._cd = _cd;
        this._router = _router;
        this._route = _route;
        this._location = _location;
        this._dataEntryStatisticsService = _dataEntryStatisticsService;
        this.title = 'Patient List';
        this.busyIndicator = {
            busy: false,
            message: 'Please wait...' // default message
        };
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            pagination: true,
            paginationPageSize: 300,
            onGridSizeChanged: function () {
                if (_this.gridOptions.api) {
                    _this.gridOptions.api.sizeColumnsToFit();
                }
            },
            onGridReady: function () {
                if (_this.gridOptions.api) {
                    _this.gridOptions.api.sizeColumnsToFit();
                }
            }
        };
        this.rowData = [];
        this.patientList = [];
        this.startDate = '';
        this.endDate = '';
        this.dataEntryPatientListColdef = [
            {
                headerName: '#',
                field: 'patient_no'
            },
            {
                headerName: 'Identifiers',
                field: 'identifiers',
                onCellClicked: function (column) {
                    _this.redirectTopatientInfo(column.data.patient_uuid);
                },
                cellRenderer: function (column) {
                    return '<a href="javascript:void(0);" title="Identifiers">'
                        + column.value + '</a>';
                }
            },
            {
                headerName: 'Person Name',
                field: 'person_name'
            },
            {
                headerName: 'Gender',
                field: 'gender'
            },
            {
                headerName: 'Age',
                field: 'age'
            },
            {
                headerName: 'Location Name',
                field: 'location_name'
            }
        ];
    }
    DataEntryStatisticsPatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route
            .queryParams
            .subscribe(function (params) {
            if (params) {
                _this.getPatientList(params);
            }
        }, function (error) {
            console.error('Error', error);
        });
    };
    DataEntryStatisticsPatientListComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsPatientListComponent.prototype.processPatientList = function (patientList) {
        var patientArray = [];
        var patientCount = 1;
        lodash__WEBPACK_IMPORTED_MODULE_4__["each"](patientList, function (list) {
            var specificPatient = {
                'patient_no': patientCount,
                'identifiers': list.identifiers,
                'person_name': list.person_name,
                'gender': list.gender,
                'age': list.age,
                'location_name': list.location_name,
                'patient_uuid': list.patient_uuid
            };
            patientArray.push(specificPatient);
            patientCount++;
        });
        this.rowData = patientArray;
    };
    DataEntryStatisticsPatientListComponent.prototype.redirectTopatientInfo = function (patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this._router.navigate(['/patient-dashboard/patient/' + patientUuid +
                '/general/general/landing-page']);
    };
    DataEntryStatisticsPatientListComponent.prototype.getPatientList = function (params) {
        var _this = this;
        this.patientList = [];
        this.busyIndicator = {
            busy: true,
            message: 'Fetching patient list..please wait'
        };
        this._dataEntryStatisticsService.getDataEntrySatisticsPatientList(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (results) {
            if (results) {
                _this.processPatientList(results);
                _this.busyIndicator = {
                    busy: false,
                    message: ''
                };
            }
        });
    };
    DataEntryStatisticsPatientListComponent.prototype.back = function () {
        this._location.back();
    };
    return DataEntryStatisticsPatientListComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics.component.css.shim.ngstyle.js":
/*!*******************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics.component.css.shim.ngstyle.js ***!
  \*******************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = ["#view-filters[_ngcontent-%COMP%]{\n    border-style: solid;\n    border-color: #e5e5e5;\n    border-width: 1px;\n    margin-top: 10px;\n    padding: 10px 10px;\n}\n#action-btn-section[_ngcontent-%COMP%]{\n\n    padding: 10px 10px;\n\n}\n.loader[_ngcontent-%COMP%] {\n    position: absolute;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    text-align: center;\n    z-index: 9;\n    box-sizing: border-box;\n    background-color: #fff;\n    color: #fff;\n    opacity: .8;\n  }\n.loader[_ngcontent-%COMP%]   .fa[_ngcontent-%COMP%]:before {\n    margin-right: 12px;\n    display: inline-block;\n  }\n.loader[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    padding: 12px;\n    background-color: #0d6aad;\n    border-radius: 6px;\n    position: relative;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n    display: inline-block;\n  }\n.fa-spin[_ngcontent-%COMP%] {\n    width: 16px;\n    margin-right: 8px;\n  }\n.navigation-btn[_ngcontent-%COMP%]{\n    margin-top: 10px;\n  }"];



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics.component.ngfactory.js":
/*!************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics.component.ngfactory.js ***!
  \************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsComponent, View_DataEntryStatisticsComponent_0, View_DataEntryStatisticsComponent_Host_0, DataEntryStatisticsComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsComponent", function() { return RenderType_DataEntryStatisticsComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsComponent_0", function() { return View_DataEntryStatisticsComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsComponent_Host_0", function() { return View_DataEntryStatisticsComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsComponentNgFactory", function() { return DataEntryStatisticsComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/data-entry-statistics.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _data_entry_statistics_filters_data_entry_statistics_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data-entry-statistics-filters/data-entry-statistics-filters.component.ngfactory */ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ngfactory.js");
/* harmony import */ var _data_entry_statistics_filters_data_entry_statistics_filters_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data-entry-statistics-filters/data-entry-statistics-filters.component */ "./src/app/data-entry-statistics/data-entry-statistics-filters/data-entry-statistics-filters.component.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../openmrs-api/provider-resource.service */ "./src/app/openmrs-api/provider-resource.service.ts");
/* harmony import */ var _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../openmrs-api/user.service */ "./src/app/openmrs-api/user.service.ts");
/* harmony import */ var _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../openmrs-api/encounter-resource.service */ "./src/app/openmrs-api/encounter-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");
/* harmony import */ var _data_entry_statistics_encounters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./data-entry-statistics-encounters.component.ngfactory */ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ngfactory.js");
/* harmony import */ var _data_entry_statistics_encounters_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./data-entry-statistics-encounters.component */ "./src/app/data-entry-statistics/data-entry-statistics-encounters.component.ts");
/* harmony import */ var _data_entry_statistics_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./data-entry-statistics.component */ "./src/app/data-entry-statistics/data-entry-statistics.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics.component.css.shim.ngstyle,_angular_core,_angular_common,_data_entry_statistics_filters_data_entry_statistics_filters.component.ngfactory,_data_entry_statistics_filters_data_entry_statistics_filters.component,_openmrs_api_location_resource.service,_openmrs_api_provider_resource.service,_openmrs_api_user.service,_openmrs_api_encounter_resource.service,_angular_router,_etl_api_data_entry_statistics_resource.service,_data_entry_statistics_encounters.component.ngfactory,_data_entry_statistics_encounters.component,_data_entry_statistics.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics.component.css.shim.ngstyle,_angular_core,_angular_common,_data_entry_statistics_filters_data_entry_statistics_filters.component.ngfactory,_data_entry_statistics_filters_data_entry_statistics_filters.component,_openmrs_api_location_resource.service,_openmrs_api_provider_resource.service,_openmrs_api_user.service,_openmrs_api_encounter_resource.service,_angular_router,_etl_api_data_entry_statistics_resource.service,_data_entry_statistics_encounters.component.ngfactory,_data_entry_statistics_encounters.component,_data_entry_statistics.component PURE_IMPORTS_END */














var styles_DataEntryStatisticsComponent = [_data_entry_statistics_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsComponent, data: {} });

function View_DataEntryStatisticsComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.message; _ck(_v, 3, 0, currVal_0); }); }
function View_DataEntryStatisticsComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "button", [["class", "btn btn-primary navigation-btn"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.showEncounterList() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-angle-left"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Back to Entry Stats"]))], null, null);
}
function View_DataEntryStatisticsComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 16, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 9, "div", [["class", "row"], ["id", "view-filters"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 0, "span", [["class", "fa fa-bar-chart"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Data Entry Statistics"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 2, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 0, null, null, 1, "data-entry-statistics-filters", [], null, [[null, "filterParams"], [null, "viewSelected"], [null, "filterReset"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("filterParams" === en)) {
                var pd_0 = (_co.selectedFilterParams($event) !== false);
                ad = (pd_0 && ad);
            }
            if (("viewSelected" === en)) {
                var pd_1 = (_co.selectedView($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("filterReset" === en)) {
                var pd_2 = (_co.resetFilter($event) !== false);
                ad = (pd_2 && ad);
            }
            return ad;
        }, _data_entry_statistics_filters_data_entry_statistics_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_DataEntryStatisticsFiltersComponent_0"], _data_entry_statistics_filters_data_entry_statistics_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_DataEntryStatisticsFiltersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](10, 4440064, null, 0, _data_entry_statistics_filters_data_entry_statistics_filters_component__WEBPACK_IMPORTED_MODULE_4__["DataEntryStatisticsFiltersComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_5__["LocationResourceService"], _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_6__["ProviderResourceService"], _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_7__["UserService"], _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_8__["EncounterResourceService"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"], _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_10__["DataEntryStatisticsService"]], null, { filterParams: "filterParams", viewSelected: "viewSelected", filterReset: "filterReset" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](11, 0, null, null, 5, "div", [["class", "row"], ["id", "table-section"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 2, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 1, "data-entry-statistics-encounters", [], null, [[null, "patientListParams"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("patientListParams" === en)) {
                var pd_0 = (_co.encounterPatientList($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _data_entry_statistics_encounters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__["View_DataEntryStatisticsEncountersComponent_0"], _data_entry_statistics_encounters_component_ngfactory__WEBPACK_IMPORTED_MODULE_11__["RenderType_DataEntryStatisticsEncountersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 4833280, null, 0, _data_entry_statistics_encounters_component__WEBPACK_IMPORTED_MODULE_12__["DataEntryStatisticsEncountersComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { dataEntryEncounterData: [0, "dataEntryEncounterData"], params: [1, "params"] }, { patientListParams: "patientListParams" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.busy; _ck(_v, 3, 0, currVal_0); _ck(_v, 10, 0); var currVal_1 = _co.showPatientList; _ck(_v, 13, 0, currVal_1); var currVal_2 = _co.dataEntryEncounters; var currVal_3 = _co.params; _ck(_v, 16, 0, currVal_2, currVal_3); }, null);
}
function View_DataEntryStatisticsComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics", [], null, null, null, View_DataEntryStatisticsComponent_0, RenderType_DataEntryStatisticsComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4440064, null, 0, _data_entry_statistics_component__WEBPACK_IMPORTED_MODULE_13__["DataEntryStatisticsComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_10__["DataEntryStatisticsService"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics", _data_entry_statistics_component__WEBPACK_IMPORTED_MODULE_13__["DataEntryStatisticsComponent"], View_DataEntryStatisticsComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics.component.ts ***!
  \**************************************************************************/
/*! exports provided: DataEntryStatisticsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsComponent", function() { return DataEntryStatisticsComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _etl_api_data_entry_statistics_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../etl-api/data-entry-statistics-resource.service */ "./src/app/etl-api/data-entry-statistics-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");





var DataEntryStatisticsComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsComponent(_cd, _dataEntryStatisticsService, _router, _route) {
        this._cd = _cd;
        this._dataEntryStatisticsService = _dataEntryStatisticsService;
        this._router = _router;
        this._route = _route;
        this.busyIndicator = {
            busy: false,
            message: 'Please wait...' // default message
        };
        this.params = [];
        this.providerResult = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.showDataEntryStats = false;
        this.showPatientList = false;
        this.dataEntryEncounters = [];
        this.viewTypes = [];
        this.subType = [];
        this.view = [];
    }
    DataEntryStatisticsComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsComponent.prototype.ngOnDestroy = function () { };
    DataEntryStatisticsComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsComponent.prototype.selectedFilterParams = function ($event) {
        this.params = $event;
        this.getDataEntryStats();
    };
    DataEntryStatisticsComponent.prototype.selectedView = function ($event) {
        this.view = $event;
    };
    DataEntryStatisticsComponent.prototype.resetFilter = function ($event) {
        this.resetAllStats();
    };
    DataEntryStatisticsComponent.prototype.getDataEntryStats = function () {
        var _this = this;
        this.busyIndicator = {
            busy: true,
            message: 'Fetching data...please wait' // default message
        };
        this.showEncounterList();
        this._dataEntryStatisticsService.getDataEntryStatistics(this.params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (results) {
            if (results) {
                _this.dataEntryEncounters = results;
                _this.busyIndicator = {
                    busy: false,
                    message: ''
                };
            }
        });
    };
    DataEntryStatisticsComponent.prototype.resetAllStats = function () {
        this.dataEntryEncounters = [];
    };
    DataEntryStatisticsComponent.prototype.encounterPatientList = function ($event) {
        this.getEncounterPatientList($event);
    };
    // show data entry stats
    DataEntryStatisticsComponent.prototype.showEncounterList = function () {
        this.showDataEntryStats = true;
        this.showPatientList = false;
    };
    DataEntryStatisticsComponent.prototype.showPatientListData = function () {
        this.showDataEntryStats = false;
        this.showPatientList = true;
    };
    DataEntryStatisticsComponent.prototype.getEncounterPatientList = function (patientListParams) {
        this._router.navigate(['patient-list'], {
            relativeTo: this._route,
            queryParams: patientListParams
        });
    };
    return DataEntryStatisticsComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/data-entry-statistics.module.ts":
/*!***********************************************************************!*\
  !*** ./src/app/data-entry-statistics/data-entry-statistics.module.ts ***!
  \***********************************************************************/
/*! exports provided: DataEntryStatisticsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsModule", function() { return DataEntryStatisticsModule; });
var DataEntryStatisticsModule = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsModule() {
    }
    return DataEntryStatisticsModule;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.css.shim.ngstyle.js":
/*!*********************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.css.shim.ngstyle.js ***!
  \*********************************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ngfactory.js":
/*!**************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ngfactory.js ***!
  \**************************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsMonthlyListComponent, View_DataEntryStatisticsMonthlyListComponent_0, View_DataEntryStatisticsMonthlyListComponent_Host_0, DataEntryStatisticsMonthlyListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsMonthlyListComponent", function() { return RenderType_DataEntryStatisticsMonthlyListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsMonthlyListComponent_0", function() { return View_DataEntryStatisticsMonthlyListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsMonthlyListComponent_Host_0", function() { return View_DataEntryStatisticsMonthlyListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsMonthlyListComponentNgFactory", function() { return DataEntryStatisticsMonthlyListComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_monthly_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-monthly-list.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_entry_statistics_monthly_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-monthly-list.component */ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_monthly_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_monthly_list.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_monthly_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_monthly_list.component PURE_IMPORTS_END */









var styles_DataEntryStatisticsMonthlyListComponent = [_data_entry_statistics_monthly_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsMonthlyListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsMonthlyListComponent, data: {} });

function View_DataEntryStatisticsMonthlyListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, [" from (", " to ", ")"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](2, 2), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](3, 2)], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 0, _ck(_v, 2, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), ((_co.params == null) ? null : _co.params.startDate), "MMMM,yyyy")); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 1, _ck(_v, 3, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), ((_co.params == null) ? null : _co.params.endDate), "MMMM,yyyy")); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_DataEntryStatisticsMonthlyListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 18, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 10, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](5, null, ["", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsMonthlyListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 0, "hr", [["class", "intro-divider"], ["width", "40%"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 450px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 4898816, [["statsGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"], columnDefs: [2, "columnDefs"], pinnedBottomRowData: [3, "pinnedBottomRowData"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](603979776, 1, { columns: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 5, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](18, null, [" Total Encounters : ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 0, "p", [], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_1 = ((_co.params.startDate !== "") && (_co.params.endDate !== "")); _ck(_v, 7, 0, currVal_1); var currVal_2 = _co.gridOptions; var currVal_3 = _co.monthlyRowData; var currVal_4 = _co.dataEntryEncounterColdef; var currVal_5 = _co.pinnedBottomRowData; _ck(_v, 12, 0, currVal_2, currVal_3, currVal_4, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.title; _ck(_v, 5, 0, currVal_0); var currVal_6 = _co.totalMonthlyEncounters; _ck(_v, 18, 0, currVal_6); }); }
function View_DataEntryStatisticsMonthlyListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-monthly-list", [], null, null, null, View_DataEntryStatisticsMonthlyListComponent_0, RenderType_DataEntryStatisticsMonthlyListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _data_entry_statistics_monthly_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsMonthlyListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsMonthlyListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-monthly-list", _data_entry_statistics_monthly_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsMonthlyListComponent"], View_DataEntryStatisticsMonthlyListComponent_Host_0, { params: "params", dataEntryEncounters: "dataEntryEncounters" }, { patientListParams: "patientListParams" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/monthly-list/data-entry-statistics-monthly-list.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: DataEntryStatisticsMonthlyListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsMonthlyListComponent", function() { return DataEntryStatisticsMonthlyListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);



var DataEntryStatisticsMonthlyListComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsMonthlyListComponent(_cd) {
        this._cd = _cd;
        this.title = 'Encounters Per Type Per Month';
        this.pinnedBottomRowData = [];
        this.rowData = [];
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            pagination: true,
            paginationPageSize: 300
        };
        this.dataEntryEncounters = [];
        this.patientListParams = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.monthlyStats = [];
        this.dataEntryEncounterColdef = [];
        this.totalMonthlyEncounters = 0;
    }
    DataEntryStatisticsMonthlyListComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsMonthlyListComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsMonthlyListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.dataEntryEncounters && this.dataEntryEncounters.length > 0) {
            this.procesMonthlyData();
        }
        else {
            this.monthlyRowData = [];
        }
    };
    DataEntryStatisticsMonthlyListComponent.prototype.procesMonthlyData = function () {
        var _this = this;
        var trackColumns = [];
        var dataEntryEncounters = this.dataEntryEncounters;
        var encounterMap = new Map();
        this.dataEntryEncounterColdef = [];
        this.pinnedBottomRowData = [];
        this.dataEntryEncounterColdef.push({
            headerName: 'Location',
            field: 'location',
            // pinned: 'left',
            rowGroup: true,
            hide: true
        }, {
            headerName: 'Encounter Types',
            field: 'encounter_type',
        }, {
            headerName: 'Total',
            field: 'rowTotals',
            onCellClicked: function (column) {
                var patientListParams = {
                    'providerUuid': _this.params.providerUuid,
                    'locationUuids': column.data.locationUuid,
                    'encounterTypeUuids': column.data.encounterTypeUuid,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined') {
                    return ' ';
                }
                else {
                    return '<a href="javascript:void(0);" title="providercount">'
                        + column.value + '</a>';
                }
            }
        });
        this.gridOptions.groupDefaultExpanded = -1;
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](dataEntryEncounters, function (stat) {
            var month = stat.month;
            var monthStart = moment__WEBPACK_IMPORTED_MODULE_2__(month).startOf('month').format('YYYY-MM-DD');
            var monthEnd = moment__WEBPACK_IMPORTED_MODULE_2__(month).endOf('month').format('YYYY-MM-DD');
            if (lodash__WEBPACK_IMPORTED_MODULE_1__["includes"](trackColumns, month) === false) {
                _this.dataEntryEncounterColdef.push({
                    headerName: month,
                    field: month,
                    onCellClicked: function (column) {
                        var patientListParams = {
                            'startDate': monthStart,
                            'encounterTypeUuids': column.data.encounterTypeUuid,
                            'locationUuids': column.data.locationUuid,
                            'providerUuid': _this.params.providerUuid,
                            'endDate': monthEnd
                        };
                        _this.patientListParams.emit(patientListParams);
                    },
                    cellRenderer: function (column) {
                        if (typeof column.value === 'undefined') {
                            return ' ';
                        }
                        else {
                            return '<a href="javascript:void(0);" title="Identifiers">'
                                + column.value + '</a>';
                        }
                    }
                });
                trackColumns.push(month);
            }
            var monthlyObj = {
                'location': stat.location,
                'locationUuid': stat.locationUuid,
                'encounterTypes': []
            };
            var e = {
                'encounterTypeUuid': stat.encounter_type_uuid,
                'encounterName': stat.encounter_type,
                'encounterCounts': [
                    {
                        'encounterMonth': stat.month,
                        'encounterCount': stat.encounters_count
                    }
                ]
            };
            var savedEncounter = encounterMap.get(stat.location);
            if (typeof savedEncounter !== 'undefined') {
                var savedEncounterTypes = savedEncounter.encounterTypes;
                var savedSpecificEncounter = savedEncounterTypes[stat.encounter_type];
                if (typeof savedSpecificEncounter !== 'undefined') {
                    savedEncounter.encounterTypes[stat.encounter_type].encounterCounts.push({
                        'encounterMonth': stat.month,
                        'encounterCount': stat.encounters_count
                    });
                }
                else {
                    savedEncounter.encounterTypes[stat.encounter_type] = e;
                }
                encounterMap.set(stat.location, savedEncounter);
            }
            else {
                monthlyObj.encounterTypes[stat.encounter_type] = e;
                encounterMap.set(stat.location, monthlyObj);
            }
        });
        this.processMonthlyRows(encounterMap);
    };
    DataEntryStatisticsMonthlyListComponent.prototype.processMonthlyRows = function (encounterMap) {
        var allRows = [];
        var totalEncounters = 0;
        encounterMap.forEach(function (encounterItem, encounterIndex) {
            var locationName = encounterItem.location;
            var locationUuid = encounterItem.locationUuid;
            var encounterTypes = encounterItem.encounterTypes;
            Object.keys(encounterTypes).forEach(function (key) {
                var encounterRow = {
                    'rowTotals': 0
                };
                encounterRow['location'] = locationName;
                encounterRow['locationUuid'] = locationUuid;
                encounterRow['encounter_type'] = key;
                encounterRow['encounterTypeUuid'] = encounterTypes[key].encounterTypeUuid;
                var encounterType = encounterTypes[key];
                var encounterCounts = encounterType.encounterCounts;
                var rowTotal = 0;
                lodash__WEBPACK_IMPORTED_MODULE_1__["each"](encounterCounts, function (encounterCount) {
                    encounterRow[encounterCount.encounterMonth] = encounterCount.encounterCount;
                    rowTotal += encounterCount.encounterCount;
                });
                encounterRow['rowTotals'] = rowTotal;
                totalEncounters += rowTotal;
                allRows.push(encounterRow);
            });
        });
        this.totalMonthlyEncounters = totalEncounters;
        this.monthlyRowData = allRows;
        this.setPinnedRow();
    };
    DataEntryStatisticsMonthlyListComponent.prototype.createTotalsRow = function (totalsMap, totalEncounters) {
        var rowTotalObj = {
            'encounterUuid': '',
            'encounterType': 'Total',
            'rowTotals': totalEncounters
        };
        totalsMap.forEach(function (monthTotal, index) {
            rowTotalObj[index] = monthTotal;
        });
        return rowTotalObj;
    };
    DataEntryStatisticsMonthlyListComponent.prototype.setPinnedRow = function () {
        if (this.gridOptions.api) {
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
        return true;
    };
    return DataEntryStatisticsMonthlyListComponent;
}());



/***/ }),

/***/ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.css.shim.ngstyle.js":
/*!*************************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.css.shim.ngstyle.js ***!
  \*************************************************************************************************************************/
/*! exports provided: styles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var styles = [""];



/***/ }),

/***/ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ngfactory.js":
/*!******************************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ngfactory.js ***!
  \******************************************************************************************************************/
/*! exports provided: RenderType_DataEntryStatisticsProviderListComponent, View_DataEntryStatisticsProviderListComponent_0, View_DataEntryStatisticsProviderListComponent_Host_0, DataEntryStatisticsProviderListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_DataEntryStatisticsProviderListComponent", function() { return RenderType_DataEntryStatisticsProviderListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsProviderListComponent_0", function() { return View_DataEntryStatisticsProviderListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_DataEntryStatisticsProviderListComponent_Host_0", function() { return View_DataEntryStatisticsProviderListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsProviderListComponentNgFactory", function() { return DataEntryStatisticsProviderListComponentNgFactory; });
/* harmony import */ var _data_entry_statistics_providers_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-entry-statistics-providers-list.component.css.shim.ngstyle */ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_entry_statistics_providers_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-entry-statistics-providers-list.component */ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _data_entry_statistics_providers_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_providers_list.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _data_entry_statistics_providers_list.component.css.shim.ngstyle,_angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_data_entry_statistics_providers_list.component PURE_IMPORTS_END */









var styles_DataEntryStatisticsProviderListComponent = [_data_entry_statistics_providers_list_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_DataEntryStatisticsProviderListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_DataEntryStatisticsProviderListComponent, data: {} });

function View_DataEntryStatisticsProviderListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](1, null, ["From ", " to ", " "])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](2, 2), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](3, 2)], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 0, _ck(_v, 2, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), ((_co.params == null) ? null : _co.params.startDate), "dd-MMMM-yyyy")); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 1, 1, _ck(_v, 3, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), ((_co.params == null) ? null : _co.params.endDate), "dd-MMMM-yyyy")); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_DataEntryStatisticsProviderListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["LOCALE_ID"]]), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 18, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 10, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 3, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](5, null, ["", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_DataEntryStatisticsProviderListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 0, "hr", [["class", "intro-divider"], ["width", "40%"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](9, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 450px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_5__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 4898816, [["statsGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_7__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_6__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"], columnDefs: [2, "columnDefs"], pinnedBottomRowData: [3, "pinnedBottomRowData"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](603979776, 1, { columns: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](14, 0, null, null, 5, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](16, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](18, null, [" Total Provider Encounters : ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](19, 0, null, null, 0, "p", [], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_1 = ((_co.params.startDate !== "") && (_co.params.endDate !== "")); _ck(_v, 7, 0, currVal_1); var currVal_2 = _co.gridOptions; var currVal_3 = _co.providerRowData; var currVal_4 = _co.dataEntryEncounterColdef; var currVal_5 = _co.pinnedBottomRowData; _ck(_v, 12, 0, currVal_2, currVal_3, currVal_4, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.title; _ck(_v, 5, 0, currVal_0); var currVal_6 = _co.totalProviderEncounters; _ck(_v, 18, 0, currVal_6); }); }
function View_DataEntryStatisticsProviderListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "data-entry-statistics-provider-list", [], null, null, null, View_DataEntryStatisticsProviderListComponent_0, RenderType_DataEntryStatisticsProviderListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 4833280, null, 0, _data_entry_statistics_providers_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsProviderListComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var DataEntryStatisticsProviderListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("data-entry-statistics-provider-list", _data_entry_statistics_providers_list_component__WEBPACK_IMPORTED_MODULE_8__["DataEntryStatisticsProviderListComponent"], View_DataEntryStatisticsProviderListComponent_Host_0, { dataEntryEncounters: "dataEntryEncounters", params: "params" }, { patientListParams: "patientListParams" }, []);



/***/ }),

/***/ "./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ts":
/*!********************************************************************************************************!*\
  !*** ./src/app/data-entry-statistics/providers-list/data-entry-statistics-providers-list.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: DataEntryStatisticsProviderListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsProviderListComponent", function() { return DataEntryStatisticsProviderListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


var DataEntryStatisticsProviderListComponent = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsProviderListComponent(_cd) {
        this._cd = _cd;
        this.title = 'Encounters Per Type Per Provider';
        this.totalProviderEncounters = 0;
        this.pinnedBottomRowData = [];
        this.allClicalEncounters = [];
        this.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            showToolPanel: false,
            pagination: true,
            paginationPageSize: 300,
            onGridReady: function () {
            }
        };
        this.dataEntryEncounters = [];
        this.patientListParams = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.dataEntryEncounterColdef = [];
        this.providerStats = [];
    }
    DataEntryStatisticsProviderListComponent.prototype.ngOnInit = function () {
    };
    DataEntryStatisticsProviderListComponent.prototype.ngAfterViewInit = function () {
        this._cd.detectChanges();
    };
    DataEntryStatisticsProviderListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.dataEntryEncounters && this.dataEntryEncounters.length > 0) {
            this.processProviderData();
        }
        else {
            this.providerRowData = [];
        }
    };
    DataEntryStatisticsProviderListComponent.prototype.processProviderData = function () {
        var _this = this;
        var trackColumns = [];
        var dataEntryStats = this.dataEntryEncounters;
        this.dataEntryEncounterColdef = [];
        this.pinnedBottomRowData = [];
        this.dataEntryEncounterColdef.push({
            headerName: 'Location',
            field: 'location',
            // pinned: 'left',
            rowGroup: true,
            hide: true
        }, {
            headerName: 'Provider',
            field: 'providers'
        }, {
            headerName: 'providerUuid',
            field: 'providerUuid',
            hide: true
        }, {
            headerName: 'Total',
            field: 'total',
            onCellClicked: function (column) {
                var patientListParams = {
                    'providerUuid': column.data.providerUuid,
                    'locationUuids': column.data.locationUuid,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined' || column.value === 0) {
                    return '';
                }
                else {
                    return '<a href="javascript:void(0);" title="Total Encounters">'
                        + column.value + '</a>';
                }
            }
        }, {
            headerName: 'Total Clinical Encounters',
            field: 'total_clinical',
            onCellClicked: function (column) {
                var patientListParams = {
                    'providerUuid': column.data.providerUuid,
                    'locationUuids': _this.params.locationUuids,
                    'encounterTypeUuids': column.data.clinicalEncounters,
                    'startDate': _this.params.startDate,
                    'endDate': _this.params.endDate
                };
                _this.patientListParams.emit(patientListParams);
            },
            cellRenderer: function (column) {
                if (typeof column.value === 'undefined' || column.value === 0) {
                    return '';
                }
                else {
                    return '<a href="javascript:void(0);" title="Total Clinical Encounters">'
                        + column.value + '</a>';
                }
            }
        });
        this.gridOptions.groupDefaultExpanded = -1;
        var providerMap = new Map();
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](dataEntryStats, function (stat) {
            var formId = stat.encounter_type_id;
            var providerId = stat.provider_id;
            var encounterTypeUuid = stat.encounter_type_uuid;
            if (lodash__WEBPACK_IMPORTED_MODULE_1__["includes"](trackColumns, formId) === false) {
                _this.dataEntryEncounterColdef.push({
                    headerName: stat.encounter_type,
                    field: stat.encounter_type,
                    onCellClicked: function (column) {
                        var patientListParams = {
                            'providerUuid': column.data.providerUuid,
                            'encounterTypeUuids': encounterTypeUuid,
                            'locationUuids': column.data.locationUuid,
                            'startDate': _this.params.startDate,
                            'endDate': _this.params.endDate
                        };
                        _this.patientListParams.emit(patientListParams);
                    },
                    cellRenderer: function (column) {
                        if (typeof column.value === 'undefined') {
                            return '';
                        }
                        else {
                            return '<a href="javascript:void(0);" title="providercount">'
                                + column.value + '</a>';
                        }
                    }
                });
                trackColumns.push(formId);
            }
            var providerObj = {
                'encounters': [
                    {
                        'encounterUuid': stat.encounter_type_uuid,
                        'encounter_type': stat.encounter_type,
                        'encounters_count': stat.encounters_count,
                        'is_clinical': stat.is_clinical_encounter
                    }
                ],
                'providerName': stat.provider_name,
                'providerUuid': stat.provider_uuid,
                'location': stat.location,
                'locationUuid': stat.location_uuid
            };
            var providerSaved = providerMap.get(providerId);
            if (typeof providerSaved !== 'undefined') {
                providerSaved.encounters.push({
                    'encounterUuid': stat.encounter_type_uuid,
                    'encounter_type': stat.encounter_type,
                    'encounters_count': stat.encounters_count,
                    'is_clinical': stat.is_clinical_encounter,
                    'location': stat.location,
                    'locationUuid': stat.location_uuid
                });
            }
            else {
                providerMap.set(providerId, providerObj);
            }
        });
        this.generateProviderRowData(providerMap);
    };
    DataEntryStatisticsProviderListComponent.prototype.generateProviderRowData = function (providerMap) {
        var _this = this;
        var rowArray = [];
        var colSumMap = new Map();
        var totalProvidersEncounters = 0;
        var totalProviderClinicalEncounters = 0;
        this.allClicalEncounters = [];
        providerMap.forEach(function (providerItem) {
            var forms = providerItem.encounters;
            var totalEncounters = 0;
            var totalClinical = 0;
            var specificProvider = {
                providers: providerItem.providerName,
                location: providerItem.location,
                locationUuid: providerItem.locationUuid,
                providerUuid: providerItem.providerUuid,
                clinicalEncounters: []
            };
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](forms, function (form) {
                specificProvider[form.encounter_type] = form.encounters_count;
                totalEncounters += form.encounters_count;
                if (form.is_clinical === 1) {
                    totalClinical += form.encounters_count;
                    specificProvider.clinicalEncounters.push(form.encounterUuid);
                    _this.allClicalEncounters.push(form.encounterUuid);
                }
                var colTotal = colSumMap.get(form.encounter_type);
                if (typeof colTotal === 'undefined') {
                    colSumMap.set(form.encounter_type, form.encounters_count);
                }
                else {
                    var newTotal = colTotal + form.encounters_count;
                    colSumMap.set(form.encounter_type, newTotal);
                }
            });
            specificProvider.total = totalEncounters;
            specificProvider.total_clinical = totalClinical;
            totalProvidersEncounters += totalEncounters;
            totalProviderClinicalEncounters += totalClinical;
            rowArray.push(specificProvider);
        });
        var totalRow = this.createTotalsRow(colSumMap, totalProvidersEncounters, totalProviderClinicalEncounters);
        var totalRowArray = [];
        totalRowArray.push(totalRow);
        this.totalProviderEncounters = totalProvidersEncounters;
        this.providerRowData = rowArray;
        this.pinnedBottomRowData = totalRowArray;
        this.setPinnedRow();
    };
    DataEntryStatisticsProviderListComponent.prototype.createTotalsRow = function (totalsMap, totalProvidersEncounters, totalProviderClinicalEncounters) {
        var rowTotalObj = {
            'providers': 'Total',
            'providerUuid': this.params.providerUuid,
            'total': totalProvidersEncounters,
            'total_clinical': totalProviderClinicalEncounters,
            'clinicalEncounters': lodash__WEBPACK_IMPORTED_MODULE_1__["uniq"](this.allClicalEncounters),
            'locationUuid': this.params.locationUuids,
        };
        totalsMap.forEach(function (monthTotal, index) {
            rowTotalObj[index] = monthTotal;
        });
        return rowTotalObj;
    };
    DataEntryStatisticsProviderListComponent.prototype.setPinnedRow = function () {
        if (this.gridOptions.api) {
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
        return true;
    };
    return DataEntryStatisticsProviderListComponent;
}());



/***/ }),

/***/ "./src/app/etl-api/data-entry-statistics-resource.service.ts":
/*!*******************************************************************!*\
  !*** ./src/app/etl-api/data-entry-statistics-resource.service.ts ***!
  \*******************************************************************/
/*! exports provided: DataEntryStatisticsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataEntryStatisticsService", function() { return DataEntryStatisticsService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_settings_app_settings_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app-settings/app-settings.service */ "./src/app/app-settings/app-settings.service.ts");
/* harmony import */ var _shared_services_data_cache_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/services/data-cache.service */ "./src/app/shared/services/data-cache.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");





var DataEntryStatisticsService = /** @class */ /*@__PURE__*/ (function () {
    function DataEntryStatisticsService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    DataEntryStatisticsService.prototype.getBaseUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim();
    };
    DataEntryStatisticsService.prototype.getDataEntryStatisticsTypes = function () {
        var dataStatisticsTypes = [{
                id: 'view1',
                subType: 'Encounter Types Per Day'
            }, {
                id: 'view2',
                subType: 'Encounters Types Per Month'
            }, {
                id: 'view3',
                subType: 'Encounters Types Per Provider'
            }, {
                id: 'view4',
                subType: 'Encounters Types Per Creator'
            }];
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(dataStatisticsTypes);
    };
    DataEntryStatisticsService.prototype.getDataEntryStatistics = function (payload) {
        if (payload && payload.subType && payload.startDate && payload.endDate && payload.groupBy) {
            var baseUrl = this.getBaseUrl();
            var params = this.getDataEntryStatisticsQueryParam(payload);
            var dataEntryStatsUrl = 'data-entry-statistics/' + params.subType;
            var url = baseUrl + dataEntryStatsUrl;
            var urlParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpParams"]()
                .set('startDate', params.startDate)
                .set('endDate', params.endDate)
                .set('groupBy', params.groupBy);
            if (params.locationUuids) {
                urlParams = urlParams.set('locationUuids', params.locationUuids);
            }
            if (params.encounterTypeUuids) {
                urlParams = urlParams.set('encounterTypeUuids', params.encounterTypeUuids);
            }
            if (params.providerUuid) {
                urlParams = urlParams.set('providerUuid', params.providerUuid);
            }
            if (params.creatorUuid) {
                urlParams = urlParams.set('creatorUuid', params.creatorUuid);
            }
            var request = this.http.get(url, { params: urlParams }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) {
                return response.result;
            }));
            return this.cacheService.cacheRequest(url, urlParams, request);
        }
        else {
            console.log('Error getting params');
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])({ error: 'Request must contain subtype,startDate,endDate and groupBy' });
        }
    };
    DataEntryStatisticsService.prototype.getDataEntryStatisticsQueryParam = function (payload) {
        var subType = '';
        var startDate = '';
        var endDate = '';
        var groupBy = '';
        if (payload.subType) {
            subType = payload.subType;
        }
        if (payload.startDate) {
            startDate = payload.startDate;
        }
        if (payload.endDate) {
            endDate = payload.endDate;
        }
        if (payload.groupBy) {
            groupBy = payload.groupBy;
        }
        var param = {
            subType: subType,
            startDate: startDate,
            endDate: endDate,
            groupBy: groupBy
        };
        // set-up the param object
        if (payload.locationUuids && payload.locationUuids.length > 0) {
            param.locationUuids = payload.locationUuids;
        }
        if (payload.encounterTypeUuids && payload.encounterTypeUuids.length > 0) {
            param.encounterTypeUuids = payload.encounterTypeUuids;
        }
        if (payload.formUuids && payload.formUuids.length > 0) {
            param.formUuids = payload.formUuids;
        }
        if (payload.providerUuid && payload.providerUuid.length > 0) {
            param.providerUuid = payload.providerUuid;
        }
        if (payload.creatorUuid && payload.creatorUuid.length > 0) {
            param.creatorUuid = payload.creatorUuid;
        }
        return param;
    };
    DataEntryStatisticsService.prototype.getDataEntrySatisticsPatientList = function (params) {
        var baseUrl = this.getBaseUrl();
        var dataEntryStatsPatientListUrl = 'data-entry-statistics/patientList';
        var url = baseUrl + dataEntryStatsPatientListUrl;
        var urlParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpParams"]()
            .set('startDate', params.startDate)
            .set('endDate', params.endDate)
            .set('groupBy', 'groupByLocationId,groupByPatientId');
        if (params.encounterTypeUuids && params.encounterTypeUuids.length > 0) {
            urlParams = urlParams.set('encounterTypeUuids', params.encounterTypeUuids);
        }
        if (params.providerUuid && params.providerUuid.length > 0) {
            urlParams = urlParams.set('providerUuid', params.providerUuid);
        }
        if (params.creatorUuid && params.creatorUuid.length > 0) {
            urlParams = urlParams.set('creatorUuid', params.creatorUuid);
        }
        if (params.locationUuids && params.locationUuids.length > 0) {
            urlParams = urlParams.set('locationUuids', params.locationUuids);
        }
        var request = this.http.get(url, { params: urlParams }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) {
            return response.result;
        }));
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    return DataEntryStatisticsService;
}());



/***/ }),

/***/ "./src/app/etl-api/hiv-clinic-flow-resource.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/etl-api/hiv-clinic-flow-resource.service.ts ***!
  \*************************************************************/
/*! exports provided: HivClinicFlowResourceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivClinicFlowResourceService", function() { return HivClinicFlowResourceService; });
/* harmony import */ var _app_settings_app_settings_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-settings/app-settings.service */ "./src/app/app-settings/app-settings.service.ts");
/* harmony import */ var _shared_services_data_cache_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/services/data-cache.service */ "./src/app/shared/services/data-cache.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");




var HivClinicFlowResourceService = /** @class */ /*@__PURE__*/ (function () {
    function HivClinicFlowResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
        this.result = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.requestUrl = '';
    }
    HivClinicFlowResourceService.prototype.getUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    };
    HivClinicFlowResourceService.prototype.getClinicFlow = function (dateStarted, locations) {
        var urlParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpParams"]()
            .set('dateStarted', dateStarted)
            .set('locationUuids', locations);
        var url = this.getUrl('patient-flow-data');
        var request = this.http.get(url, {
            params: urlParams
        });
        var key = url + '?' + urlParams.toString();
        /** This is a workaround to avoid multiple calls to server by the respective
         * clinic flow components
         */
        if (key !== this.requestUrl) {
            // clear cache after 1 minute
            var refreshCacheTime = 1 * 60 * 1000;
            this.requestUrl = key;
            this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
        }
        return this.cache;
    };
    return HivClinicFlowResourceService;
}());



/***/ })

}]);