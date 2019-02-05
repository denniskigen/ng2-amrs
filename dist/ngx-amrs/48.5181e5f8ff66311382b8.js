(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[48],{

/***/ "./src/app/clinic-dashboard/referral/patient-referral-program.module.ts":
/*!******************************************************************************!*\
  !*** ./src/app/clinic-dashboard/referral/patient-referral-program.module.ts ***!
  \******************************************************************************/
/*! exports provided: PatientReferralProgramModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralProgramModule", function() { return PatientReferralProgramModule; });
var PatientReferralProgramModule = /** @class */ /*@__PURE__*/ (function () {
    function PatientReferralProgramModule() {
    }
    return PatientReferralProgramModule;
}());



/***/ }),

/***/ "./src/app/clinic-dashboard/referral/patient-referral.component.ngfactory.js":
/*!***********************************************************************************!*\
  !*** ./src/app/clinic-dashboard/referral/patient-referral.component.ngfactory.js ***!
  \***********************************************************************************/
/*! exports provided: RenderType_PatientReferralComponent, View_PatientReferralComponent_0, View_PatientReferralComponent_Host_0, PatientReferralComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_PatientReferralComponent", function() { return RenderType_PatientReferralComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_PatientReferralComponent_0", function() { return View_PatientReferralComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_PatientReferralComponent_Host_0", function() { return View_PatientReferralComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralComponentNgFactory", function() { return PatientReferralComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/report-filters/report-filters.component.ngfactory */ "./src/app/shared/report-filters/report-filters.component.ngfactory.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/report-filters/report-filters.component */ "./src/app/shared/report-filters/report-filters.component.ts");
/* harmony import */ var _etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../etl-api/indicator-resource.service */ "./src/app/etl-api/indicator-resource.service.ts");
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");
/* harmony import */ var _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../openmrs-api/program-resource.service */ "./src/app/openmrs-api/program-resource.service.ts");
/* harmony import */ var _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../openmrs-api/program-workflow-resource.service */ "./src/app/openmrs-api/program-workflow-resource.service.ts");
/* harmony import */ var _program_manager_program_referral_report_base_patient_referral_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../program-manager/program-referral-report-base/patient-referral-tabular.component.ngfactory */ "./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ngfactory.js");
/* harmony import */ var _program_manager_program_referral_report_base_patient_referral_tabular_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../program-manager/program-referral-report-base/patient-referral-tabular.component */ "./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");
/* harmony import */ var _patient_referral_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./patient-referral.component */ "./src/app/clinic-dashboard/referral/patient-referral.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._shared_report_filters_report_filters.component,_.._etl_api_indicator_resource.service,_.._data_analytics_dashboard_services_data_analytics_dashboard.services,_.._openmrs_api_program_resource.service,_.._openmrs_api_program_workflow_resource.service,_.._program_manager_program_referral_report_base_patient_referral_tabular.component.ngfactory,_.._program_manager_program_referral_report_base_patient_referral_tabular.component,_angular_router,_.._etl_api_patient_referral_resource.service,_patient_referral.component,_angular_common PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._shared_report_filters_report_filters.component.ngfactory,_angular_forms,_.._shared_report_filters_report_filters.component,_.._etl_api_indicator_resource.service,_.._data_analytics_dashboard_services_data_analytics_dashboard.services,_.._openmrs_api_program_resource.service,_.._openmrs_api_program_workflow_resource.service,_.._program_manager_program_referral_report_base_patient_referral_tabular.component.ngfactory,_.._program_manager_program_referral_report_base_patient_referral_tabular.component,_angular_router,_.._etl_api_patient_referral_resource.service,_patient_referral.component,_angular_common PURE_IMPORTS_END */














var styles_PatientReferralComponent = [];
var RenderType_PatientReferralComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_PatientReferralComponent, data: {} });

function View_PatientReferralComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 2, "h4", [["class", "component-title"], ["style", "color: green;"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 0, "span", [["class", "glyphicon glyphicon-equalizer"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, [" Patient Referral"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 5, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](4, 0, null, null, 2, "report-filters", [], null, [[null, "startDateChange"], [null, "endDateChange"], [null, "onProgramChange"], [null, "generateReport"]], function (_v, en, $event) {
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
            if (("onProgramChange" === en)) {
                var pd_2 = (_co.getSelectedPrograms($event) !== false);
                ad = (pd_2 && ad);
            }
            if (("generateReport" === en)) {
                var pd_3 = (_co.generateReport() !== false);
                ad = (pd_3 && ad);
            }
            return ad;
        }, _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_ReportFiltersComponent_0"], _shared_report_filters_report_filters_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_ReportFiltersComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](5120, null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], function (p0_0) { return [p0_0]; }, [_shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_3__["ReportFiltersComponent"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](6, 4308992, null, 0, _shared_report_filters_report_filters_component__WEBPACK_IMPORTED_MODULE_3__["ReportFiltersComponent"], [_etl_api_indicator_resource_service__WEBPACK_IMPORTED_MODULE_4__["IndicatorResourceService"], _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_5__["DataAnalyticsDashboardService"], _openmrs_api_program_resource_service__WEBPACK_IMPORTED_MODULE_6__["ProgramResourceService"], _openmrs_api_program_workflow_resource_service__WEBPACK_IMPORTED_MODULE_7__["ProgramWorkFlowResourceService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]], { parentIsBusy: [0, "parentIsBusy"], enabledControls: [1, "enabledControls"], startDate: [2, "startDate"], endDate: [3, "endDate"], reportName: [4, "reportName"] }, { onProgramChange: "onProgramChange", generateReport: "generateReport", startDateChange: "startDateChange", endDateChange: "endDateChange" }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](7, 0, null, null, 1, "patient-referral-tabular", [], null, null, null, _program_manager_program_referral_report_base_patient_referral_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__["View_PatientReferralTabularComponent_0"], _program_manager_program_referral_report_base_patient_referral_tabular_component_ngfactory__WEBPACK_IMPORTED_MODULE_8__["RenderType_PatientReferralTabularComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](8, 114688, null, 0, _program_manager_program_referral_report_base_patient_referral_tabular_component__WEBPACK_IMPORTED_MODULE_9__["PatientReferralTabularComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"], _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_11__["PatientReferralResourceService"]], { data: [0, "data"], sectionDefs: [1, "sectionDefs"], dates: [2, "dates"], programUuids: [3, "programUuids"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isLoadingReport; var currVal_1 = _co.enabledControls; var currVal_2 = _co.startDate; var currVal_3 = _co.endDate; var currVal_4 = _co.reportName; _ck(_v, 6, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4); var currVal_5 = _co.data; var currVal_6 = _co.sectionsDef; var currVal_7 = _co.dates; var currVal_8 = _co.programUuids; _ck(_v, 8, 0, currVal_5, currVal_6, currVal_7, currVal_8); }, null);
}
function View_PatientReferralComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "patient-referral-report", [], null, null, null, View_PatientReferralComponent_0, RenderType_PatientReferralComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _patient_referral_component__WEBPACK_IMPORTED_MODULE_12__["PatientReferralComponent"], [_etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_11__["PatientReferralResourceService"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["ActivatedRoute"], _angular_common__WEBPACK_IMPORTED_MODULE_13__["Location"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"], _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_5__["DataAnalyticsDashboardService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var PatientReferralComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("patient-referral-report", _patient_referral_component__WEBPACK_IMPORTED_MODULE_12__["PatientReferralComponent"], View_PatientReferralComponent_Host_0, {}, {}, []);



/***/ }),

/***/ "./src/app/clinic-dashboard/referral/patient-referral.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/clinic-dashboard/referral/patient-referral.component.ts ***!
  \*************************************************************************/
/*! exports provided: PatientReferralComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralComponent", function() { return PatientReferralComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _program_manager_program_referral_report_base_patient_referral_report_base_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../program-manager/program-referral-report-base/patient-referral-report-base.component */ "./src/app/program-manager/program-referral-report-base/patient-referral-report-base.component.ts");
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");








var PatientReferralComponent = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PatientReferralComponent, _super);
    function PatientReferralComponent(patientReferralResourceService, route, location, router, dataAnalyticsDashboardService) {
        var _this = _super.call(this, patientReferralResourceService, dataAnalyticsDashboardService) || this;
        _this.patientReferralResourceService = patientReferralResourceService;
        _this.route = route;
        _this.location = location;
        _this.router = router;
        _this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        _this.data = [];
        _this.sectionsDef = [];
        _this.enabledControls = 'datesControl,programsControl';
        return _this;
    }
    PatientReferralComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.parent.parent.parent.parent.params.subscribe(function (params) {
            _this.locationUuids = [];
            if (params.location_uuid) {
                var data = {};
                data['value'] = params.location_uuid;
                _this.locationUuids.push(data);
            }
        });
        this.loadReportParamsFromUrl();
    };
    PatientReferralComponent.prototype.test = function () {
    };
    PatientReferralComponent.prototype.generateReport = function () {
        this.storeReportParamsInUrl();
        _super.prototype.generateReport.call(this);
    };
    PatientReferralComponent.prototype.loadReportParamsFromUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        var pathHasHistoricalValues = path.queryParams['startDate'] &&
            path.queryParams['endDate'];
        if (path.queryParams['startDate']) {
            this.startDate = new Date(path.queryParams['startDate']);
        }
        if (path.queryParams['endDate']) {
            this.endDate = new Date(path.queryParams['endDate']);
        }
        if (path.queryParams['programUuids']) {
            this.programs = path.queryParams['programUuids'];
        }
        if (pathHasHistoricalValues) {
            this.generateReport();
        }
    };
    PatientReferralComponent.prototype.storeReportParamsInUrl = function () {
        var path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'endDate': this.endDate.toUTCString(),
            'startDate': this.startDate.toUTCString()
        };
        if (!lodash__WEBPACK_IMPORTED_MODULE_4__["isUndefined"](this.programs)) {
            lodash__WEBPACK_IMPORTED_MODULE_4__["extend"](path.queryParams, {
                programUuids: this.programs
            });
        }
        this.location.replaceState(path.toString());
    };
    PatientReferralComponent.prototype.translateIndicator = function (indicator) {
        return indicator.toLowerCase().split('_').map(function (word) {
            return (word.charAt(0) + word.slice(1));
        }).join(' ');
    };
    return PatientReferralComponent;
}(_program_manager_program_referral_report_base_patient_referral_report_base_component__WEBPACK_IMPORTED_MODULE_5__["PatientReferralBaseComponent"]));



/***/ }),

/***/ "./src/app/program-manager/program-referral-report-base/patient-referral-report-base.component.ts":
/*!********************************************************************************************************!*\
  !*** ./src/app/program-manager/program-referral-report-base/patient-referral-report-base.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: PatientReferralBaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralBaseComponent", function() { return PatientReferralBaseComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _data_analytics_dashboard_services_data_analytics_dashboard_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../data-analytics-dashboard/services/data-analytics-dashboard.services */ "./src/app/data-analytics-dashboard/services/data-analytics-dashboard.services.ts");
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");





var PatientReferralBaseComponent = /** @class */ /*@__PURE__*/ (function () {
    function PatientReferralBaseComponent(patientReferralResourceService, dataAnalyticsDashboardService) {
        this.patientReferralResourceService = patientReferralResourceService;
        this.dataAnalyticsDashboardService = dataAnalyticsDashboardService;
        this.data = [];
        this.sectionsDef = [];
        this.enabledControls = 'datesControl' +
            'ageControl,genderControl,locationControl';
        this.selectedGender = [];
        this.isLoadingReport = false;
        this.encounteredError = false;
        this.errorMessage = '';
        this.currentView = 'tabular'; // can be pdf or tabular or patientList
        this.reportName = '';
        this._startDate = moment__WEBPACK_IMPORTED_MODULE_1__().subtract(1, 'months').toDate();
        this._endDate = new Date();
    }
    Object.defineProperty(PatientReferralBaseComponent.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (v) {
            this._startDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PatientReferralBaseComponent.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (v) {
            this._endDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PatientReferralBaseComponent.prototype, "locationUuids", {
        get: function () {
            return this._locationUuids;
        },
        set: function (v) {
            this._locationUuids = v;
        },
        enumerable: true,
        configurable: true
    });
    PatientReferralBaseComponent.prototype.ngOnInit = function () {
    };
    PatientReferralBaseComponent.prototype.generateReport = function () {
        var _this = this;
        this.dates = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        this.encounteredError = false;
        this.errorMessage = '';
        this.isLoadingReport = true;
        var filterLocation = this.getSelectedLocations(this.locationUuids);
        var params = {
            endDate: this.toDateString(this.endDate),
            startDate: this.toDateString(this.startDate),
            locationUuids: filterLocation
        };
        if (!lodash__WEBPACK_IMPORTED_MODULE_2__["isUndefined"](this.programs)) {
            lodash__WEBPACK_IMPORTED_MODULE_2__["extend"](params, {
                programUuids: this.programs
            });
        }
        this.patientReferralResourceService
            .getPatientReferralReport(params).take(1).subscribe(function (data) {
            _this.isLoadingReport = false;
            _this.data = _this.getProgramData(data);
        }, function (error) {
            console.log('error => ', error);
            _this.isLoadingReport = false;
            _this.errorMessage = error;
            _this.encounteredError = true;
        });
    };
    PatientReferralBaseComponent.prototype.getSelectedPrograms = function (programsUuids) {
        if (!programsUuids || programsUuids.length === 0) {
            return '';
        }
        var selectedPrograms = '';
        for (var i = 0; i < programsUuids.length; i++) {
            if (i === 0) {
                selectedPrograms = selectedPrograms + programsUuids[0].value;
            }
            else {
                selectedPrograms = selectedPrograms + ',' + programsUuids[i].value;
            }
        }
        return this.programs = selectedPrograms;
    };
    PatientReferralBaseComponent.prototype.onTabChanged = function (event) {
        if (event.index === 0) {
            this.currentView = 'tabular';
        }
    };
    PatientReferralBaseComponent.prototype.getSelectedLocations = function (locationUuids) {
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
    PatientReferralBaseComponent.prototype.toDateString = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_1__(date).utcOffset('+03:00').format();
    };
    PatientReferralBaseComponent.prototype.getProgramData = function (data) {
        var rowData = [];
        lodash__WEBPACK_IMPORTED_MODULE_2__["forEach"](data.groupedResult, function (row) {
            rowData = rowData.concat(row.programs);
        });
        return rowData;
    };
    return PatientReferralBaseComponent;
}());



/***/ }),

/***/ "./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ngfactory.js":
/*!**************************************************************************************************************!*\
  !*** ./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ngfactory.js ***!
  \**************************************************************************************************************/
/*! exports provided: RenderType_PatientReferralTabularComponent, View_PatientReferralTabularComponent_0, View_PatientReferralTabularComponent_Host_0, PatientReferralTabularComponentNgFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderType_PatientReferralTabularComponent", function() { return RenderType_PatientReferralTabularComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_PatientReferralTabularComponent_0", function() { return View_PatientReferralTabularComponent_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "View_PatientReferralTabularComponent_Host_0", function() { return View_PatientReferralTabularComponent_Host_0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralTabularComponentNgFactory", function() { return PatientReferralTabularComponentNgFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component.ngfactory */ "./src/app/shared/data-lists/patient-list/patient-list.component.ngfactory.js");
/* harmony import */ var _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/data-lists/patient-list/patient-list.component */ "./src/app/shared/data-lists/patient-list/patient-list.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../node_modules/ag-grid-angular/dist/agGridNg2.ngfactory */ "./node_modules/ag-grid-angular/dist/agGridNg2.ngfactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkFactory */ "./node_modules/ag-grid-angular/dist/ng2FrameworkFactory.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ag-grid-angular/dist/baseComponentFactory */ "./node_modules/ag-grid-angular/dist/baseComponentFactory.js");
/* harmony import */ var ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ag-grid-angular/dist/ng2FrameworkComponentWrapper */ "./node_modules/ag-grid-angular/dist/ng2FrameworkComponentWrapper.js");
/* harmony import */ var ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ag-grid-angular/dist/agGridNg2 */ "./node_modules/ag-grid-angular/dist/agGridNg2.js");
/* harmony import */ var ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _patient_referral_tabular_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./patient-referral-tabular.component */ "./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ts");
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");
/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */
/** PURE_IMPORTS_START _angular_core,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_angular_common,_patient_referral_tabular.component,_.._etl_api_patient_referral_resource.service PURE_IMPORTS_END */
/** PURE_IMPORTS_START _angular_core,_.._shared_data_lists_patient_list_patient_list.component.ngfactory,_.._shared_data_lists_patient_list_patient_list.component,_angular_router,_.._.._.._node_modules_ag_grid_angular_dist_agGridNg2.ngfactory,ag_grid_angular_dist_ng2FrameworkFactory,ag_grid_angular_dist_baseComponentFactory,ag_grid_angular_dist_ng2FrameworkComponentWrapper,ag_grid_angular_dist_agGridNg2,_angular_common,_patient_referral_tabular.component,_.._etl_api_patient_referral_resource.service PURE_IMPORTS_END */












var styles_PatientReferralTabularComponent = [];
var RenderType_PatientReferralTabularComponent = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵcrt"]({ encapsulation: 2, styles: styles_PatientReferralTabularComponent, data: {} });

function View_PatientReferralTabularComponent_1(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 3, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 2, "span", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](2, 0, null, null, 0, "i", [["class", "fa fa-spinner fa-spin"]], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](-1, null, ["Loading..."]))], null, null); }
function View_PatientReferralTabularComponent_2(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 4, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 0, null, null, 1, "h3", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵted"](2, null, ["Patient List (", ")"])), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](3, 0, null, null, 1, "patient-list", [], null, null, null, _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["View_PatientListComponent_0"], _shared_data_lists_patient_list_patient_list_component_ngfactory__WEBPACK_IMPORTED_MODULE_1__["RenderType_PatientListComponent"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 114688, null, 0, _shared_data_lists_patient_list_patient_list_component__WEBPACK_IMPORTED_MODULE_2__["PatientListComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]], { extraColumns: [0, "extraColumns"], overrideColumns: [1, "overrideColumns"], data: [2, "data"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.extraColumns; var currVal_2 = _co.overrideColumns; var currVal_3 = _co.patientData; _ck(_v, 4, 0, currVal_1, currVal_2, currVal_3); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.programName; _ck(_v, 2, 0, currVal_0); }); }
function View_PatientReferralTabularComponent_0(_l) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](402653184, 1, { agGrid: 0 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](1, 16777216, null, null, 4, "ag-grid-angular", [["class", "ag-blue"], ["style", "width: 100%; height: 200px;"]], null, [[null, "cellClicked"]], function (_v, en, $event) {
            var ad = true;
            var _co = _v.component;
            if (("cellClicked" === en)) {
                var pd_0 = (_co.onCellClicked($event) !== false);
                ad = (pd_0 && ad);
            }
            return ad;
        }, _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_4__["View_AgGridNg2_0"], _node_modules_ag_grid_angular_dist_agGridNg2_ngfactory__WEBPACK_IMPORTED_MODULE_4__["RenderType_AgGridNg2"])), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkFactory"], [ag_grid_angular_dist_baseComponentFactory__WEBPACK_IMPORTED_MODULE_6__["BaseComponentFactory"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵprd"](512, null, ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7__["Ng2FrameworkComponentWrapper"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7__["Ng2FrameworkComponentWrapper"], []), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](4, 4898816, [[1, 4], ["agGrid", 4]], 1, ag_grid_angular_dist_agGridNg2__WEBPACK_IMPORTED_MODULE_8__["AgGridNg2"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], ag_grid_angular_dist_ng2FrameworkFactory__WEBPACK_IMPORTED_MODULE_5__["Ng2FrameworkFactory"], ag_grid_angular_dist_ng2FrameworkComponentWrapper__WEBPACK_IMPORTED_MODULE_7__["Ng2FrameworkComponentWrapper"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]], { gridOptions: [0, "gridOptions"], rowData: [1, "rowData"] }, { cellClicked: "cellClicked" }), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵqud"](603979776, 2, { columns: 1 }), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](6, 0, null, null, 4, "div", [], null, null, null, null, null)), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_PatientReferralTabularComponent_1)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](8, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null), (_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵand"](16777216, null, null, 1, null, View_PatientReferralTabularComponent_2)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](10, 16384, null, 0, _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.gridOptions; var currVal_1 = _co.data; _ck(_v, 4, 0, currVal_0, currVal_1); var currVal_2 = _co.isLoading; _ck(_v, 8, 0, currVal_2); var currVal_3 = _co.patientData; _ck(_v, 10, 0, currVal_3); }, null);
}
function View_PatientReferralTabularComponent_Host_0(_l) { return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵvid"](0, [(_l()(), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵeld"](0, 0, null, null, 1, "patient-referral-tabular", [], null, null, null, View_PatientReferralTabularComponent_0, RenderType_PatientReferralTabularComponent)), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵdid"](1, 114688, null, 0, _patient_referral_tabular_component__WEBPACK_IMPORTED_MODULE_10__["PatientReferralTabularComponent"], [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_11__["PatientReferralResourceService"]], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var PatientReferralTabularComponentNgFactory = /*@__PURE__*/ /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵccf"]("patient-referral-tabular", _patient_referral_tabular_component__WEBPACK_IMPORTED_MODULE_10__["PatientReferralTabularComponent"], View_PatientReferralTabularComponent_Host_0, { data: "rowData", sectionDefs: "sectionDefs", dates: "dates", programUuids: "programUuids" }, {}, []);



/***/ }),

/***/ "./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/program-manager/program-referral-report-base/patient-referral-tabular.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: PatientReferralTabularComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralTabularComponent", function() { return PatientReferralTabularComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");






var PatientReferralTabularComponent = /** @class */ /*@__PURE__*/ (function () {
    function PatientReferralTabularComponent(router, resourceService) {
        this.router = router;
        this.resourceService = resourceService;
        this.overrideColumns = [];
        this.extraColumns = [];
        this.startIndex = 0;
        this.isLoading = false;
        this.dataLoaded = false;
        this.gridOptions = {
            columnDefs: []
        };
        /* tslint:disable:no-input-rename */
        this.data = [];
        this._notificationStatus = 'All';
    }
    Object.defineProperty(PatientReferralTabularComponent.prototype, "sectionDefs", {
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
    Object.defineProperty(PatientReferralTabularComponent.prototype, "dates", {
        get: function () {
            return this._dates;
        },
        set: function (v) {
            this._dates = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PatientReferralTabularComponent.prototype, "programUuids", {
        get: function () {
            return this._programUuid;
        },
        set: function (v) {
            this._programUuid = v;
        },
        enumerable: true,
        configurable: true
    });
    PatientReferralTabularComponent.prototype.ngOnInit = function () {
    };
    PatientReferralTabularComponent.prototype.setColumns = function (sectionsData) {
        var _this = this;
        var defs = [];
        defs.push({
            headerName: 'Location',
            field: 'location',
            // pinned: 'left',
            rowGroup: true,
            hide: true
        }, {
            headerName: 'Program',
            field: 'program'
        });
        if (this.data) {
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](sectionsData, function (data) {
                defs.push({
                    headerName: _this.titleCase(data.name),
                    field: data.name
                });
            });
        }
        this.gridOptions.columnDefs = defs;
        this.gridOptions.enableColResize = true;
        this.gridOptions.enableSorting = false;
        this.gridOptions.enableFilter = false;
        this.gridOptions.toolPanelSuppressSideButtons = true;
        this.gridOptions.getRowStyle = function (params) {
            return { 'font-size': '14px', 'cursor': 'pointer' };
        };
        this.gridOptions.onGridReady = function (event) {
            setTimeout(function () {
                if (_this.gridOptions.api) {
                    _this.agGrid.api.setColumnDefs(defs);
                    _this.gridOptions.api.sizeColumnsToFit();
                    _this.gridOptions.groupDefaultExpanded = -1;
                }
            }, 500, true);
        };
    };
    PatientReferralTabularComponent.prototype.titleCase = function (str) {
        return str.toLowerCase().split('_').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    };
    PatientReferralTabularComponent.prototype.onCellClicked = function (event) {
        this.programName = event.data.program;
        this.generatePatientListReport(event);
    };
    PatientReferralTabularComponent.prototype.generatePatientListReport = function (data) {
        var _this = this;
        this.isLoading = true;
        var filterLocation = data.data.locationUuids ? data.data.locationUuids : null;
        this.resourceService.getPatientReferralPatientList({
            endDate: this.toDateString(this._dates.endDate),
            locationUuids: filterLocation,
            startDate: this.toDateString(this._dates.startDate),
            programUuids: data.data.programUuids ? data.data.programUuids : null,
            startIndex: this.startIndex ? this.startIndex : null,
            notificationStatus: null,
        }).take(1).subscribe(function (report) {
            _this.patientData = report;
            // this.patientData ? this.patientData.concat(report) : report;
            _this.isLoading = false;
            _this.startIndex += report.length;
            if (report.length < 300) {
                _this.dataLoaded = true;
            }
            _this.overrideColumns.push({
                field: 'identifiers',
                headerName: 'Identifier',
                onCellClicked: function (column) {
                    _this.redirectTopatientInfo(column.data.patient_uuid);
                },
                cellRenderer: function (column) {
                    return '<a href="javascript:void(0);" title="Identifiers">'
                        + column.value + '</a>';
                }
            });
        });
    };
    PatientReferralTabularComponent.prototype.loadMorePatients = function () {
        // this.generatePatientListReport();
    };
    PatientReferralTabularComponent.prototype.redirectTopatientInfo = function (patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/general']);
    };
    PatientReferralTabularComponent.prototype.toDateString = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_4__(date).utcOffset('+03:00').format();
    };
    return PatientReferralTabularComponent;
}());



/***/ })

}]);