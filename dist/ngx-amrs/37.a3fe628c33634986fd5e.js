(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[37],{

/***/ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component.ts ***!
  \******************************************************************************************/
/*! exports provided: HivSummaryIndicatorBaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryIndicatorBaseComponent", function() { return HivSummaryIndicatorBaseComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../etl-api/hiv-summary-indicators-resource.service */ "./src/app/etl-api/hiv-summary-indicators-resource.service.ts");
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");





/*import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics.service';*/
var HivSummaryIndicatorBaseComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivSummaryIndicatorBaseComponent(hivSummaryIndicatorsResourceService, dataAnalyticsDashboardService) {
        this.hivSummaryIndicatorsResourceService = hivSummaryIndicatorsResourceService;
        this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        this.data = [];
        this.sectionsDef = [];
        this.startAge = 0;
        this.endAge = 120;
        this.selectedIndicators = [];
        this.selectedGender = [];
        this.enabledControls = 'indicatorsControl,datesControl,' +
            'ageControl,genderControl,locationControl';
        this.isLoadingReport = false;
        this.encounteredError = false;
        this.errorMessage = '';
        this.currentView = 'tabular'; // can be pdf or tabular or patientList
        this.reportName = 'hiv-summary-report';
        this._startDate = moment__WEBPACK_IMPORTED_MODULE_2__().subtract(1, 'months').toDate();
        this._endDate = new Date();
    }
    Object.defineProperty(HivSummaryIndicatorBaseComponent.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (v) {
            this._startDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryIndicatorBaseComponent.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (v) {
            this._endDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryIndicatorBaseComponent.prototype, "locationUuids", {
        get: function () {
            return this._locationUuids;
        },
        set: function (v) {
            this._locationUuids = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryIndicatorBaseComponent.prototype, "gender", {
        get: function () {
            return this._gender;
        },
        set: function (v) {
            this._gender = v;
        },
        enumerable: true,
        configurable: true
    });
    HivSummaryIndicatorBaseComponent.prototype.ngOnInit = function () { };
    HivSummaryIndicatorBaseComponent.prototype.generateReport = function () {
        var _this = this;
        // set busy indications variables
        // clear error
        this.dates = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        this.age = {
            startAge: this.startAge,
            endAge: this.endAge
        };
        var uuids = this.getSelectedLocations(this.locationUuids);
        if (!this.indicators || this.indicators === undefined) {
            this.isLoadingReport = false;
            this.encounteredError = true;
            this.errorMessage = 'Please select Indicator(s) to generate data!';
        }
        else if (!uuids) {
            this.isLoadingReport = false;
            this.encounteredError = true;
            this.errorMessage = 'Please select Location(s) to generate data!';
        }
        else {
            this.encounteredError = false;
            this.errorMessage = '';
            this.isLoadingReport = true;
            var params = {
                endDate: this.toDateString(this.endDate),
                gender: this.gender ? this.gender : 'F,M',
                startDate: this.toDateString(this.startDate),
                indicators: this.indicators,
                locationUuids: uuids,
                startAge: this.startAge,
                endAge: this.endAge
            };
            this.hivSummaryIndicatorsResourceService
                .getHivSummaryIndicatorsReport(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (data) {
                _this.isLoadingReport = false;
                _this.sectionsDef = data.indicatorDefinitions;
                _this.data = data.result;
            }, function (error) {
                _this.isLoadingReport = false;
                _this.errorMessage = error;
                _this.encounteredError = true;
            });
        }
    };
    HivSummaryIndicatorBaseComponent.prototype.onAgeChangeFinished = function ($event) {
        this.startAge = $event.ageFrom;
        this.endAge = $event.ageTo;
    };
    HivSummaryIndicatorBaseComponent.prototype.getSelectedGender = function (selectedGender) {
        var gender;
        if (selectedGender) {
            for (var i = 0; i < selectedGender.length; i++) {
                if (i === 0) {
                    gender = '' + selectedGender[i].value;
                }
                else {
                    gender = gender + ',' + selectedGender[i].value;
                }
            }
        }
        return this.gender = gender;
    };
    HivSummaryIndicatorBaseComponent.prototype.getSelectedIndicators = function (selectedIndicator) {
        var indicators;
        if (selectedIndicator) {
            for (var i = 0; i < selectedIndicator.length; i++) {
                if (i === 0) {
                    indicators = '' + selectedIndicator[i].value;
                }
                else {
                    indicators = indicators + ',' + selectedIndicator[i].value;
                }
            }
        }
        return this.indicators = indicators;
    };
    HivSummaryIndicatorBaseComponent.prototype.onTabChanged = function (event) {
        if (event.index === 0) {
            this.currentView = 'tabular';
        }
    };
    HivSummaryIndicatorBaseComponent.prototype.getSelectedLocations = function (locationUuids) {
        if (!locationUuids || locationUuids.length === 0) {
            return '';
        }
        var selectedLocations = '';
        for (var i = 0; i < locationUuids.length; i++) {
            if (i === 0) {
                selectedLocations = selectedLocations + locationUuids[0].value;
            }
            else {
                selectedLocations = selectedLocations + ',' + locationUuids[i].value;
            }
        }
        return selectedLocations;
    };
    HivSummaryIndicatorBaseComponent.prototype.toDateString = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_2__(date).utcOffset('+03:00').format();
    };
    return HivSummaryIndicatorBaseComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ngfactory.js":
/*!************************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ngfactory.js ***!
  \************************************************************************************************/
/*! exports provided: RenderType_HivSummaryTabularComponent, View_HivSummaryTabularComponent_0, View_HivSummaryTabularComponent_Host_0, HivSummaryTabularComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivSummaryTabularComponent", function() { return RenderType_HivSummaryTabularComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryTabularComponent_0", function() { return View_HivSummaryTabularComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryTabularComponent_Host_0", function() { return View_HivSummaryTabularComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryTabularComponentNgFactory", function() { return HivSummaryTabularComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _hiv_summary_tabular_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hiv-summary-tabular.component */ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_hiv_summary_tabular.component,_angular_router PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_hiv_summary_tabular.component,_angular_router PURE_IMPORTS_END */








var styles_HivSummaryTabularComponent = [];
var RenderType_HivSummaryTabularComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivSummaryTabularComponent, data: {} });

function View_HivSummaryTabularComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](402653184, 1, { agGrid: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 200px;"]], null, [[null, "cellClicked"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("cellClicked" === en)) {
                var pd_0 = (_co.onCellClicked($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_3__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 4898816, [[1, 4], ["agGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_5__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_2__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_4__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"] }, { cellClicked: "cellClicked" }), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { columns: 1 })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.gridOptions; var currVal_1 = _co.data; _ck(_v, 4, 0, currVal_0, currVal_1); }, null);
}
function View_HivSummaryTabularComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-summary-tabular", [], null, null, null, View_HivSummaryTabularComponent_0, RenderType_HivSummaryTabularComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _hiv_summary_tabular_component__WEBPACK_IMPORTED_MODULE_6__["HivSummaryTabularComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivSummaryTabularComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-summary-tabular", _hiv_summary_tabular_component__WEBPACK_IMPORTED_MODULE_6__["HivSummaryTabularComponent"], View_HivSummaryTabularComponent_Host_0, { data: "rowData", sectionDefs: "sectionDefs", dates: "dates", gender: "gender", age: "age" }, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-summary-indicators/hiv-summary-tabular.component.ts ***!
  \**************************************************************************************/
/*! exports provided: HivSummaryTabularComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryTabularComponent", function() { return HivSummaryTabularComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);





var HivSummaryTabularComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivSummaryTabularComponent(router, route) {
        this.router = router;
        this.route = route;
        this.gridOptions = {
            columnDefs: []
        };
        // tslint:disable-next-line:no-input-rename
        this.data = [];
    }
    Object.defineProperty(HivSummaryTabularComponent.prototype, "sectionDefs", {
        get: function () {
            return this._sectionDefs;
        },
        set: function (v) {
            this._sectionDefs = v;
            this.setColumns(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryTabularComponent.prototype, "dates", {
        get: function () {
            return this._dates;
        },
        set: function (v) {
            this._dates = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryTabularComponent.prototype, "gender", {
        get: function () {
            return this._gender;
        },
        set: function (v) {
            this._gender = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivSummaryTabularComponent.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (v) {
            this._age = v;
        },
        enumerable: true,
        configurable: true
    });
    HivSummaryTabularComponent.prototype.ngOnInit = function () { };
    HivSummaryTabularComponent.prototype.setColumns = function (sectionsData) {
        var _this = this;
        var defs = [];
        defs.push({
            headerName: 'Location',
            field: 'location',
            pinned: 'left'
        });
        if (this.data[0]) {
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](Object.keys(this.data[0]), function (selected) {
                lodash__WEBPACK_IMPORTED_MODULE_1__["each"](sectionsData, function (data) {
                    if (selected === data.name) {
                        defs.push({
                            headerName: _this.titleCase(data.label),
                            field: data.name
                        });
                    }
                });
            });
        }
        this.gridOptions.columnDefs = defs;
        if (this.agGrid && this.agGrid.api) {
            this.agGrid.api.setColumnDefs(defs);
        }
    };
    HivSummaryTabularComponent.prototype.titleCase = function (str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    };
    HivSummaryTabularComponent.prototype.onCellClicked = function (event) {
        this.goToPatientList(event);
    };
    HivSummaryTabularComponent.prototype.goToPatientList = function (data) {
        this.locationUuids = data.data.location_uuid;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_4__(this._dates.startDate);
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_4__(this._dates.endDate);
        this.router.navigate(['../patient-list', data.colDef.field,
            this.startDate.format('DD/MM/YYYY') + '|' + this.endDate.format('DD/MM/YYYY'),
            this.gender ? this.gender : 'F,M', this.age.startAge + '|' + this.age.endAge,
            data.data.location_uuid], { relativeTo: this.route });
    };
    return HivSummaryTabularComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-summary-indicators/patient-list.component.ngfactory.js":
/*!*****************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-summary-indicators/patient-list.component.ngfactory.js ***!
  \*****************************************************************************************/
/*! exports provided: RenderType_HivSummaryIndicatorsPatientListComponent, View_HivSummaryIndicatorsPatientListComponent_0, View_HivSummaryIndicatorsPatientListComponent_Host_0, HivSummaryIndicatorsPatientListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivSummaryIndicatorsPatientListComponent", function() { return RenderType_HivSummaryIndicatorsPatientListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryIndicatorsPatientListComponent_0", function() { return View_HivSummaryIndicatorsPatientListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivSummaryIndicatorsPatientListComponent_Host_0", function() { return View_HivSummaryIndicatorsPatientListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryIndicatorsPatientListComponentNgFactory", function() { return HivSummaryIndicatorsPatientListComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component.ngfactory */ "./src/app/shared/data-lists/patient-list/patient-list.component.ngfactory.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component */ "./src/app/shared/data-lists/patient-list/patient-list.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _patient_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./patient-list.component */ "./src/app/hiv-care-lib/hiv-summary-indicators/patient-list.component.ts");
/* harmony import */ var _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../etl-api/hiv-summary-indicators-resource.service */ "./src/app/etl-api/hiv-summary-indicators-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_angular_common,ngx_openmrs_formentry_dist_ngx_formentry,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_patient_list.component,_.._etl_api_hiv_summary_indicators_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_angular_common,ngx_openmrs_formentry_dist_ngx_formentry,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_patient_list.component,_.._etl_api_hiv_summary_indicators_resource.service PURE_IMPORTS_END */








var styles_HivSummaryIndicatorsPatientListComponent = [];
var RenderType_HivSummaryIndicatorsPatientListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivSummaryIndicatorsPatientListComponent, data: {} });

function View_HivSummaryIndicatorsPatientListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_HivSummaryIndicatorsPatientListComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin fa-1x fa-fw"]], null, null, null, null, null))], null, null); }
function View_HivSummaryIndicatorsPatientListComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 4, "button", [["class", "btn btn-primary"]], [[8, "disabled", 0]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.loadMorePatients() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-refresh"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Load More "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsPatientListComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](5, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.isLoading; _ck(_v, 5, 0, currVal_1); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoading; _ck(_v, 1, 0, currVal_0); });
}
function View_HivSummaryIndicatorsPatientListComponent_4(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](4, null, ["All records loaded ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 0, "p", [], null, null, null, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = (("[ " + _co.patientData.length) + " ]"); _ck(_v, 4, 0, currVal_0); }); }
function View_HivSummaryIndicatorsPatientListComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵpid"](0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_2__["ɵj"], []), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 4, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 3, "button", [["class", "btn btn-primary"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.goBack() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-arrow-left"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Go back to tabular view"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsPatientListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](8, 0, null, null, 1, "h3", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](9, null, [" Patient List | ", "\n"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](10, 0, null, null, 3, "h5", [["class", "text-muted"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](11, null, [" (From: ", " To: ", ")\n"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵppd"](12, 2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵppd"](13, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](14, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](15, 0, null, null, 1, "patient-list", [], null, null, null, _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["View_PatientListComponent_0"], _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_3__["RenderType_PatientListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](16, 114688, null, 0, _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_4__["PatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]], { overrideColumns: [0, "overrideColumns"], data: [1, "data"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsPatientListComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](18, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_HivSummaryIndicatorsPatientListComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](20, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoading; _ck(_v, 7, 0, currVal_0); var currVal_4 = _co.overrideColumns; var currVal_5 = _co.patientData; _ck(_v, 16, 0, currVal_4, currVal_5); var currVal_6 = !_co.dataLoaded; _ck(_v, 18, 0, currVal_6); var currVal_7 = _co.dataLoaded; _ck(_v, 20, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.translatedIndicator; _ck(_v, 9, 0, currVal_1); var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵunv"](_v, 11, 0, _ck(_v, 12, 0, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 0), _co.startDate, "DD/MM/YYYY")); var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵunv"](_v, 11, 1, _ck(_v, 13, 0, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 0), _co.endDate, "DD/MM/YYYY")); _ck(_v, 11, 0, currVal_2, currVal_3); });
}
function View_HivSummaryIndicatorsPatientListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-summary-patient-list", [], null, null, null, View_HivSummaryIndicatorsPatientListComponent_0, RenderType_HivSummaryIndicatorsPatientListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _patient_list_component__WEBPACK_IMPORTED_MODULE_6__["HivSummaryIndicatorsPatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"], _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_7__["HivSummaryIndicatorsResourceService"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivSummaryIndicatorsPatientListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-summary-patient-list", _patient_list_component__WEBPACK_IMPORTED_MODULE_6__["HivSummaryIndicatorsPatientListComponent"], View_HivSummaryIndicatorsPatientListComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-summary-indicators/patient-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-summary-indicators/patient-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: HivSummaryIndicatorsPatientListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivSummaryIndicatorsPatientListComponent", function() { return HivSummaryIndicatorsPatientListComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _etl_api_hiv_summary_indicators_resource_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../etl-api/hiv-summary-indicators-resource.service */ "./src/app/etl-api/hiv-summary-indicators-resource.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");






var HivSummaryIndicatorsPatientListComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivSummaryIndicatorsPatientListComponent(route, router, resourceService, _location) {
        this.route = route;
        this.router = router;
        this.resourceService = resourceService;
        this._location = _location;
        this.startIndex = 0;
        this.isLoading = false;
        this.dataLoaded = false;
        this.overrideColumns = [];
    }
    HivSummaryIndicatorsPatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routeParamsSubscription = this.route.params.subscribe(function (params) {
            if (params) {
                var period = params['period'].split('|');
                _this.getDateRange(period);
                _this.locationUuids = params.locationUuids;
                _this.indicator = params['indicator'];
                _this.translatedIndicator = _this.translateIndicator(_this.indicator);
                var age = params['age'].split('|');
                _this.getAgeRange(age);
                _this.gender = params['gender'];
                _this.overrideColumns.push({
                    field: 'identifiers',
                    onCellClicked: function (column) {
                        _this.redirectTopatientInfo(column.data.patient_uuid);
                    },
                    cellRenderer: function (column) {
                        return '<a href="javascript:void(0);" title="Identifiers">'
                            + column.value + '</a>';
                    }
                });
            }
        });
        this.generatePatientListReport();
    };
    HivSummaryIndicatorsPatientListComponent.prototype.getDateRange = function (period) {
        var startDate = period[0].split('/');
        var endDate = period[1].split('/');
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_3__([startDate[2], startDate[1] - 1, startDate[0]]);
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_3__([endDate[2], endDate[1] - 1, endDate[0]]);
    };
    HivSummaryIndicatorsPatientListComponent.prototype.getAgeRange = function (age) {
        this.startAge = age[0];
        this.endAge = age[1];
    };
    HivSummaryIndicatorsPatientListComponent.prototype.translateIndicator = function (indicator) {
        return indicator.toLowerCase().split('_').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    };
    HivSummaryIndicatorsPatientListComponent.prototype.generatePatientListReport = function () {
        var _this = this;
        this.isLoading = true;
        this.resourceService.getHivSummaryIndicatorsPatientList({
            endDate: this.endDate.format(),
            indicator: this.indicator,
            locationUuids: this.locationUuids,
            startDate: this.startDate.format(),
            startAge: this.startAge,
            endAge: this.endAge,
            gender: this.gender,
            startIndex: this.startIndex
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (report) {
            _this.patientData = _this.patientData ? _this.patientData.concat(report) : report;
            _this.isLoading = false;
            _this.startIndex += report.length;
            if (report.length < 300) {
                _this.dataLoaded = true;
            }
        });
    };
    HivSummaryIndicatorsPatientListComponent.prototype.loadMorePatients = function () {
        this.generatePatientListReport();
    };
    HivSummaryIndicatorsPatientListComponent.prototype.redirectTopatientInfo = function (patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
                '/general/general/landing-page']);
    };
    HivSummaryIndicatorsPatientListComponent.prototype.goBack = function () {
        this._location.back();
    };
    return HivSummaryIndicatorsPatientListComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-base.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-base.component.ts ***!
  \************************************************************************************/
/*! exports provided: HivCareComparativeOverviewBaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareComparativeOverviewBaseComponent", function() { return HivCareComparativeOverviewBaseComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../etl-api/clinical-summary-visualization-resource.service */ "./src/app/etl-api/clinical-summary-visualization-resource.service.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");






var HivCareComparativeOverviewBaseComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivCareComparativeOverviewBaseComponent(visualizationResourceService, dataAnalyticsDashboardService) {
        this.visualizationResourceService = visualizationResourceService;
        this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        this.data = [];
        this.isLoadingReport = false;
        this.encounteredError = false;
        this.errorMessage = '';
        this.enabledControls = 'datesControl, locationControl';
        this.loadingHivCare = false;
        this._startDate = moment__WEBPACK_IMPORTED_MODULE_2__().subtract(1, 'year').toDate();
        this._endDate = new Date();
    }
    Object.defineProperty(HivCareComparativeOverviewBaseComponent.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (v) {
            this._startDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivCareComparativeOverviewBaseComponent.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (v) {
            this._endDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivCareComparativeOverviewBaseComponent.prototype, "locationUuids", {
        get: function () {
            return this._locationUuids;
        },
        set: function (v) {
            this._locationUuids = v;
        },
        enumerable: true,
        configurable: true
    });
    HivCareComparativeOverviewBaseComponent.prototype.ngOnInit = function () {
    };
    HivCareComparativeOverviewBaseComponent.prototype.generateReport = function () {
        var _this = this;
        this.loadingHivCare = true;
        this.dates = {
            startDate: this._startDate,
            endDate: this._endDate
        };
        var _options = {};
        this.encounteredError = false;
        this.errorMessage = '';
        this.isLoadingReport = true;
        this.data = [];
        this.visualizationResourceService.getHivComparativeOverviewReport({
            endDate: this.toDateString(this.endDate),
            gender: 'M,F',
            indicators: '',
            groupBy: 'groupByEndDate',
            locationUuids: this.getSelectedLocations(this.locationUuids),
            order: 'encounter_datetime|asc',
            report: 'clinical-hiv-comparative-overview-report',
            startDate: this.toDateString(this.startDate)
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (data) {
            lodash__WEBPACK_IMPORTED_MODULE_4__["merge"](_options, { data: data.result }, { indicatorDefinitions: data.indicatorDefinitions });
            _this.hivComparativeChartOptions = _options;
            _this.loadingHivCare = false;
            _this.isLoadingReport = false;
        }, function (error) {
            _this.loadingHivCare = false;
            _this.errorMessage = error;
            _this.encounteredError = true;
            _this.isLoadingReport = false;
        });
    };
    HivCareComparativeOverviewBaseComponent.prototype.getSelectedLocations = function (locationUuids) {
        if (!locationUuids || locationUuids.length === 0) {
            return '';
        }
        var selectedLocations = '';
        for (var i = 0; i < locationUuids.length; i++) {
            if (i === 0) {
                selectedLocations = selectedLocations + locationUuids[0].value;
            }
            else {
                selectedLocations = selectedLocations + ',' + locationUuids[i].value;
            }
        }
        return selectedLocations;
    };
    HivCareComparativeOverviewBaseComponent.prototype.toDateString = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_2__(date).utcOffset('+03:00').format();
    };
    return HivCareComparativeOverviewBaseComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.css.ngstyle.js":
/*!*************************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.css.ngstyle.js ***!
  \*************************************************************************************************/
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
var styles = ["chart {\n  display: block;\n}\n.slide-toggle {\n  margin-right: 12px;\n  float: right;\n  display: inline-block;\n}\n.chart-inner {\n  position: absolute;\n  width: 20%; height: 50%;\n}\n.chart-wrapper {\n  position: relative;\n  padding-bottom: 40%;\n  width:10%;\n  float:left;\n}\n.highcharts-container {\n  width: 100% !important;\n}\n"];



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ngfactory.js":
/*!***********************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ngfactory.js ***!
  \***********************************************************************************************/
/*! exports provided: RenderType_HivCareComparativeChartComponent, View_HivCareComparativeChartComponent_0, View_HivCareComparativeChartComponent_Host_0, HivCareComparativeChartComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivCareComparativeChartComponent", function() { return RenderType_HivCareComparativeChartComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareComparativeChartComponent_0", function() { return View_HivCareComparativeChartComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareComparativeChartComponent_Host_0", function() { return View_HivCareComparativeChartComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareComparativeChartComponentNgFactory", function() { return HivCareComparativeChartComponentNgFactory; });
/* harmony import */ var _hiv_care_overview_chart_component_css_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hiv-care-overview-chart.component.css.ngstyle */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.css.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular2_highcharts_dist_ChartComponent_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/angular2-highcharts/dist/ChartComponent.ngfactory */ "./node_modules/angular2-highcharts/dist/ChartComponent.ngfactory.js");
/* harmony import */ var angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-highcharts/dist/HighchartsService */ "./node_modules/angular2-highcharts/dist/HighchartsService.js");
/* harmony import */ var angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var angular2_highcharts_dist_ChartComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular2-highcharts/dist/ChartComponent */ "./node_modules/angular2-highcharts/dist/ChartComponent.js");
/* harmony import */ var angular2_highcharts_dist_ChartComponent__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(angular2_highcharts_dist_ChartComponent__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hiv_care_tabularView_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hiv-care-tabularView.component.ngfactory */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ngfactory.js");
/* harmony import */ var _hiv_care_tabularView_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hiv-care-tabularView.component */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ts");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _indicator_definitions_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./indicator-definitions.component.ngfactory */ "./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ngfactory.js");
/* harmony import */ var _indicator_definitions_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./indicator-definitions.component */ "./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_angular_material_slide_toggle_typings_index_ngfactory__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../node_modules/@angular/material/slide-toggle/typings/index.ngfactory */ "./node_modules/@angular/material/slide-toggle/typings/index.ngfactory.js");
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/slide-toggle */ "./node_modules/@angular/material/esm5/slide-toggle.es5.js");
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/cdk/platform */ "./node_modules/@angular/cdk/esm5/platform.es5.js");
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/cdk/a11y */ "./node_modules/@angular/cdk/esm5/a11y.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/cdk/bidi */ "./node_modules/@angular/cdk/esm5/bidi.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _hiv_care_overview_chart_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hiv-care-overview-chart.component */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _hiv_care_overview_chart.component.css.ngstyle,_angular_core,_.._.._.._node_modules_angular2_highcharts_dist_ChartComponent.ngfactory,angular2_highcharts_dist_HighchartsService,angular2_highcharts_dist_ChartComponent,_hiv_care_tabularView.component.ngfactory,_hiv_care_tabularView.component,_services_clinical_summary_visualization.service,_angular_router,_indicator_definitions.component.ngfactory,_indicator_definitions.component,_angular_common,_.._.._.._node_modules__angular_material_slide_toggle_typings_index.ngfactory,_angular_material_slide_toggle,_angular_cdk_platform,_angular_cdk_a11y,_angular_platform_browser_animations,_angular_cdk_bidi,_angular_forms,_hiv_care_overview_chart.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _hiv_care_overview_chart.component.css.ngstyle,_angular_core,_.._.._.._node_modules_angular2_highcharts_dist_ChartComponent.ngfactory,angular2_highcharts_dist_HighchartsService,angular2_highcharts_dist_ChartComponent,_hiv_care_tabularView.component.ngfactory,_hiv_care_tabularView.component,_services_clinical_summary_visualization.service,_angular_router,_indicator_definitions.component.ngfactory,_indicator_definitions.component,_angular_common,_.._.._.._node_modules__angular_material_slide_toggle_typings_index.ngfactory,_angular_material_slide_toggle,_angular_cdk_platform,_angular_cdk_a11y,_angular_platform_browser_animations,_angular_cdk_bidi,_angular_forms,_hiv_care_overview_chart.component PURE_IMPORTS_END */




















var styles_HivCareComparativeChartComponent = [_hiv_care_overview_chart_component_css_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_HivCareComparativeChartComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 2, styles: styles_HivCareComparativeChartComponent, data: {} });

function View_HivCareComparativeChartComponent_1(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 5, "chart", [], null, [[null, "redraw"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("redraw" === en)) {
                var pd_0 = (_co.renderChart() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_angular2_highcharts_dist_ChartComponent_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_ChartComponent_0"], _node_modules_angular2_highcharts_dist_ChartComponent_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_ChartComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](512, null, angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__["HighchartsService"], angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__["HighchartsService"], [angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__["HighchartsStatic"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 4243456, null, 3, angular2_highcharts_dist_ChartComponent__WEBPACK_IMPORTED_MODULE_4__["ChartComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], angular2_highcharts_dist_HighchartsService__WEBPACK_IMPORTED_MODULE_3__["HighchartsService"]], { options: [0, "options"] }, { redraw: "redraw" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](335544320, 1, { series: 0 }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](335544320, 2, { xAxis: 0 }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵqud"](335544320, 3, { yAxis: 0 })], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.options; _ck(_v, 2, 0, currVal_0); }, null);
}
function View_HivCareComparativeChartComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "hiv-care-tabularview", [], null, null, null, _hiv_care_tabularView_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_HivCareTabularViewComponent_0"], _hiv_care_tabularView_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_HivCareTabularViewComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 245760, null, 0, _hiv_care_tabularView_component__WEBPACK_IMPORTED_MODULE_6__["HivCareTabularViewComponent"], [_services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_7__["ClinicalSummaryVisualizationService"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]], { data: [0, "data"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.data; _ck(_v, 3, 0, currVal_0); }, null); }
function View_HivCareComparativeChartComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Show"]))], null, null); }
function View_HivCareComparativeChartComponent_4(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Hide "]))], null, null); }
function View_HivCareComparativeChartComponent_5(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "div", [["class", "clear"]], null, null, null, null, null))], null, null); }
function View_HivCareComparativeChartComponent_6(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 1, "hiv-care-indicator-definitions", [], null, null, null, _indicator_definitions_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["View_HivCareIndicatorDefComponent_0"], _indicator_definitions_component_ngfactory__WEBPACK_IMPORTED_MODULE_9__["RenderType_HivCareIndicatorDefComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 114688, null, 0, _indicator_definitions_component__WEBPACK_IMPORTED_MODULE_10__["HivCareIndicatorDefComponent"], [], { indicatorDefinitions: [0, "indicatorDefinitions"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.indicatorDef; _ck(_v, 3, 0, currVal_0); }, null); }
function View_HivCareComparativeChartComponent_7(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Show"]))], null, null); }
function View_HivCareComparativeChartComponent_8(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Hide"]))], null, null); }
function View_HivCareComparativeChartComponent_9(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "div", [["class", "clear"]], null, null, null, null, null))], null, null); }
function View_HivCareComparativeChartComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 36, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 35, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeChartComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeChartComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 11, "div", [["class", "slide-toggle"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 10, "mat-slide-toggle", [["class", "mat-slide-toggle"], ["style", "float:right"]], [[8, "id", 0], [2, "mat-checked", null], [2, "mat-disabled", null], [2, "mat-slide-toggle-label-before", null], [2, "_mat-animation-noopable", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.showHivCareTabularView = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_angular_material_slide_toggle_typings_index_ngfactory__WEBPACK_IMPORTED_MODULE_12__["View_MatSlideToggle_0"], _node_modules_angular_material_slide_toggle_typings_index_ngfactory__WEBPACK_IMPORTED_MODULE_12__["RenderType_MatSlideToggle"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](9, 1228800, null, 0, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MatSlideToggle"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_14__["Platform"], _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_15__["FocusMonitor"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], [8, null], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS"], [2, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_16__["ANIMATION_MODULE_TYPE"]], [2, _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_17__["Directionality"]]], { color: [0, "color"], checked: [1, "checked"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MatSlideToggle"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](11, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](13, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, 0, 1, null, View_HivCareComparativeChartComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](15, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, 0, 1, null, View_HivCareComparativeChartComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](17, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, 0, ["HIV Care Tabular View "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeChartComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](20, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeChartComponent_6)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](22, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](23, 0, null, null, 11, "div", [["class", "slide-toggle"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](24, 0, null, null, 10, "mat-slide-toggle", [["class", "mat-slide-toggle"], ["style", "float:right"]], [[8, "id", 0], [2, "mat-checked", null], [2, "mat-disabled", null], [2, "mat-slide-toggle-label-before", null], [2, "_mat-animation-noopable", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("ngModelChange" === en)) {
                var pd_0 = ((_co.showIndicatorDefinitions = $event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_angular_material_slide_toggle_typings_index_ngfactory__WEBPACK_IMPORTED_MODULE_12__["View_MatSlideToggle_0"], _node_modules_angular_material_slide_toggle_typings_index_ngfactory__WEBPACK_IMPORTED_MODULE_12__["RenderType_MatSlideToggle"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 1228800, null, 0, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MatSlideToggle"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_14__["Platform"], _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_15__["FocusMonitor"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], [8, null], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS"], [2, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_16__["ANIMATION_MODULE_TYPE"]], [2, _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_17__["Directionality"]]], { color: [0, "color"], checked: [1, "checked"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_13__["MatSlideToggle"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](27, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](29, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_18__["NgControl"]]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, 0, 1, null, View_HivCareComparativeChartComponent_7)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](31, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, 0, 1, null, View_HivCareComparativeChartComponent_8)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](33, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, 0, [" Indicator Definitions "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_HivCareComparativeChartComponent_9)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](36, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.options; _ck(_v, 4, 0, currVal_0); var currVal_1 = _co.showHivCareTabularView; _ck(_v, 6, 0, currVal_1); var currVal_14 = "primary"; var currVal_15 = _co.showHivCareTabularView; _ck(_v, 9, 0, currVal_14, currVal_15); var currVal_16 = _co.showHivCareTabularView; _ck(_v, 11, 0, currVal_16); var currVal_17 = !_co.showHivCareTabularView; _ck(_v, 15, 0, currVal_17); var currVal_18 = _co.showHivCareTabularView; _ck(_v, 17, 0, currVal_18); var currVal_19 = _co.showIndicatorDefinitions; _ck(_v, 20, 0, currVal_19); var currVal_20 = _co.showIndicatorDefinitions; _ck(_v, 22, 0, currVal_20); var currVal_33 = "primary"; var currVal_34 = _co.showIndicatorDefinitions; _ck(_v, 25, 0, currVal_33, currVal_34); var currVal_35 = _co.showIndicatorDefinitions; _ck(_v, 27, 0, currVal_35); var currVal_36 = !_co.showIndicatorDefinitions; _ck(_v, 31, 0, currVal_36); var currVal_37 = _co.showIndicatorDefinitions; _ck(_v, 33, 0, currVal_37); var currVal_38 = _co.showHivCareTabularView; _ck(_v, 36, 0, currVal_38); }, function (_ck, _v) { var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9).id; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9).checked; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9).disabled; var currVal_5 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9).labelPosition == "before"); var currVal_6 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 9)._animationMode === "NoopAnimations"); var currVal_7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassUntouched; var currVal_8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassTouched; var currVal_9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPristine; var currVal_10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassDirty; var currVal_11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassValid; var currVal_12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassInvalid; var currVal_13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 13).ngClassPending; _ck(_v, 8, 1, [currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13]); var currVal_21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).id; var currVal_22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).checked; var currVal_23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).disabled; var currVal_24 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25).labelPosition == "before"); var currVal_25 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 25)._animationMode === "NoopAnimations"); var currVal_26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassUntouched; var currVal_27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassTouched; var currVal_28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassPristine; var currVal_29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassDirty; var currVal_30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassValid; var currVal_31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassInvalid; var currVal_32 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 29).ngClassPending; _ck(_v, 24, 1, [currVal_21, currVal_22, currVal_23, currVal_24, currVal_25, currVal_26, currVal_27, currVal_28, currVal_29, currVal_30, currVal_31, currVal_32]); });
}
function View_HivCareComparativeChartComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "hiv-care-overview-chart", [], null, null, null, View_HivCareComparativeChartComponent_0, RenderType_HivCareComparativeChartComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _hiv_care_overview_chart_component__WEBPACK_IMPORTED_MODULE_19__["HivCareComparativeChartComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_8__["ActivatedRoute"], _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_7__["ClinicalSummaryVisualizationService"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivCareComparativeChartComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("hiv-care-overview-chart", _hiv_care_overview_chart_component__WEBPACK_IMPORTED_MODULE_19__["HivCareComparativeChartComponent"], View_HivCareComparativeChartComponent_Host_0, { options: "options", dates: "dates" }, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-overview-chart.component.ts ***!
  \*************************************************************************************/
/*! exports provided: HivCareComparativeChartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareComparativeChartComponent", function() { return HivCareComparativeChartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);





var highcharts = __webpack_require__(/*! highcharts */ "./node_modules/highcharts/highcharts.js");

var HivCareComparativeChartComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivCareComparativeChartComponent(route, clinicalSummaryVisualizationService, router) {
        this.route = route;
        this.clinicalSummaryVisualizationService = clinicalSummaryVisualizationService;
        this.router = router;
        this.indicatorDef = [];
        this.showHivCareTabularView = true;
        this.showIndicatorDefinitions = false;
        this.xAxisCategories = [];
        this.patientsInCare = [];
        this.patientsOnArt = [];
        this.percOnArtWithVl = [];
        this.virallySuppressed = [];
        this.chartTitle = 'A comparative graph showing HIV Care analysis';
        this._options = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        if (!this.options) {
            this.options = {};
        }
    }
    Object.defineProperty(HivCareComparativeChartComponent.prototype, "options", {
        get: function () {
            return this._options.getValue();
        },
        set: function (value) {
            this._options.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HivCareComparativeChartComponent.prototype, "dates", {
        get: function () {
            return this._dates;
        },
        set: function (v) {
            this._dates = v;
        },
        enumerable: true,
        configurable: true
    });
    HivCareComparativeChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this._options) {
            this._options.subscribe(function (options) {
                if (options) {
                    _this.data = options.data;
                    _this.indicatorDef = options.indicatorDefinitions;
                    _this.renderChart(options);
                    _this.resetDataSets();
                }
            });
        }
    };
    HivCareComparativeChartComponent.prototype.goToPatientList = function (indicator, filters) {
        var dateRange = this.clinicalSummaryVisualizationService.getMonthDateRange(filters.split('/')[0], filters.split('/')[1] - 1);
        this.router.navigate(['./patient-list', 'clinical-hiv-comparative-overview', indicator,
            dateRange.startDate.format('DD/MM/YYYY') + '|' +
                dateRange.endDate.format('DD/MM/YYYY')], { relativeTo: this.route });
    };
    HivCareComparativeChartComponent.prototype.renderChart = function (options) {
        var startDate;
        var endDate;
        this.processChartData();
        if (this._dates) {
            startDate = moment__WEBPACK_IMPORTED_MODULE_5__(this._dates.startDate).format('DD-MM-YYYY');
            endDate = moment__WEBPACK_IMPORTED_MODULE_5__(this._dates.endDate).format('DD-MM-YYYY');
        }
        var that = this;
        lodash__WEBPACK_IMPORTED_MODULE_2__["merge"](options, {
            colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
            title: { text: this.chartTitle },
            subtitle: {
                text: 'Starting from ' + startDate + ' To ' + endDate
            },
            chart: {
                zoomType: 'xy',
                alignTicks: false,
                events: {
                    redraw: true
                },
            },
            background2: '#F0F0EA',
            plotOptions: {
                candlestick: {
                    lineColor: '#404048'
                },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                var indicators = that.clinicalSummaryVisualizationService.flipTranlateColumns;
                                that.goToPatientList(indicators['clinical-hiv-comparative-overview'][this.series.name], this.category);
                            }
                        }
                    }
                }
            },
            xAxis: [{
                    categories: this.xAxisCategories,
                    gridLineWidth: 1,
                    title: {
                        text: 'Date (Month)'
                    },
                    crosshair: true
                }],
            yAxis: [
                {
                    labels: {
                        format: '{value}',
                        style: {
                            color: highcharts.getOptions().colors[0]
                        }
                    },
                    tickInterval: 100,
                    title: {
                        text: 'Number Of Patients',
                        style: {
                            color: highcharts.getOptions().colors[0]
                        }
                    }
                },
                {
                    title: {
                        text: 'Percent (%)',
                        rotation: -90,
                        padding: 10,
                        style: {
                            color: highcharts.getOptions().colors[1]
                        }
                    },
                    tickInterval: 10,
                    max: 100,
                    endOnTick: true,
                    labels: {
                        format: '{value}',
                        style: {
                            color: highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
            },
            series: [
                {
                    name: 'Patients In Care',
                    type: 'spline',
                    yAxis: 0,
                    data: this.patientsInCare,
                    tooltip: {
                        valueSuffix: ''
                    }
                },
                {
                    name: 'Patients On ART',
                    type: 'spline',
                    yAxis: 0,
                    data: this.patientsOnArt,
                    tooltip: {
                        valueSuffix: ''
                    }
                },
                {
                    name: '% on ART with VL',
                    type: 'spline',
                    yAxis: 1,
                    data: this.percOnArtWithVl,
                    tooltip: {
                        valueSuffix: ''
                    }
                },
                {
                    name: '% Virally Suppressed',
                    type: 'spline',
                    yAxis: 1,
                    data: this.virallySuppressed,
                    tooltip: {
                        valueSuffix: ''
                    }
                }
            ],
        });
    };
    HivCareComparativeChartComponent.prototype.processChartData = function () {
        var _this = this;
        lodash__WEBPACK_IMPORTED_MODULE_2__["each"](this.data, function (result) {
            _this.xAxisCategories.push(result.reporting_month);
            _this.patientsInCare.push(result.currently_in_care_total);
            _this.patientsOnArt.push(result.on_art_total);
            _this.virallySuppressed.push(result.perc_virally_suppressed);
            _this.percOnArtWithVl.push(result.perc_tested_appropriately);
        });
    };
    HivCareComparativeChartComponent.prototype.resetDataSets = function () {
        this.xAxisCategories = [];
        this.patientsInCare = [];
        this.patientsOnArt = [];
        this.virallySuppressed = [];
        this.percOnArtWithVl = [];
    };
    return HivCareComparativeChartComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ngfactory.js":
/*!********************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ngfactory.js ***!
  \********************************************************************************************/
/*! exports provided: RenderType_HivCareTabularViewComponent, View_HivCareTabularViewComponent_0, View_HivCareTabularViewComponent_Host_0, HivCareTabularViewComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivCareTabularViewComponent", function() { return RenderType_HivCareTabularViewComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareTabularViewComponent_0", function() { return View_HivCareTabularViewComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareTabularViewComponent_Host_0", function() { return View_HivCareTabularViewComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareTabularViewComponentNgFactory", function() { return HivCareTabularViewComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_data_lists_generic_list_generic_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/data-lists/generic-list/generic-list.component.ngfactory */ "./src/app/shared/data-lists/generic-list/generic-list.component.ngfactory.js");
/* harmony import */ var _shared_data_lists_generic_list_generic_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/data-lists/generic-list/generic-list.component */ "./src/app/shared/data-lists/generic-list/generic-list.component.ts");
/* harmony import */ var _hiv_care_tabularView_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hiv-care-tabularView.component */ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ts");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._shared_data_lists_generic_list_generic_list.component.ngfactory,_.._shared_data_lists_generic_list_generic_list.component,_hiv_care_tabularView.component,_services_clinical_summary_visualization.service,_angular_router PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._shared_data_lists_generic_list_generic_list.component.ngfactory,_.._shared_data_lists_generic_list_generic_list.component,_hiv_care_tabularView.component,_services_clinical_summary_visualization.service,_angular_router PURE_IMPORTS_END */






var styles_HivCareTabularViewComponent = [];
var RenderType_HivCareTabularViewComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivCareTabularViewComponent, data: {} });

function View_HivCareTabularViewComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "generic-list", [], null, null, null, _shared_data_lists_generic_list_generic_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_GenericListComponent_0"], _shared_data_lists_generic_list_generic_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_GenericListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 770048, null, 0, _shared_data_lists_generic_list_generic_list_component__WEBPACK_IMPORTED_MODULE_2__["GenericListComponent"], [], { columns: [0, "columns"], data: [1, "data"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.columns; var currVal_1 = _co.data; _ck(_v, 1, 0, currVal_0, currVal_1); }, null); }
function View_HivCareTabularViewComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-care-tabularview", [], null, null, null, View_HivCareTabularViewComponent_0, RenderType_HivCareTabularViewComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 245760, null, 0, _hiv_care_tabularView_component__WEBPACK_IMPORTED_MODULE_3__["HivCareTabularViewComponent"], [_services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_4__["ClinicalSummaryVisualizationService"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivCareTabularViewComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-care-tabularview", _hiv_care_tabularView_component__WEBPACK_IMPORTED_MODULE_3__["HivCareTabularViewComponent"], View_HivCareTabularViewComponent_Host_0, { data: "data" }, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/hiv-care-tabularView.component.ts ***!
  \**********************************************************************************/
/*! exports provided: HivCareTabularViewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareTabularViewComponent", function() { return HivCareTabularViewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");




var HivCareTabularViewComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivCareTabularViewComponent(clinicalSummaryVisualizationService, route, router) {
        this.clinicalSummaryVisualizationService = clinicalSummaryVisualizationService;
        this.route = route;
        this.router = router;
        this._data = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]([]);
        this.columns = [];
        this.columns = [];
    }
    HivCareTabularViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.clinicalSummaryVisualizationService.colCallback) {
            this.clinicalSummaryVisualizationService.colCallback.subscribe(function (col) {
                if (col) {
                    _this.goToPatientList(col.column.colId, col.data);
                }
            });
        }
    };
    HivCareTabularViewComponent.prototype.ngOnDestroy = function () {
        this._data.complete();
    };
    Object.defineProperty(HivCareTabularViewComponent.prototype, "data", {
        get: function () {
            return this._data.getValue();
        },
        set: function (value) {
            this._data.next([]);
            this.columns = [];
            this._data.next(this.clinicalSummaryVisualizationService.generateTableData(value));
            this.columns = this.clinicalSummaryVisualizationService.generateTabularViewColumns;
        },
        enumerable: true,
        configurable: true
    });
    HivCareTabularViewComponent.prototype.goToPatientList = function (indicator, col) {
        var dateRange = this.clinicalSummaryVisualizationService.getMonthDateRange(col.reporting_month.split('/')[0], col.reporting_month.split('/')[1] - 1);
        this.router.navigate(['./patient-list', 'clinical-hiv-comparative-overview', indicator,
            dateRange.startDate.format('DD/MM/YYYY') + '|' + dateRange.endDate.format('DD/MM/YYYY')], { relativeTo: this.route });
    };
    return HivCareTabularViewComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ngfactory.js":
/*!*********************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ngfactory.js ***!
  \*********************************************************************************************/
/*! exports provided: RenderType_HivCareIndicatorDefComponent, View_HivCareIndicatorDefComponent_0, View_HivCareIndicatorDefComponent_Host_0, HivCareIndicatorDefComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_HivCareIndicatorDefComponent", function() { return RenderType_HivCareIndicatorDefComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareIndicatorDefComponent_0", function() { return View_HivCareIndicatorDefComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_HivCareIndicatorDefComponent_Host_0", function() { return View_HivCareIndicatorDefComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareIndicatorDefComponentNgFactory", function() { return HivCareIndicatorDefComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/primeng/components/accordion/accordion.ngfactory */ "./node_modules/primeng/components/accordion/accordion.ngfactory.js");
/* harmony import */ var primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/components/accordion/accordion */ "./node_modules/primeng/components/accordion/accordion.js");
/* harmony import */ var primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _indicator_definitions_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./indicator-definitions.component */ "./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._.._.._node_modules_primeng_components_accordion_accordion.ngfactory,primeng_components_accordion_accordion,_angular_common,_indicator_definitions.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._.._.._node_modules_primeng_components_accordion_accordion.ngfactory,primeng_components_accordion_accordion,_angular_common,_indicator_definitions.component PURE_IMPORTS_END */





var styles_HivCareIndicatorDefComponent = [];
var RenderType_HivCareIndicatorDefComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_HivCareIndicatorDefComponent, data: {} });

function View_HivCareIndicatorDefComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 32, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 3, "p-accordionTab", [["header", "Patients in Care:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"], selected: [1, "selected"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 1, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](4, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 3, "p-accordionTab", [["header", "Patients on ART:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](6, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](8, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](9, 0, null, null, 3, "p-accordionTab", [["header", "% on ART with VL:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](10, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 3, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](12, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](13, 0, null, null, 3, "p-accordionTab", [["header", "% Virally Suppressed:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](14, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 4, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](16, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](17, 0, null, null, 3, "p-accordionTab", [["header", "On ART without VL:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](18, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 5, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](20, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](21, 0, null, null, 3, "p-accordionTab", [["header", "Due For Annual VL:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](22, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 6, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](24, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](25, 0, null, null, 3, "p-accordionTab", [["header", "Ordered & Pending VL Result:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](26, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 7, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](28, 1, [" ", " "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](29, 0, null, null, 3, "p-accordionTab", [["header", "Missing VL Order:"]], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_AccordionTab_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_AccordionTab"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](30, 180224, null, 1, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["AccordionTab"], [primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"]], { header: [0, "header"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 8, { headerFacet: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](32, 1, [" ", " "]))], function (_ck, _v) { var currVal_0 = "Patients in Care:"; var currVal_1 = true; _ck(_v, 2, 0, currVal_0, currVal_1); var currVal_3 = "Patients on ART:"; _ck(_v, 6, 0, currVal_3); var currVal_5 = "% on ART with VL:"; _ck(_v, 10, 0, currVal_5); var currVal_7 = "% Virally Suppressed:"; _ck(_v, 14, 0, currVal_7); var currVal_9 = "On ART without VL:"; _ck(_v, 18, 0, currVal_9); var currVal_11 = "Due For Annual VL:"; _ck(_v, 22, 0, currVal_11); var currVal_13 = "Ordered & Pending VL Result:"; _ck(_v, 26, 0, currVal_13); var currVal_15 = "Missing VL Order:"; _ck(_v, 30, 0, currVal_15); }, function (_ck, _v) { var currVal_2 = _v.context.$implicit.currently_in_care_total; _ck(_v, 4, 0, currVal_2); var currVal_4 = _v.context.$implicit.on_art_total; _ck(_v, 8, 0, currVal_4); var currVal_6 = _v.context.$implicit.perc_tested_appropriately; _ck(_v, 12, 0, currVal_6); var currVal_8 = _v.context.$implicit.perc_virally_suppressed; _ck(_v, 16, 0, currVal_8); var currVal_10 = _v.context.$implicit.not_tested_appropriately; _ck(_v, 20, 0, currVal_10); var currVal_12 = _v.context.$implicit.due_for_annual_vl; _ck(_v, 24, 0, currVal_12); var currVal_14 = _v.context.$implicit.pending_vl_orders; _ck(_v, 28, 0, currVal_14); var currVal_16 = _v.context.$implicit.missing_vl_order; _ck(_v, 32, 0, currVal_16); }); }
function View_HivCareIndicatorDefComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "p-accordion", [], null, null, null, _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_Accordion_0"], _node_modules_primeng_components_accordion_accordion_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_Accordion"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 49152, null, 0, primeng_components_accordion_accordion__WEBPACK_IMPORTED_MODULE_2__["Accordion"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]], null, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, 0, 1, null, View_HivCareIndicatorDefComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](3, 278528, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["IterableDiffers"]], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.indicatorDefinitionsArr; _ck(_v, 3, 0, currVal_0); }, null); }
function View_HivCareIndicatorDefComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "hiv-care-indicator-definitions", [], null, null, null, View_HivCareIndicatorDefComponent_0, RenderType_HivCareIndicatorDefComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _indicator_definitions_component__WEBPACK_IMPORTED_MODULE_4__["HivCareIndicatorDefComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var HivCareIndicatorDefComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("hiv-care-indicator-definitions", _indicator_definitions_component__WEBPACK_IMPORTED_MODULE_4__["HivCareIndicatorDefComponent"], View_HivCareIndicatorDefComponent_Host_0, { indicatorDefinitions: "indicatorDefinitions" }, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/indicator-definitions.component.ts ***!
  \***********************************************************************************/
/*! exports provided: HivCareIndicatorDefComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HivCareIndicatorDefComponent", function() { return HivCareIndicatorDefComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);



var HivCareIndicatorDefComponent = /** @class */ /*@__PURE__*/ (function () {
    function HivCareIndicatorDefComponent() {
        this._data = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
    }
    Object.defineProperty(HivCareIndicatorDefComponent.prototype, "indicatorDefinitions", {
        get: function () {
            return this._data.getValue();
        },
        set: function (value) {
            this._data.next(value);
        },
        enumerable: true,
        configurable: true
    });
    HivCareIndicatorDefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._data
            .subscribe(function (x) {
            if (x) {
                _this.createIndicatorDefinitionsDictionary(x);
            }
        });
    };
    HivCareIndicatorDefComponent.prototype.createIndicatorDefinitionsDictionary = function (indicatorDefinitions) {
        var arr = [];
        var dictionary = {};
        lodash__WEBPACK_IMPORTED_MODULE_2__["each"](indicatorDefinitions, function (indicatorDefinition) {
            dictionary[indicatorDefinition.name] = indicatorDefinition.description;
        });
        arr.push(dictionary);
        if (arr) {
            this.indicatorDefinitionsArr = arr;
        }
    };
    return HivCareIndicatorDefComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/visualization-patient-list.component.ngfactory.js":
/*!**************************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/visualization-patient-list.component.ngfactory.js ***!
  \**************************************************************************************************/
/*! exports provided: RenderType_VisualizationPatientListComponent, View_VisualizationPatientListComponent_0, View_VisualizationPatientListComponent_Host_0, VisualizationPatientListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_VisualizationPatientListComponent", function() { return RenderType_VisualizationPatientListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_VisualizationPatientListComponent_0", function() { return View_VisualizationPatientListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_VisualizationPatientListComponent_Host_0", function() { return View_VisualizationPatientListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VisualizationPatientListComponentNgFactory", function() { return VisualizationPatientListComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angular2_ladda_module_ladda_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular2-ladda/module/ladda.directive */ "./node_modules/angular2-ladda/module/ladda.directive.js");
/* harmony import */ var angular2_ladda_module_ladda_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular2-ladda/module/ladda-config */ "./node_modules/angular2-ladda/module/ladda-config.js");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component.ngfactory */ "./src/app/shared/data-lists/patient-list/patient-list.component.ngfactory.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component */ "./src/app/shared/data-lists/patient-list/patient-list.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _visualization_patient_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./visualization-patient-list.component */ "./src/app/hiv-care-lib/hiv-visualization/visualization-patient-list.component.ts");
/* harmony import */ var _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../etl-api/clinical-summary-visualization-resource.service */ "./src/app/etl-api/clinical-summary-visualization-resource.service.ts");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,angular2_ladda_module_ladda.directive,angular2_ladda_module_ladda_config,ngx_openmrs_formentry_dist_ngx_formentry,_angular_common,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_visualization_patient_list.component,_.._etl_api_clinical_summary_visualization_resource.service,_services_clinical_summary_visualization.service,_.._data_analytics_dashboard_services_data_analytics_dashboard.services PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,angular2_ladda_module_ladda.directive,angular2_ladda_module_ladda_config,ngx_openmrs_formentry_dist_ngx_formentry,_angular_common,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_visualization_patient_list.component,_.._etl_api_clinical_summary_visualization_resource.service,_services_clinical_summary_visualization.service,_.._data_analytics_dashboard_services_data_analytics_dashboard.services PURE_IMPORTS_END */












var styles_VisualizationPatientListComponent = [];
var RenderType_VisualizationPatientListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_VisualizationPatientListComponent, data: {} });

function View_VisualizationPatientListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_VisualizationPatientListComponent_2(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 4, "div", [["class", "button"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 3, "button", [["class", "btn btn-primary"], ["data-color", "blue"], ["data-size", "xs"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.loadMorePatients() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](3, 737280, null, 0, angular2_ladda_module_ladda_directive__WEBPACK_IMPORTED_MODULE_1__["LaddaDirective"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], [2, angular2_ladda_module_ladda_config__WEBPACK_IMPORTED_MODULE_2__["LaddaConfig"]]], { loading: [0, "loading"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 0, "span", [["class", ""]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Load More..."]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoading; _ck(_v, 3, 0, currVal_0); }, null);
}
function View_VisualizationPatientListComponent_3(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](4, null, ["All records loaded ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 0, "p", [], null, null, null, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = (("[ " + _co.patientData.length) + " ]"); _ck(_v, 4, 0, currVal_0); }); }
function View_VisualizationPatientListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵpid"](0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_3__["ɵj"], []), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "h3", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](2, null, [" Patient List | ", "\n"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 3, "h5", [["class", "text-muted"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](4, null, [" (From: ", " To: ", ")\n"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵppd"](5, 2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵppd"](6, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, null, 0, "hr", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_VisualizationPatientListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](9, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](10, 0, null, null, 1, "patient-list", [], null, null, null, _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["View_PatientListComponent_0"], _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_5__["RenderType_PatientListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](11, 114688, null, 0, _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_6__["PatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"]], { overrideColumns: [0, "overrideColumns"], data: [1, "data"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_VisualizationPatientListComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](13, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_VisualizationPatientListComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](15, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_3 = _co.isLoading; _ck(_v, 9, 0, currVal_3); var currVal_4 = _co.overrideColumns; var currVal_5 = _co.patientData; _ck(_v, 11, 0, currVal_4, currVal_5); var currVal_6 = !_co.dataLoaded; _ck(_v, 13, 0, currVal_6); var currVal_7 = _co.dataLoaded; _ck(_v, 15, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.translatedIndicator; _ck(_v, 2, 0, currVal_0); var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵunv"](_v, 4, 0, _ck(_v, 5, 0, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 0), _co.startDate, "DD/MM/YYYY")); var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵunv"](_v, 4, 1, _ck(_v, 6, 0, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 0), _co.endDate, "DD/MM/YYYY")); _ck(_v, 4, 0, currVal_1, currVal_2); }); }
function View_VisualizationPatientListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "visualization-patient-list", [], null, null, null, View_VisualizationPatientListComponent_0, RenderType_VisualizationPatientListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 245760, null, 0, _visualization_patient_list_component__WEBPACK_IMPORTED_MODULE_8__["VisualizationPatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"], _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_9__["ClinicalSummaryVisualizationResourceService"], _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_10__["ClinicalSummaryVisualizationService"], _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_11__["DataAnalyticsDashboardService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var VisualizationPatientListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("visualization-patient-list", _visualization_patient_list_component__WEBPACK_IMPORTED_MODULE_8__["VisualizationPatientListComponent"], View_VisualizationPatientListComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/hiv-visualization/visualization-patient-list.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/hiv-visualization/visualization-patient-list.component.ts ***!
  \****************************************************************************************/
/*! exports provided: VisualizationPatientListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VisualizationPatientListComponent", function() { return VisualizationPatientListComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _etl_api_clinical_summary_visualization_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../etl-api/clinical-summary-visualization-resource.service */ "./src/app/etl-api/clinical-summary-visualization-resource.service.ts");
/* harmony import */ var _services_clinical_summary_visualization_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/clinical-summary-visualization.service */ "./src/app/hiv-care-lib/services/clinical-summary-visualization.service.ts");
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");








var VisualizationPatientListComponent = /** @class */ /*@__PURE__*/ (function () {
    function VisualizationPatientListComponent(route, router, visualizationResourceService, clinicalSummaryVisualizationService, dataAnalyticsDashboardService) {
        this.route = route;
        this.router = router;
        this.visualizationResourceService = visualizationResourceService;
        this.clinicalSummaryVisualizationService = clinicalSummaryVisualizationService;
        this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        this.isLoading = false;
        this.dataLoaded = false;
        this.overrideColumns = [];
        this.startIndex = 0;
        this.subscription = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subscription"]();
        /**
         * Please note that this is a workaround for the dashboardService delay
         * to give you the location UUID.
         * If a better way can be found, please consider
         */
        var urlPieces = window.location.hash.split('/');
        var loc = { value: urlPieces[2] };
        this.locationUuids = loc.value;
    }
    VisualizationPatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCachedLocations();
        this.routeParamsSubscription = this.route.params.subscribe(function (params) {
            if (params) {
                var monthYear = params['period'].split('|');
                _this.reportName = params['report'];
                _this.currentIndicator = params['indicator'];
                _this.translatedIndicator =
                    _this.clinicalSummaryVisualizationService
                        .translateColumns[_this.reportName][_this.currentIndicator];
                _this.setDateRange(monthYear);
                _this.overrideColumns.push({
                    field: 'identifiers',
                    onCellClicked: function (column) {
                        _this.redirectTopatientInfo(column.data.patient_uuid);
                    },
                    cellRenderer: function (column) {
                        return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
                    }
                });
                _this.isLoading = true;
                _this.loadPatientData(_this.reportName);
            }
        });
    };
    VisualizationPatientListComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    VisualizationPatientListComponent.prototype.getCachedLocations = function () {
        var _this = this;
        this.dataAnalyticsDashboardService.getSelectedLocations().subscribe(function (data) {
            if (data) {
                console.log('data---->>viz', data);
                _this.locationUuids = _this.getSelectedLocations(data.locations);
            }
        });
    };
    VisualizationPatientListComponent.prototype.setDateRange = function (monthYear) {
        var startDate = monthYear[0].split('/');
        var endDate = monthYear[1].split('/');
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_3__([startDate[2], startDate[1] - 1, startDate[0]]);
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_3__([endDate[2], endDate[1] - 1, endDate[0]]);
    };
    VisualizationPatientListComponent.prototype.loadPatientData = function (reportName) {
        var _this = this;
        this.visualizationResourceService.getReportOverviewPatientList(reportName, {
            endDate: this.endDate.endOf('month').format(),
            indicator: this.currentIndicator,
            locationUuids: this.locationUuids,
            startIndex: this.startIndex,
            startDate: this.startDate.format()
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (report) {
            _this.patientData = _this.patientData ? _this.patientData.concat(report) : report;
            _this.isLoading = false;
            _this.startIndex += report.length;
            if (report.length < 300) {
                _this.dataLoaded = true;
            }
        });
    };
    VisualizationPatientListComponent.prototype.loadMorePatients = function () {
        this.isLoading = true;
        this.loadPatientData(this.reportName);
    };
    VisualizationPatientListComponent.prototype.redirectTopatientInfo = function (patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
                '/general/general/landing-page']);
    };
    VisualizationPatientListComponent.prototype.getSelectedLocations = function (locationUuids) {
        if (!locationUuids || locationUuids.length === 0) {
            return '';
        }
        var selectedLocations = '';
        for (var i = 0; i < locationUuids.length; i++) {
            if (i === 0) {
                selectedLocations = selectedLocations + locationUuids[0].value;
            }
            else {
                selectedLocations = selectedLocations + ',' + locationUuids[i].value;
            }
        }
        return selectedLocations;
    };
    return VisualizationPatientListComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.css.shim.ngstyle.js":
/*!***********************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.css.shim.ngstyle.js ***!
  \***********************************************************************************************/
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
var styles = [".alert[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.section-title[_ngcontent-%COMP%]{\n  color:green;\n  font-size: 22px;\n}\n.loader[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  z-index: 9;\n  box-sizing: border-box;\n  background-color: #fff;\n  color: #fff;\n  opacity: .8;\n}\n.loader[_ngcontent-%COMP%]   .fa[_ngcontent-%COMP%]:before {\n  margin-right: 12px;\n  display: inline-block;\n}\n.loader[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding: 12px;\n  background-color: #0d6aad;\n  border-radius: 6px;\n  position: relative;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  display: inline-block;\n}\n.fa-spin[_ngcontent-%COMP%] {\n  width: 16px;\n  margin-right: 8px;\n}"];



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.ngfactory.js":
/*!****************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.ngfactory.js ***!
  \****************************************************************************************/
/*! exports provided: RenderType_Moh731PatientListComponent, View_Moh731PatientListComponent_0, View_Moh731PatientListComponent_Host_0, Moh731PatientListComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_Moh731PatientListComponent", function() { return RenderType_Moh731PatientListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731PatientListComponent_0", function() { return View_Moh731PatientListComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731PatientListComponent_Host_0", function() { return View_Moh731PatientListComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731PatientListComponentNgFactory", function() { return Moh731PatientListComponentNgFactory; });
/* harmony import */ var _moh_731_patientlist_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moh-731-patientlist.component.css.shim.ngstyle */ "./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angular2_ladda_module_ladda_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular2-ladda/module/ladda.directive */ "./node_modules/angular2-ladda/module/ladda.directive.js");
/* harmony import */ var angular2_ladda_module_ladda_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-ladda/module/ladda-config */ "./node_modules/angular2-ladda/module/ladda-config.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component.ngfactory */ "./src/app/shared/data-lists/patient-list/patient-list.component.ngfactory.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component */ "./src/app/shared/data-lists/patient-list/patient-list.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");
/* harmony import */ var _moh_731_patientlist_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./moh-731-patientlist.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.ts");
/* harmony import */ var _etl_api_moh_731_patientlist_resource_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../etl-api/moh-731-patientlist-resource.service */ "./src/app/etl-api/moh-731-patientlist-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _moh_731_patientlist.component.css.shim.ngstyle,_angular_core,angular2_ladda_module_ladda.directive,angular2_ladda_module_ladda_config,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_angular_common,ngx_openmrs_formentry_dist_ngx_formentry,_moh_731_patientlist.component,_.._etl_api_moh_731_patientlist_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _moh_731_patientlist.component.css.shim.ngstyle,_angular_core,angular2_ladda_module_ladda.directive,angular2_ladda_module_ladda_config,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_angular_common,ngx_openmrs_formentry_dist_ngx_formentry,_moh_731_patientlist.component,_.._etl_api_moh_731_patientlist_resource.service PURE_IMPORTS_END */











var styles_Moh731PatientListComponent = [_moh_731_patientlist_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_Moh731PatientListComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_Moh731PatientListComponent, data: {} });

function View_Moh731PatientListComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](3, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.message; _ck(_v, 3, 0, currVal_0); }); }
function View_Moh731PatientListComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 4, "div", [["class", "button"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 3, "button", [["class", "btn btn-primary"], ["data-color", "blue"], ["data-size", "xs"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.loadMorePatients() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](3, 737280, null, 0, angular2_ladda_module_ladda_directive__WEBPACK_IMPORTED_MODULE_2__["LaddaDirective"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, angular2_ladda_module_ladda_config__WEBPACK_IMPORTED_MODULE_3__["LaddaConfig"]]], { loading: [0, "loading"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](4, 0, null, null, 0, "span", [["class", ""]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Load More..."]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoading; _ck(_v, 3, 0, currVal_0); }, null);
}
function View_Moh731PatientListComponent_4(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 3, "p", [["class", "bg-info"], ["style", "padding:4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 2, "b", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "span", [["class", "glyphicon glyphicon-ok"], ["style", "color:green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](4, null, ["All records loaded ", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 0, "p", [], null, null, null, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = (("[ " + _co.patientListPerIndicator.length) + " ]"); _ck(_v, 4, 0, currVal_0); }); }
function View_Moh731PatientListComponent_5(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "p", [["class", "alert-error alert"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Error loading patient list."]))], null, null); }
function View_Moh731PatientListComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 29, "div", [["class", "container-fluid"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 20, "div", [["class", "row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 17, "div", [["class", "col-md-12 col-lg-12 col-sm-12 col-xs-12"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "h4", [["class", "section-title"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["MOH-731 Patient List"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 0, "hr", [["class", "intro-divider"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 13, "h4", [["align", "center"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](7, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](8, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" in location(s) "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](11, null, ["", ""])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" from "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](13, 0, null, null, 2, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](14, null, ["", ""])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](15, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" to "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](17, 0, null, null, 2, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](18, null, ["", ""])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵppd"](19, 2), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](20, 0, null, null, 1, "div", [["class", "col-sm-12 col-md-6"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["\u00A0"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](22, 0, null, null, 1, "patient-list", [], null, null, null, _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_PatientListComponent_0"], _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_PatientListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](23, 114688, null, 0, _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_5__["PatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]], { extraColumns: [0, "extraColumns"], overrideColumns: [1, "overrideColumns"], data: [2, "data"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731PatientListComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](25, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731PatientListComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](27, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731PatientListComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](29, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_4 = _co.extraColumns; var currVal_5 = _co.overrideColumns; var currVal_6 = _co.patientListPerIndicator; _ck(_v, 23, 0, currVal_4, currVal_5, currVal_6); var currVal_7 = !_co.hasLoadedAll; _ck(_v, 25, 0, currVal_7); var currVal_8 = _co.hasLoadedAll; _ck(_v, 27, 0, currVal_8); var currVal_9 = _co.hasError; _ck(_v, 29, 0, currVal_9); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co._indicator; _ck(_v, 8, 0, currVal_0); var currVal_1 = _co._locations; _ck(_v, 11, 0, currVal_1); var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 14, 0, _ck(_v, 15, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co._startDate, "DD/MM/YYYY")); _ck(_v, 14, 0, currVal_2); var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵunv"](_v, 18, 0, _ck(_v, 19, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v.parent, 0), _co._endDate, "DD/MM/YYYY")); _ck(_v, 18, 0, currVal_3); }); }
function View_Moh731PatientListComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵpid"](0, ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_8__["ɵj"], []), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731PatientListComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731PatientListComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.busyIndicator.busy; _ck(_v, 2, 0, currVal_0); var currVal_1 = (!_co.hasError && (_co.patientListPerIndicator.length > 0)); _ck(_v, 4, 0, currVal_1); }, null); }
function View_Moh731PatientListComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "moh-731-patientlist", [], null, null, null, View_Moh731PatientListComponent_0, RenderType_Moh731PatientListComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 638976, null, 0, _moh_731_patientlist_component__WEBPACK_IMPORTED_MODULE_9__["Moh731PatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"], _etl_api_moh_731_patientlist_resource_service__WEBPACK_IMPORTED_MODULE_10__["Moh731PatientListResourceService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var Moh731PatientListComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("moh-731-patientlist", _moh_731_patientlist_component__WEBPACK_IMPORTED_MODULE_9__["Moh731PatientListComponent"], View_Moh731PatientListComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-patientlist.component.ts ***!
  \******************************************************************************/
/*! exports provided: Moh731PatientListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731PatientListComponent", function() { return Moh731PatientListComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _etl_api_moh_731_patientlist_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../etl-api/moh-731-patientlist-resource.service */ "./src/app/etl-api/moh-731-patientlist-resource.service.ts");






var Moh731PatientListComponent = /** @class */ /*@__PURE__*/ (function () {
    function Moh731PatientListComponent(route, router, moh731PatientListResourceService) {
        this.route = route;
        this.router = router;
        this.moh731PatientListResourceService = moh731PatientListResourceService;
        this.patientList = [];
        this.patientListPerIndicator = [];
        this.hasError = false;
        this.overrideColumns = [];
        this.extraColumns = [];
        this.startIndex = [];
        this.isLoading = false;
        this.hasLoadedAll = false;
        this.dataLoadedPerIndicator = false;
        this.dataLoaded = [];
        this.params = {
            startDate: '',
            endDate: '',
            locations: '',
            indicators: '',
            isLegacy: ''
        };
        this._locations = '';
        this._indicator = '';
        this.busyIndicator = {
            busy: false,
            message: ''
        };
    }
    Moh731PatientListComponent.prototype.ngOnChanges = function (changes) {
        // tslint:disable-next-line
        // for (let propName in changes) {
        //   let changedProp = changes[propName];
        //   if (!changedProp.isFirstChange()) {
        //     console.log('redrawing patient list');
        //     this.loadPatientList();
        //   }
        // }
    };
    Moh731PatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route
            .queryParams
            .subscribe(function (params) {
            if (params) {
                _this.params = params;
                _this.loadPatientList(_this.params);
            }
        }, function (error) {
            console.error('Error', error);
        });
    };
    Moh731PatientListComponent.prototype.loadPatientList = function (params) {
        var _this = this;
        console.log('Params', params);
        this.busyIndicator = {
            busy: true,
            message: 'Loading Patient List...please wait'
        };
        var rowCount = 0;
        this.moh731PatientListResourceService.getMoh731PatientListReport({
            indicator: params.indicators,
            isLegacy: Boolean(params.isLegacy),
            startIndex: this.startIndex[params.indicators] ? this.startIndex[params.indicators] : 0,
            startDate: moment__WEBPACK_IMPORTED_MODULE_3__(params.startDate).format('YYYY-MM-DD'),
            endDate: moment__WEBPACK_IMPORTED_MODULE_3__(params.endDate).endOf('day').format('YYYY-MM-DD'),
            reportName: Boolean(params.isLegacy) === true ? 'MOH-731-report' : 'MOH-731-report-2017',
            locationUuids: lodash__WEBPACK_IMPORTED_MODULE_4__["isArray"](params.locations) ? params.locations.join(',') : params.locations
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (data) {
            _this.isLoading = false;
            if (data.errorMessage) {
                _this.hasError = true;
                console.log('MOH 731 patient list report', data);
            }
            else {
                /**
                 * Track everything per indicator provided
                 */
                _this.patientListPerIndicator = _this.patientList[params.indicators] ?
                    _this.patientList[params.indicators] : [];
                _this.patientListPerIndicator = _this.patientListPerIndicator.concat(data.result);
                _this.patientList[params.indicators] = _this.patientListPerIndicator;
                _this.currentStartIndexPerIndicator = _this.startIndex[params.indicators];
                _this.currentStartIndexPerIndicator = _this.currentStartIndexPerIndicator ?
                    _this.currentStartIndexPerIndicator : 0;
                _this.currentStartIndexPerIndicator += data.size;
                _this.startIndex[params.indicators] = _this.currentStartIndexPerIndicator;
                if (data.size < 300 && !_this.dataLoaded[params.indicators]) {
                    _this.dataLoaded[params.indicator] = true;
                }
                if (data.result.length < 300) {
                    _this.hasLoadedAll = true;
                }
                _this.dataLoadedPerIndicator = _this.dataLoaded[params.indicators];
                _this._startDate = moment__WEBPACK_IMPORTED_MODULE_3__(params.startDate);
                _this._endDate = moment__WEBPACK_IMPORTED_MODULE_3__(params.endDate);
                if (data.locations) {
                    var _location_1 = '';
                    lodash__WEBPACK_IMPORTED_MODULE_4__["each"](data.locations, function (location) {
                        _location_1 = lodash__WEBPACK_IMPORTED_MODULE_4__["trimStart"](lodash__WEBPACK_IMPORTED_MODULE_4__["trimEnd"]((_location_1 + ', ' + location.name), ','), ',');
                    });
                    _this._locations = _location_1;
                }
                if (data.indicators) {
                    _this.searchIndicator(data.indicators, params.indicators).then(function (matchingIndicator) {
                        if (matchingIndicator.length > 0) {
                            _this._indicator = matchingIndicator[0]['label'];
                        }
                    });
                }
                /*
                 rowCount += data.size;
                this.dataSource = {
                 paginationPageSize: 50,
                 rowCount: rowCount,
                 getRows: function (params) {
                 let currentRowData = data.result.slice(params.startRow, params.endRow);
                 let lastRow = -1;
                 if (currentRowData.length <= params.endRow) {
                 lastRow = currentRowData.length;
                 }
                 params.successCallback(currentRowData, lastRow);
                 }
                 };*/
                _this.addExtraColumns(data.indicators);
            }
            _this.busyIndicator = {
                busy: false,
                message: ''
            };
        }, function (err) {
            _this.isLoading = false;
            _this.busyIndicator = {
                busy: false,
                message: ''
            };
        });
        this.overrideColumns.push({
            field: 'identifiers',
            onCellClicked: function (column) {
                _this.goTopatientInfo(column.data.patient_uuid);
            },
            cellRenderer: function (column) {
                return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
            }
        });
    };
    Moh731PatientListComponent.prototype.loadMorePatients = function () {
        this.isLoading = true;
        this.loadPatientList(this.params);
    };
    Moh731PatientListComponent.prototype.goTopatientInfo = function (patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
                '/general/general/landing-page']);
    };
    Moh731PatientListComponent.prototype.addExtraColumns = function (indicators) {
        var extraColumns = {
            enrollment_date: 'Enrollment Date',
            arv_first_regimen_start_date: 'ARVs Initial Start Date',
            cur_regimen_arv_start_date: 'Current ARV Regimen Start Date (edited)',
            cur_arv_line: 'Current ARV Line (edited)',
            cur_arv_meds: 'Current ARV Regimen',
            vl_1: 'Viral Load',
            vl_1_date: 'Viral Load Date',
            has_pending_vl_test: 'Pending Viral Load Test'
        };
        // tslint:disable-next-line
        for (var indicator in extraColumns) {
            this.extraColumns.push({
                headerName: extraColumns[indicator],
                field: indicator
            });
        }
        /*_.each(extraColumns, (indicator) => {
          this.searchIndicator(indicators, indicator).then((matchingIndicator: Array<any>) => {
            if (matchingIndicator.length > 0) {
              this.extraColumns.push({
                headerName: matchingIndicator[0]['label'],
                field: indicator
              });
            }
          });
        });*/
    };
    Moh731PatientListComponent.prototype.searchIndicator = function (indicators, trackedIndicator) {
        var matchingIndicator = lodash__WEBPACK_IMPORTED_MODULE_4__["filter"](indicators, function (_indicator) {
            var search = _indicator['indicator'];
            return search && search.match(new RegExp(trackedIndicator));
        });
        return new Promise(function (resolve) {
            resolve(matchingIndicator);
        });
    };
    return Moh731PatientListComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-base.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-base.component.ts ***!
  \******************************************************************************/
/*! exports provided: Moh731ReportBaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731ReportBaseComponent", function() { return Moh731ReportBaseComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _etl_api_moh_731_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../etl-api/moh-731-resource.service */ "./src/app/etl-api/moh-731-resource.service.ts");



// import { Observable, Subject } from 'rxjs';



var Moh731ReportBaseComponent = /** @class */ /*@__PURE__*/ (function () {
    function Moh731ReportBaseComponent(moh731Resource, route, router) {
        this.moh731Resource = moh731Resource;
        this.route = route;
        this.router = router;
        this.data = [];
        this.sectionsDef = [];
        this.statusError = false;
        this.isReleased = true;
        this.showLocationsControl = false;
        this.showIsAggregateControl = false;
        this.showPatientList = false;
        this.showTabularView = true;
        this.showPatientListLoader = false;
        this.isLoadingReport = false;
        this.showInfoMessage = false;
        this.errorMessage = '';
        this.currentView = 'pdf'; // can be pdf or tabular or patientList
        this.currentIndicator = '';
        this._startDate = moment__WEBPACK_IMPORTED_MODULE_3__().subtract(1, 'months').startOf('month').toDate();
        this._endDate = moment__WEBPACK_IMPORTED_MODULE_3__().subtract(1, 'months').endOf('month').toDate();
        this._locationUuids = [];
        this._patientListLocationUuids = [];
        this._isLegacyReport = false;
    }
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (v) {
            this._startDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (v) {
            this._endDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "locationUuids", {
        get: function () {
            return this._locationUuids;
        },
        set: function (v) {
            var locationUuids = [];
            lodash__WEBPACK_IMPORTED_MODULE_4__["each"](v, function (location) {
                if (location.value) {
                    locationUuids.push(location);
                }
            });
            this._locationUuids = locationUuids;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "patientListLocationUuids", {
        get: function () {
            return this._patientListLocationUuids;
        },
        set: function (v) {
            this._patientListLocationUuids = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "isLegacyReport", {
        get: function () {
            return this._isLegacyReport;
        },
        set: function (v) {
            this._isLegacyReport = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportBaseComponent.prototype, "isAggregated", {
        get: function () {
            return this._isAggregated;
        },
        set: function (v) {
            this._isAggregated = v;
        },
        enumerable: true,
        configurable: true
    });
    Moh731ReportBaseComponent.prototype.ngOnInit = function () {
    };
    Moh731ReportBaseComponent.prototype.generateReport = function () {
        var _this = this;
        // set busy indications variables
        // clear error
        this.showInfoMessage = false;
        this.statusError = false;
        this.errorMessage = '';
        this.isLoadingReport = true;
        this.data = [];
        this.sectionsDef = [];
        this.moh731Resource
            .getMoh731Report(this.getSelectedLocations(this.locationUuids), this.toDateString(this.startDate), this.toDateString(this.endDate), this.isLegacyReport, this.isAggregated, 1 * 60 * 1000).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (data) {
            if (data.error) {
                // if there is an error
                _this.processInfoMsg(data);
                _this.showInfoMessage = true;
            }
            else {
                _this.sectionsDef = data.sectionDefinitions;
                _this.data = data.result;
                _this.isReleased = data.isReleased;
            }
            _this.isLoadingReport = false;
        }, function (error) {
            _this.isLoadingReport = false;
            _this.errorMessage = error;
            _this.showInfoMessage = true;
        });
    };
    Moh731ReportBaseComponent.prototype.onIndicatorSelected = function (indicator) {
        var _this = this;
        this.currentIndicator = '';
        setTimeout(function () {
            if (_this.isAggregated) {
                _this.patientListLocationUuids = _this._locationUuids;
            }
            else {
                _this.patientListLocationUuids = [{
                        value: indicator.location
                    }];
            }
            _this.currentIndicator = indicator.indicator;
            _this.goToPatientList();
        }, 100);
    };
    Moh731ReportBaseComponent.prototype.goToPatientList = function () {
        if (Array.isArray(this.patientListLocationUuids) &&
            this.patientListLocationUuids.length > 0 && this.currentIndicator) {
            this.showTabularView = false;
            this.showPatientListLoader = true;
            var params = {
                startDate: this.toDateString(this.startDate),
                endDate: this.toDateString(this.endDate),
                locations: this.getSelectedLocations(this.patientListLocationUuids),
                indicators: this.currentIndicator,
                isLegacy: this.isLegacyReport
            };
            // console.log('loading pl for', this.patientListLocationUuids);
            // console.log('loading pl for', this.currentIndicator);
            this.router.navigate(['patient-list'], {
                relativeTo: this.route,
                queryParams: params
            });
        }
    };
    Moh731ReportBaseComponent.prototype.toggleMohTables = function () {
        this.showPatientList = false;
        this.showTabularView = true;
        this.showPatientListLoader = false;
        this.currentIndicator = '';
        this.patientListLocationUuids = [];
    };
    Moh731ReportBaseComponent.prototype.onLoadCompleted = function (complete) {
        this.showPatientListLoader = false;
        this.showPatientList = true;
    };
    Moh731ReportBaseComponent.prototype.onTabChanged = function (event) {
        if (event.index === 0) {
            this.currentView = 'pdf';
            if (this.pdfView && this.pdfView.generatePdf) {
                this.pdfView.generatePdf();
            }
        }
        if (event.index === 1) {
            this.currentView = 'tabular';
        }
    };
    Moh731ReportBaseComponent.prototype.getSelectedLocations = function (locationUuids) {
        if (!locationUuids || locationUuids.length === 0) {
            return '';
        }
        var selectedLocations = '';
        for (var i = 0; i < locationUuids.length; i++) {
            if (i === 0) {
                selectedLocations = selectedLocations + locationUuids[0].value;
            }
            else {
                selectedLocations = selectedLocations + ',' + locationUuids[i].value;
            }
        }
        return selectedLocations;
    };
    Moh731ReportBaseComponent.prototype.toDateString = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_3__(date).utcOffset('+03:00').format();
    };
    Moh731ReportBaseComponent.prototype.processInfoMsg = function (message, isEmpty) {
        if (isEmpty === void 0) {
            isEmpty = false;
        }
        if (message.error === 404 || isEmpty) {
            // this.errorMessage =
            // 'The MOH 731 Report cannot be viewed at the moment, awaiting M & E verification';
            // this.statusError = true;
        }
        else {
            this.errorMessage = 'There was a problem generating MOH 731 Report';
        }
    };
    return Moh731ReportBaseComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.css.shim.ngstyle.js":
/*!**************************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.css.shim.ngstyle.js ***!
  \**************************************************************************************************/
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

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ngfactory.js":
/*!*******************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ngfactory.js ***!
  \*******************************************************************************************/
/*! exports provided: RenderType_Moh731ReportFiltersComponent, View_Moh731ReportFiltersComponent_0, View_Moh731ReportFiltersComponent_Host_0, Moh731ReportFiltersComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_Moh731ReportFiltersComponent", function() { return RenderType_Moh731ReportFiltersComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731ReportFiltersComponent_0", function() { return View_Moh731ReportFiltersComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731ReportFiltersComponent_Host_0", function() { return View_Moh731ReportFiltersComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731ReportFiltersComponentNgFactory", function() { return Moh731ReportFiltersComponentNgFactory; });
/* harmony import */ var _moh_731_report_filters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moh-731-report-filters.component.css.shim.ngstyle */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.css.shim.ngstyle.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/locations/location-filter/location-filter.component.ngfactory */ "./src/app/shared/locations/location-filter/location-filter.component.ngfactory.js");
/* harmony import */ var _shared_locations_location_filter_location_filter_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/locations/location-filter/location-filter.component */ "./src/app/shared/locations/location-filter/location-filter.component.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _moh_731_report_filters_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./moh-731-report-filters.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _moh_731_report_filters.component.css.shim.ngstyle,_angular_core,_angular_forms,_angular_common,_.._shared_locations_location_filter_location_filter.component.ngfactory,_.._shared_locations_location_filter_location_filter.component,_.._openmrs_api_location_resource.service,_moh_731_report_filters.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _moh_731_report_filters.component.css.shim.ngstyle,_angular_core,_angular_forms,_angular_common,_.._shared_locations_location_filter_location_filter.component.ngfactory,_.._shared_locations_location_filter_location_filter.component,_.._openmrs_api_location_resource.service,_moh_731_report_filters.component PURE_IMPORTS_END */








var styles_Moh731ReportFiltersComponent = [_moh_731_report_filters_component_css_shim_ngstyle__WEBPACK_IMPORTED_MODULE_0__["styles"]];
var RenderType_Moh731ReportFiltersComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵcrt"]({ encapsulation: 0, styles: styles_Moh731ReportFiltersComponent, data: {} });

function View_Moh731ReportFiltersComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-chevron-down"]], null, null, null, null, null))], null, null); }
function View_Moh731ReportFiltersComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-chevron-up"]], null, null, null, null, null))], null, null); }
function View_Moh731ReportFiltersComponent_4(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 8, "div", [["class", "form-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "label", [["for", "startDate"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Start Date"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 5, "input", [["class", "form-control"], ["id", "startDate"], ["type", "date"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("input" === en)) {
                var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._handleInput($event.target.value) !== false);
                ad = (pd_0 && ad);
            }
            if (("blur" === en)) {
                var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onTouched() !== false);
                ad = (pd_1 && ad);
            }
            if (("compositionstart" === en)) {
                var pd_2 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionStart() !== false);
                ad = (pd_2 && ad);
            }
            if (("compositionend" === en)) {
                var pd_3 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionEnd($event.target.value) !== false);
                ad = (pd_3 && ad);
            }
            if (("ngModelChange" === en)) {
                var pd_4 = ((_co.startDateString = $event) !== false);
                ad = (pd_4 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"]]], null, null)], function (_ck, _v) { var _co = _v.component; var currVal_7 = _co.startDateString; _ck(_v, 6, 0, currVal_7); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassUntouched; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassTouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPristine; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassDirty; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassValid; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassInvalid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPending; _ck(_v, 3, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); });
}
function View_Moh731ReportFiltersComponent_5(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 8, "div", [["class", "form-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "label", [["for", "endDate"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["End Date"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 5, "input", [["class", "form-control"], ["id", "endDate"], ["type", "date"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("input" === en)) {
                var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._handleInput($event.target.value) !== false);
                ad = (pd_0 && ad);
            }
            if (("blur" === en)) {
                var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onTouched() !== false);
                ad = (pd_1 && ad);
            }
            if (("compositionstart" === en)) {
                var pd_2 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionStart() !== false);
                ad = (pd_2 && ad);
            }
            if (("compositionend" === en)) {
                var pd_3 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionEnd($event.target.value) !== false);
                ad = (pd_3 && ad);
            }
            if (("ngModelChange" === en)) {
                var pd_4 = ((_co.endDateString = $event) !== false);
                ad = (pd_4 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"]]], null, null)], function (_ck, _v) { var _co = _v.component; var currVal_7 = _co.endDateString; _ck(_v, 6, 0, currVal_7); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassUntouched; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassTouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPristine; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassDirty; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassValid; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassInvalid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPending; _ck(_v, 3, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); });
}
function View_Moh731ReportFiltersComponent_6(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 8, "div", [["class", "form-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "label", [["for", "month"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Month:"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 5, "input", [["class", "form-control"], ["id", "month"], ["type", "month"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("input" === en)) {
                var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._handleInput($event.target.value) !== false);
                ad = (pd_0 && ad);
            }
            if (("blur" === en)) {
                var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4).onTouched() !== false);
                ad = (pd_1 && ad);
            }
            if (("compositionstart" === en)) {
                var pd_2 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionStart() !== false);
                ad = (pd_2 && ad);
            }
            if (("compositionend" === en)) {
                var pd_3 = (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 4)._compositionEnd($event.target.value) !== false);
                ad = (pd_3 && ad);
            }
            if (("ngModelChange" === en)) {
                var pd_4 = ((_co.monthString = $event) !== false);
                ad = (pd_4 && ad);
            }
            return ad;
        }, null, null)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](4, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], [2, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["COMPOSITION_BUFFER_MODE"]]], null, null), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](1024, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](6, 671744, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"], [[8, null], [8, null], [8, null], [6, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"]]], { model: [0, "model"] }, { update: "ngModelChange" }), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵprd"](2048, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"], null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](8, 16384, null, 0, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], [[4, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControl"]]], null, null)], function (_ck, _v) { var _co = _v.component; var currVal_7 = _co.monthString; _ck(_v, 6, 0, currVal_7); }, function (_ck, _v) { var currVal_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassUntouched; var currVal_1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassTouched; var currVal_2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPristine; var currVal_3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassDirty; var currVal_4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassValid; var currVal_5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassInvalid; var currVal_6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵnov"](_v, 8).ngClassPending; _ck(_v, 3, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); });
}
function View_Moh731ReportFiltersComponent_7(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 3, "div", [["class", "form-row"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "label", [["for", "isAggregate"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Aggregate Locations"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 0, "input", [["id", "isAggregate"], ["name", "aggregated"], ["type", "checkbox"]], [[8, "checked", 0]], [[null, "change"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("change" === en)) {
                var pd_0 = ((_co.isAggregated = !_co.isAggregated) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isAggregated; _ck(_v, 3, 0, currVal_0); });
}
function View_Moh731ReportFiltersComponent_3(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 18, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 8, "div", [["class", "col-xs-2"], ["style", "padding: 4px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 2, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 1, "label", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Version"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 4, "div", [["class", "btn-group-vertical"], ["role", "group"], ["style", "width: 99%;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](6, 0, null, null, 1, "button", [["class", "btn"], ["type", "button"]], [[2, "btn-default", null], [2, "btn-primary", null]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.changeIsLegacyValue(true) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Blue Card 731"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](8, 0, null, null, 1, "button", [["class", "btn"], ["type", "button"]], [[2, "btn-default", null], [2, "btn-primary", null]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.changeIsLegacyValue(false) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Green Card 731"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 8, "div", [["class", "col-xs-10"], ["style", "padding: 4px;border-left: 4px solid lightgray"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_4)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_5)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_6)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](16, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_7)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](18, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_4 = !_co.isMonthMode; _ck(_v, 12, 0, currVal_4); var currVal_5 = !_co.isMonthMode; _ck(_v, 14, 0, currVal_5); var currVal_6 = _co.isMonthMode; _ck(_v, 16, 0, currVal_6); var currVal_7 = _co.showIsAggregateControl; _ck(_v, 18, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.isLegacyVersion; var currVal_1 = _co.isLegacyVersion; _ck(_v, 6, 0, currVal_0, currVal_1); var currVal_2 = _co.isLegacyVersion; var currVal_3 = !_co.isLegacyVersion; _ck(_v, 8, 0, currVal_2, currVal_3); });
}
function View_Moh731ReportFiltersComponent_8(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 2, "div", [["class", "row"], ["style", "padding: 0px; border: 1px double lightgray"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 1, "location-filter", [], null, [[null, "onLocationChange"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("onLocationChange" === en)) {
                var pd_0 = (_co.onLocationsSelected($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_LocationFilterComponent_0"], _shared_locations_location_filter_location_filter_component_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_LocationFilterComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](2, 4308992, null, 0, _shared_locations_location_filter_location_filter_component__WEBPACK_IMPORTED_MODULE_5__["LocationFilterComponent"], [_openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_6__["LocationResourceService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]], { multiple: [0, "multiple"], locationUuids: [1, "locationUuids"] }, { onLocationChange: "onLocationChange" })], function (_ck, _v) { var _co = _v.component; var currVal_0 = true; var currVal_1 = _co.locationUuids; _ck(_v, 2, 0, currVal_0, currVal_1); }, null);
}
function View_Moh731ReportFiltersComponent_9(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "button", [["class", "btn btn-primary pull-right"], ["type", "button"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.onClickedGenerate() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Generate Report"]))], null, null);
}
function View_Moh731ReportFiltersComponent_10(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "span", [["class", "pull-right"], ["style", "font-weight: bold; color: gray"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, ["Loading report.."]))], null, null); }
function View_Moh731ReportFiltersComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](2, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 19, "div", [["class", "container-fluid"], ["style", "margin-top: 4px; margin-bottom: 4px"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](1, 0, null, null, 8, "div", [["class", "row"], ["style", "padding: 0px; border: 1px double lightgray; border-bottom: 0px; cursor: pointer;"]], null, [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = ((_co.filterCollapsed = !_co.filterCollapsed) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](2, 0, null, null, 2, "span", [["class", "text-info"], ["style", "margin:2px; font-weight:bold;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](3, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-filter"], ["style", "font-weight: normal;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵted"](-1, null, [" Report filters"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](5, 0, null, null, 4, "span", [["class", "label label-default pull-right"], ["style", "margin:2px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](7, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](9, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](10, 0, null, null, 2, "div", [["class", "row"], ["style", "padding: 0px; border: 1px double lightgray"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_3)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](12, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_8)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](14, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](15, 0, null, null, 4, "div", [["class", "row"], ["style", "margin-top: 4px; padding: 0px;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_9)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](17, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵand"](16777216, null, null, 1, null, View_Moh731ReportFiltersComponent_10)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](19, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.filterCollapsed; _ck(_v, 7, 0, currVal_0); var currVal_1 = _co.filterCollapsed; _ck(_v, 9, 0, currVal_1); var currVal_2 = !_co.filterCollapsed; _ck(_v, 12, 0, currVal_2); var currVal_3 = _co.showLocationsControl; _ck(_v, 14, 0, currVal_3); var currVal_4 = !_co.parentIsBusy; _ck(_v, 17, 0, currVal_4); var currVal_5 = _co.parentIsBusy; _ck(_v, 19, 0, currVal_5); }, null);
}
function View_Moh731ReportFiltersComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵeld"](0, 0, null, null, 1, "moh-731-report-filters", [], null, null, null, View_Moh731ReportFiltersComponent_0, RenderType_Moh731ReportFiltersComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵdid"](1, 114688, null, 0, _moh_731_report_filters_component__WEBPACK_IMPORTED_MODULE_7__["Moh731ReportFiltersComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var Moh731ReportFiltersComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵccf"]("moh-731-report-filters", _moh_731_report_filters_component__WEBPACK_IMPORTED_MODULE_7__["Moh731ReportFiltersComponent"], View_Moh731ReportFiltersComponent_Host_0, { locationUuids: "locationUuids", parentIsBusy: "parentIsBusy", isMonthMode: "isMonthMode", showIsAggregateControl: "showIsAggregateControl", showLocationsControl: "showLocationsControl", startDate: "startDate", endDate: "endDate", month: "month", isAggregated: "isAggregated", isLegacyVersion: "isLegacyVersion" }, { generateReport: "generateReport", startDateChange: "startDateChange", endDateChange: "endDateChange", isLegacyVersionChange: "isLegacyVersionChange", isAggregatedChange: "isAggregatedChange", locationUuidsChange: "locationUuidsChange" }, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-filters.component.ts ***!
  \*********************************************************************************/
/*! exports provided: Moh731ReportFiltersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731ReportFiltersComponent", function() { return Moh731ReportFiltersComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);


var Moh731ReportFiltersComponent = /** @class */ /*@__PURE__*/ (function () {
    function Moh731ReportFiltersComponent() {
        this.generateReport = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.startDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.endDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isLegacyVersionChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isAggregatedChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.locationUuids = [];
        this.locationUuidsChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.parentIsBusy = false;
        this.isMonthMode = true;
        this._showIsAggregateControl = false;
        this._showLocationsControl = false;
        this._isLegacyVersion = true;
    }
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "showIsAggregateControl", {
        get: function () {
            return this._showIsAggregateControl;
        },
        set: function (v) {
            this._showIsAggregateControl = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "showLocationsControl", {
        get: function () {
            return this._showLocationsControl;
        },
        set: function (v) {
            this._showLocationsControl = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (v) {
            // console.log('changing date', v);
            this._startDate = v;
            this._month = v;
            this.startDateChange.emit(this.startDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "startDateString", {
        get: function () {
            return this.startDate ? moment__WEBPACK_IMPORTED_MODULE_1__(this.startDate).format('YYYY-MM-DD') : null;
        },
        set: function (v) {
            this.startDate = new Date(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "endDateString", {
        get: function () {
            return this.endDate ? moment__WEBPACK_IMPORTED_MODULE_1__(this.endDate).format('YYYY-MM-DD') : null;
        },
        set: function (v) {
            this.endDate = new Date(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (v) {
            // console.log('changing date', v);
            this._endDate = v;
            this._month = v;
            this.endDateChange.emit(this.endDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "monthString", {
        get: function () {
            return this.month ? moment__WEBPACK_IMPORTED_MODULE_1__(this.month).format('YYYY-MM') : null;
        },
        set: function (v) {
            console.log('set-month', v);
            this.month = new Date(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "month", {
        get: function () {
            return this._month;
        },
        set: function (v) {
            // console.log('changing date', v);
            this._month = v;
            this.startDate = moment__WEBPACK_IMPORTED_MODULE_1__(this._month).startOf('month').toDate();
            this.endDate = moment__WEBPACK_IMPORTED_MODULE_1__(this._month).endOf('month').toDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "isAggregated", {
        get: function () {
            return this._isAggregated;
        },
        set: function (v) {
            this._isAggregated = v;
            this.isAggregatedChange.emit(this.isAggregated);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Moh731ReportFiltersComponent.prototype, "isLegacyVersion", {
        get: function () {
            return this._isLegacyVersion;
        },
        set: function (v) {
            this._isLegacyVersion = v;
            this.isLegacyVersionChange.emit(this.isLegacyVersion);
        },
        enumerable: true,
        configurable: true
    });
    Moh731ReportFiltersComponent.prototype.ngOnInit = function () { };
    Moh731ReportFiltersComponent.prototype.onClickedGenerate = function () {
        this.generateReport.emit();
    };
    Moh731ReportFiltersComponent.prototype.changeIsLegacyValue = function (val) {
        this.isLegacyVersion = val;
    };
    Moh731ReportFiltersComponent.prototype.onLocationsSelected = function (val) {
        if (val) {
            this.locationUuidsChange.emit(val.locations);
        }
    };
    return Moh731ReportFiltersComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ngfactory.js":
/*!********************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ngfactory.js ***!
  \********************************************************************************************/
/*! exports provided: RenderType_MOHReportComponent, View_MOHReportComponent_0, View_MOHReportComponent_Host_0, MOHReportComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_MOHReportComponent", function() { return RenderType_MOHReportComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_MOHReportComponent_0", function() { return View_MOHReportComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_MOHReportComponent_Host_0", function() { return View_MOHReportComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOHReportComponentNgFactory", function() { return MOHReportComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ng2_pdf_viewer_ng2_pdf_viewer_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/ng2-pdf-viewer/ng2-pdf-viewer.ngfactory */ "./node_modules/ng2-pdf-viewer/ng2-pdf-viewer.ngfactory.js");
/* harmony import */ var ng2_pdf_viewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng2-pdf-viewer */ "./node_modules/ng2-pdf-viewer/ng2-pdf-viewer.es5.js");
/* harmony import */ var _moh_731_report_pdf_view_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./moh-731-report-pdf-view.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ts");
/* harmony import */ var _moh_731_report_pdf_view_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./moh-731-report-pdf-view.service */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.service.ts");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._node_modules_ng2_pdf_viewer_ng2_pdf_viewer.ngfactory,ng2_pdf_viewer,_moh_731_report_pdf_view.component,_moh_731_report_pdf_view.service,_.._openmrs_api_location_resource.service,_angular_platform_browser PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._node_modules_ng2_pdf_viewer_ng2_pdf_viewer.ngfactory,ng2_pdf_viewer,_moh_731_report_pdf_view.component,_moh_731_report_pdf_view.service,_.._openmrs_api_location_resource.service,_angular_platform_browser PURE_IMPORTS_END */








var styles_MOHReportComponent = [];
var RenderType_MOHReportComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_MOHReportComponent, data: {} });

function View_MOHReportComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "alert alert-warning"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Viewing a Draft Version of the MOH 731 Report. "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" This report is not officially released, and is likely to change without warning.\n"]))], null, null); }
function View_MOHReportComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_MOHReportComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 19, "div", [["class", "wrapper"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 18, "div", [["class", "panel panel-info"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 7, "div", [["class", "panel-heading"], ["style", "min-height: 50px!important"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](5, 0, null, null, 6, "strong", [["class", "text-primary"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](6, 0, null, null, 0, "span", [["class", "fa fa-file-pdf-o"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" MOH 731 Report "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](8, 0, null, null, 3, "div", [["class", "btn-group pull-right"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](9, 0, null, null, 2, "button", [["class", "btn btn-primary"]], [[8, "disabled", 0]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.downloadPdf() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](10, 0, null, null, 0, "i", [["class", "fa fa-download"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Download Pdf "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](12, 0, null, null, 2, "div", [["class", "panel-body"], ["style", "background-color: #ECF0F5"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](13, 0, null, null, 1, "pdf-viewer", [["style", "display: block;"]], null, [[null, "after-load-complete"], ["window", "resize"], [null, "pagerendered"], [null, "textlayerrendered"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("window:resize" === en)) {
                var pd_0 = (_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 14).onPageResize() !== false);
                ad = (pd_0 && ad);
            }
            if (("pagerendered" === en)) {
                var pd_1 = (_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 14).onPageRendered($event) !== false);
                ad = (pd_1 && ad);
            }
            if (("textlayerrendered" === en)) {
                var pd_2 = (_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵnov"](_v, 14).onTextLayerRendered($event) !== false);
                ad = (pd_2 && ad);
            }
            if (("after-load-complete" === en)) {
                var pd_3 = (_co.afterLoadCompletes($event) !== false);
                ad = (pd_3 && ad);
            }
            return ad;
        }, _node_modules_ng2_pdf_viewer_ng2_pdf_viewer_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_PdfViewerComponent_0"], _node_modules_ng2_pdf_viewer_ng2_pdf_viewer_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_PdfViewerComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](14, 770048, null, 0, ng2_pdf_viewer__WEBPACK_IMPORTED_MODULE_3__["PdfViewerComponent"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]], { src: [0, "src"], page: [1, "page"], renderText: [2, "renderText"], originalSize: [3, "originalSize"], showAll: [4, "showAll"] }, { afterLoadComplete: "after-load-complete" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](15, 0, null, null, 6, "div", [["class", "panel-footer"], ["style", "min-height: 50px"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](16, 0, null, null, 2, "button", [["class", "btn btn-default pull-left"]], [[8, "disabled", 0]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.prevPage() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](17, 0, null, null, 0, "i", [["class", "fa fa-arrow-circle-o-left"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Previous Page "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](19, 0, null, null, 2, "button", [["class", "btn btn-default pull-right"]], [[8, "disabled", 0]], [[null, "click"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("click" === en)) {
                var pd_0 = (_co.nextPage() !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Next Page "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](21, 0, null, null, 0, "i", [["class", "fa fa-arrow-circle-o-right"]], null, null, null, null, null))], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.isReleased; _ck(_v, 1, 0, currVal_0); var currVal_2 = _co.pdfSrc; var currVal_3 = _co.page; var currVal_4 = false; var currVal_5 = false; var currVal_6 = false; _ck(_v, 14, 0, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); }, function (_ck, _v) { var _co = _v.component; var currVal_1 = !_co.pdfMakeProxy; _ck(_v, 9, 0, currVal_1); var currVal_7 = (!_co.pdfMakeProxy || (_co.page < 2)); _ck(_v, 16, 0, currVal_7); var currVal_8 = (!_co.pdfMakeProxy || (_co.page >= _co.numberOfPages)); _ck(_v, 19, 0, currVal_8); });
}
function View_MOHReportComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "moh-731-pdf", [], null, null, null, View_MOHReportComponent_0, RenderType_MOHReportComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 245760, null, 0, _moh_731_report_pdf_view_component__WEBPACK_IMPORTED_MODULE_4__["MOHReportComponent"], [_moh_731_report_pdf_view_service__WEBPACK_IMPORTED_MODULE_5__["MOHReportService"], _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_6__["LocationResourceService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["DomSanitizer"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var MOHReportComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("moh-731-pdf", _moh_731_report_pdf_view_component__WEBPACK_IMPORTED_MODULE_4__["MOHReportComponent"], View_MOHReportComponent_Host_0, { isAggregated: "isAggregated", selectedLocations: "selectedLocations", sectionsDef: "sectionsDef", startDate: "startDate", endDate: "endDate", isReleased: "isReleased", data: "data" }, {}, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.component.ts ***!
  \**********************************************************************************/
/*! exports provided: MOHReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOHReportComponent", function() { return MOHReportComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _moh_731_report_pdf_view_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./moh-731-report-pdf-view.service */ "./src/app/hiv-care-lib/moh-731-report/moh-731-report-pdf-view.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _openmrs_api_location_resource_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../openmrs-api/location-resource.service */ "./src/app/openmrs-api/location-resource.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);







var MOHReportComponent = /** @class */ /*@__PURE__*/ (function () {
    function MOHReportComponent(mohReportService, locationResourceService, domSanitizer) {
        this.mohReportService = mohReportService;
        this.locationResourceService = locationResourceService;
        this.domSanitizer = domSanitizer;
        this.pdfSrc = null;
        this.page = 1;
        this.isBusy = false;
        this.pdfProxy = null;
        this.pdfMakeProxy = null;
        this.errorFlag = false;
        this.locations = [];
        this.numberOfPages = 0;
        this.stack = [];
        this.isAggregated = false;
    }
    Object.defineProperty(MOHReportComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            if (value) {
                // console.log('data',value);
                this.mohReports = value;
                this._data = value;
                this.endDate = moment__WEBPACK_IMPORTED_MODULE_6__(this.endDate).format('DD-MM-YYYY');
                this.startDate = moment__WEBPACK_IMPORTED_MODULE_6__(this.startDate).format('DD-MM-YYYY');
                this.sectionDefinitions = this.sectionsDef;
                this.resolveLationParams();
            }
        },
        enumerable: true,
        configurable: true
    });
    MOHReportComponent.prototype.ngOnInit = function () {
    };
    MOHReportComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    MOHReportComponent.prototype.generatePdf = function () {
        this.resolveLationParams();
    };
    MOHReportComponent.prototype.generateMoh731ByLocation = function (params, rowData, sectionDefinitions) {
        var _this = this;
        if (params && rowData && sectionDefinitions) {
            this.isBusy = true;
            // console.log('making pdf', rowData);
            this.mohReportService.generatePdf(params, rowData, sectionDefinitions).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (pdf) {
                _this.pdfSrc = pdf.pdfSrc;
                _this.pdfMakeProxy = pdf.pdfProxy;
                _this.securedUrl = _this.domSanitizer.bypassSecurityTrustResourceUrl(_this.pdfSrc);
                _this.isBusy = false;
            }, function (err) {
                console.error(err);
                _this.errorFlag = true;
                _this.isBusy = false;
            });
        }
    };
    MOHReportComponent.prototype.afterLoadCompletes = function (pdf) {
        this.numberOfPages = pdf.numPages;
        this.pdfProxy = pdf;
    };
    MOHReportComponent.prototype.printMohReport = function () {
        this.pdfMakeProxy.print();
    };
    MOHReportComponent.prototype.downloadPdf = function () {
        this.pdfMakeProxy
            .download(('moh_731_report') + '.pdf');
    };
    MOHReportComponent.prototype.nextPage = function () {
        this.page++;
    };
    MOHReportComponent.prototype.prevPage = function () {
        this.page--;
    };
    MOHReportComponent.prototype.resolveLationParams = function () {
        var _this = this;
        this.isBusy = true;
        this.locationResourceService.getLocations().subscribe(function (locations) {
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < locations.length; i++) {
                if (locations[i]) {
                    // add district,facility and county details
                    var stateProvince = locations[i].stateProvince;
                    var district = locations[i].countyDistrict;
                    district = district ? district : 'N/A';
                    stateProvince = stateProvince ? stateProvince : 'N/A';
                    var details = {
                        district: district,
                        county: stateProvince,
                        facility: locations[i].name,
                        facilityName: locations[i].name
                    };
                    _this.locations[locations[i].uuid] = details;
                }
            }
            _this.moh731Report(_this.mohReports, _this.sectionDefinitions);
        }, function (error) {
            console.error(error);
        });
    };
    MOHReportComponent.prototype.moh731Report = function (reportsData, sectionDefinitions) {
        var _this = this;
        if (Array.isArray(reportsData) && reportsData.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            // for (let i = 0; i < reportsData.length; i++) {
            var paramsArray = this.getLocationHeaders(reportsData);
            var rowsArray = this.getJoinLocations(reportsData);
            this.mohReportService.generateMultiplePdfs(paramsArray, rowsArray, sectionDefinitions).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (pdf) {
                _this.pdfSrc = pdf.pdfSrc;
                _this.pdfMakeProxy = pdf.pdfProxy;
                _this.securedUrl =
                    _this.domSanitizer.bypassSecurityTrustResourceUrl(_this.pdfSrc);
                _this.isBusy = false;
            }, function (err) {
                console.error(err);
                _this.errorFlag = true;
                _this.isBusy = false;
            });
        }
    };
    MOHReportComponent.prototype.getJoinLocations = function (reportsData) {
        var rowsArray = [];
        reportsData.forEach(function (element) {
            if (element.join_location) {
                rowsArray.push(element);
            }
        });
        return rowsArray;
    };
    MOHReportComponent.prototype.getLocationHeaders = function (reportDataArray) {
        var _this = this;
        var paramsArray = [];
        reportDataArray.forEach(function (element) {
            if (element.location_uuid) {
                paramsArray.push(_this.getParams(element.location_uuid));
            }
        });
        // process location aggregation
        if (this.isAggregated) {
            var aggregatedLocationsHeader = {
                facilityName: '',
                facility: '',
                district: '',
                county: '',
                startDate: this.startDate,
                endDate: this.endDate,
                location_uuid: '',
                location_name: ''
            };
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < this.selectedLocations.length; i++) {
                if (this.selectedLocations[i].value) {
                    var p = this.getParams(this.selectedLocations[i].value);
                    if (aggregatedLocationsHeader.facilityName.indexOf(p.facilityName) < 0) {
                        aggregatedLocationsHeader.facilityName =
                            aggregatedLocationsHeader.facilityName +
                                (aggregatedLocationsHeader.facilityName.length === 0 ? '' : ', ') +
                                p.facilityName;
                    }
                    if (aggregatedLocationsHeader.facility.indexOf(p.facility) < 0) {
                        aggregatedLocationsHeader.facility =
                            aggregatedLocationsHeader.facility +
                                (aggregatedLocationsHeader.facility.length === 0 ? '' : ', ') +
                                p.facility;
                    }
                    if (aggregatedLocationsHeader.district.indexOf(p.district) < 0) {
                        aggregatedLocationsHeader.district =
                            aggregatedLocationsHeader.district +
                                (aggregatedLocationsHeader.district.length === 0 ? '' : ', ') +
                                p.district;
                    }
                    if (aggregatedLocationsHeader.county.indexOf(p.county) < 0) {
                        aggregatedLocationsHeader.county =
                            aggregatedLocationsHeader.county +
                                (aggregatedLocationsHeader.county.length === 0 ? '' : ', ') +
                                p.county;
                    }
                    if (aggregatedLocationsHeader.location_name.indexOf(p.location_name) < 0) {
                        aggregatedLocationsHeader.location_name =
                            aggregatedLocationsHeader.location_name +
                                (aggregatedLocationsHeader.location_name.length === 0 ? '' : ', ') +
                                p.location_name;
                    }
                    if (aggregatedLocationsHeader.location_uuid.indexOf(p.location_uuid) < 0) {
                        aggregatedLocationsHeader.location_uuid =
                            aggregatedLocationsHeader.location_uuid +
                                (aggregatedLocationsHeader.location_uuid.length === 0 ? '' : ', ') +
                                p.location_uuid;
                    }
                }
            }
            paramsArray = [aggregatedLocationsHeader];
        }
        return paramsArray;
    };
    MOHReportComponent.prototype.getParams = function (locationUid) {
        var locationDetails = this.getLocationResolved(locationUid);
        var params;
        if (locationDetails) {
            params = {
                facilityName: locationDetails.facilityName,
                facility: locationDetails.facility,
                district: locationDetails.district,
                county: locationDetails.county,
                startDate: this.startDate,
                endDate: this.endDate,
                location_uuid: locationDetails.uuid,
                location_name: locationDetails.name
            };
        }
        return params;
    };
    MOHReportComponent.prototype.getLocationResolved = function (locationUuid) {
        if (locationUuid && this.locations) {
            if (this.locations[locationUuid]) {
                return this.locations[locationUuid];
            }
            else {
                return null;
            }
        }
        return null;
    };
    return MOHReportComponent;
}());



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ngfactory.js":
/*!************************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ngfactory.js ***!
  \************************************************************************************/
/*! exports provided: RenderType_Moh731TabularComponent, View_Moh731TabularComponent_0, View_Moh731TabularComponent_Host_0, Moh731TabularComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_Moh731TabularComponent", function() { return RenderType_Moh731TabularComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731TabularComponent_0", function() { return View_Moh731TabularComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_Moh731TabularComponent_Host_0", function() { return View_Moh731TabularComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731TabularComponentNgFactory", function() { return Moh731TabularComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _moh_731_tabular_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./moh-731-tabular.component */ "./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_moh_731_tabular.component PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_angular_common,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_moh_731_tabular.component PURE_IMPORTS_END */








var styles_Moh731TabularComponent = [];
var RenderType_Moh731TabularComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_Moh731TabularComponent, data: {} });

function View_Moh731TabularComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "alert alert-warning"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "strong", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Viewing a draft Version of the MOH 731 Report. "])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" This report is not officially released, and is likely to change without warning.\n"]))], null, null); }
function View_Moh731TabularComponent_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](402653184, 1, { agGrid: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_Moh731TabularComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](2, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 200px;"]], null, null, null, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_2__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_2__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_4__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](6, 4898816, [[1, 4], ["agGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_6__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_3__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"] }, null), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { columns: 1 })], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.isReleased; _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.gridOptions; var currVal_2 = _co.data; _ck(_v, 6, 0, currVal_1, currVal_2); }, null); }
function View_Moh731TabularComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "moh-731-tabular", [], null, null, null, View_Moh731TabularComponent_0, RenderType_Moh731TabularComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _moh_731_tabular_component__WEBPACK_IMPORTED_MODULE_7__["Moh731TabularComponent"], [], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var Moh731TabularComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("moh-731-tabular", _moh_731_tabular_component__WEBPACK_IMPORTED_MODULE_7__["Moh731TabularComponent"], View_Moh731TabularComponent_Host_0, { data: "rowData", sectionDefs: "sectionDefs", isReleased: "isReleased" }, { indicatorSelected: "indicatorSelected" }, []);



/***/ }),

/***/ "./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/hiv-care-lib/moh-731-report/moh-731-tabular.component.ts ***!
  \**************************************************************************/
/*! exports provided: Moh731TabularComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Moh731TabularComponent", function() { return Moh731TabularComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_1__);


var Moh731TabularComponent = /** @class */ /*@__PURE__*/ (function () {
    function Moh731TabularComponent() {
        this.gridOptions = {
            columnDefs: []
        };
        this.indicatorSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        // tslint:disable-next-line:no-input-rename
        this.data = [];
    }
    Object.defineProperty(Moh731TabularComponent.prototype, "sectionDefs", {
        get: function () {
            return this._sectionDefs;
        },
        set: function (v) {
            // console.log('changing section def', v);
            this._sectionDefs = v;
            this.setColumns(v);
        },
        enumerable: true,
        configurable: true
    });
    Moh731TabularComponent.prototype.ngOnInit = function () {
        this.setCellSelection();
    };
    Moh731TabularComponent.prototype.setColumns = function (sectionsData) {
        var defs = [];
        defs.push({
            headerName: 'Location',
            field: 'location',
            pinned: 'left'
        });
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < sectionsData.length; i++) {
            var section = sectionsData[i];
            var created = {};
            created.headerName = section.sectionTitle;
            created.children = [];
            // tslint:disable-next-line:prefer-for-of
            for (var j = 0; j < section.indicators.length; j++) {
                var child = {
                    headerName: section.indicators[j].label,
                    field: section.indicators[j].indicator
                };
                created.children.push(child);
            }
            defs.push(created);
        }
        this.gridOptions.columnDefs = defs;
        if (this.agGrid && this.agGrid.api) {
            this.agGrid.api.setColumnDefs(defs);
        }
    };
    Moh731TabularComponent.prototype.setCellSelection = function () {
        var _this = this;
        this.gridOptions.rowSelection = 'single';
        this.gridOptions.onCellClicked = function (e) {
            if (e.data.location_uuid) {
                var selectedIndicator = {
                    indicator: e.colDef.field,
                    value: e.value,
                    location: e.data.location_uuid
                };
                _this.indicatorSelected.emit(selectedIndicator);
            }
        };
    };
    return Moh731TabularComponent;
}());



/***/ })

}]);