(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/clickOutside.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/clickOutside.js ***!
  \**************************************************************************************************/
/*! exports provided: ClickOutsideDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClickOutsideDirective", function() { return ClickOutsideDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var ClickOutsideDirective = /*@__PURE__*/ (function () {
    function ClickOutsideDirective(_elementRef) {
        this._elementRef = _elementRef;
        this.clickOutside = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ClickOutsideDirective.prototype.onClick = function (event, targetElement) {
        if (!targetElement) {
            return;
        }
        var clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    };
    return ClickOutsideDirective;
}());

//# sourceMappingURL=clickOutside.js.map


/***/ }),

/***/ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/group-by.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/group-by.js ***!
  \**********************************************************************************************/
/*! exports provided: groupByPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupByPipe", function() { return groupByPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var groupByPipe = /*@__PURE__*/ (function () {
    function groupByPipe() {
    }
    groupByPipe.prototype.transform = function (value, field) {
        var groupedObj = value.reduce(function (prev, cur) {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(function (key) { return ({ key: key, value: groupedObj[key] }); });
    };
    return groupByPipe;
}());

//# sourceMappingURL=group-by.js.map


/***/ }),

/***/ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/list-filter.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/list-filter.js ***!
  \*************************************************************************************************/
/*! exports provided: ListFilterPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListFilterPipe", function() { return ListFilterPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var ListFilterPipe = /*@__PURE__*/ (function () {
    function ListFilterPipe() {
    }
    ListFilterPipe.prototype.transform = function (items, filter) {
        var _this = this;
        if (!items || !filter) {
            return items;
        }
        return items.filter(function (item) { return _this.applyFilter(item, filter); });
    };
    ListFilterPipe.prototype.applyFilter = function (item, filter) {
        return !(filter.itemName && item.itemName && item.itemName.toLowerCase().indexOf(filter.itemName.toLowerCase()) === -1);
    };
    return ListFilterPipe;
}());

//# sourceMappingURL=list-filter.js.map


/***/ }),

/***/ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.component.js ***!
  \***********************************************************************************************************/
/*! exports provided: DROPDOWN_CONTROL_VALUE_ACCESSOR, AngularMultiSelect, AngularMultiSelectModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DROPDOWN_CONTROL_VALUE_ACCESSOR", function() { return DROPDOWN_CONTROL_VALUE_ACCESSOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AngularMultiSelect", function() { return AngularMultiSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AngularMultiSelectModule", function() { return AngularMultiSelectModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _multiselect_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./multiselect.model */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.model.js");
/* harmony import */ var _clickOutside__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./clickOutside */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/clickOutside.js");
/* harmony import */ var _list_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list-filter */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/list-filter.js");
/* harmony import */ var _group_by__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./group-by */ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/group-by.js");







var DROPDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
    useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () { return AngularMultiSelect; }),
    multi: true
};
var noop = function () {
};
var AngularMultiSelect = /*@__PURE__*/ (function () {
    function AngularMultiSelect() {
        this.onSelect = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onDeSelect = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onSelectAll = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onDeSelectAll = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isActive = false;
        this.isSelectAll = false;
        this.filter = new _multiselect_model__WEBPACK_IMPORTED_MODULE_3__["ListItem"]();
        this.defaultSettings = {
            singleSelection: false,
            text: 'Select',
            enableCheckAll: true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            maxHeight: 300,
            badgeShowLimit: 999999999999,
            classes: '',
            disabled: false,
            searchPlaceholderText: 'Search'
        };
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
    }
    AngularMultiSelect.prototype.ngOnInit = function () {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
    };
    AngularMultiSelect.prototype.ngDoCheck = function () {
        if (this.selectedItems) {
            if (this.selectedItems.length == 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    };
    AngularMultiSelect.prototype.onItemClick = function (item, index, evt) {
        if (this.settings.disabled) {
            return false;
        }
        var found = this.isSelected(item);
        var limit = this.selectedItems.length < this.settings.limitSelection ? true : false;
        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            }
            else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }
        }
        else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length == this.selectedItems.length) {
            this.isSelectAll = true;
        }
    };
    AngularMultiSelect.prototype.writeValue = function (value) {
        if (value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                try {
                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new _multiselect_model__WEBPACK_IMPORTED_MODULE_3__["MyException"](404, { "msg": "Single Selection Mode, Selected Items cannot have more than one item." });
                    }
                    else {
                        this.selectedItems = value;
                    }
                }
                catch (e) {
                    console.error(e.body.msg);
                }
            }
            else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                }
                else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        }
        else {
            this.selectedItems = [];
        }
    };
    //From ControlValueAccessor interface
    AngularMultiSelect.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    //From ControlValueAccessor interface
    AngularMultiSelect.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    AngularMultiSelect.prototype.trackByFn = function (index, item) {
        return item.id;
    };
    AngularMultiSelect.prototype.isSelected = function (clickedItem) {
        var found = false;
        this.selectedItems && this.selectedItems.forEach(function (item) {
            if (clickedItem.id === item.id) {
                found = true;
            }
        });
        return found;
    };
    AngularMultiSelect.prototype.addSelected = function (item) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
        }
        else
            this.selectedItems.push(item);
        this.onChangeCallback(this.selectedItems);
    };
    AngularMultiSelect.prototype.removeSelected = function (clickedItem) {
        var _this = this;
        this.selectedItems && this.selectedItems.forEach(function (item) {
            if (clickedItem.id === item.id) {
                _this.selectedItems.splice(_this.selectedItems.indexOf(item), 1);
            }
        });
        this.onChangeCallback(this.selectedItems);
    };
    AngularMultiSelect.prototype.toggleDropdown = function (evt) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        evt.preventDefault();
    };
    AngularMultiSelect.prototype.closeDropdown = function () {
        this.filter = new _multiselect_model__WEBPACK_IMPORTED_MODULE_3__["ListItem"]();
        this.isActive = false;
    };
    AngularMultiSelect.prototype.toggleSelectAll = function () {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onSelectAll.emit(this.selectedItems);
        }
        else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onDeSelectAll.emit(this.selectedItems);
        }
    };
    AngularMultiSelect.prototype.transformData = function (arr, field) {
        var groupedObj = arr.reduce(function (prev, cur) {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        var tempArr = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({ key: x, value: groupedObj[x] });
        });
        return tempArr;
    };
    return AngularMultiSelect;
}());

var AngularMultiSelectModule = /*@__PURE__*/ (function () {
    function AngularMultiSelectModule() {
    }
    return AngularMultiSelectModule;
}());

//# sourceMappingURL=multiselect.component.js.map


/***/ }),

/***/ "./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.model.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/angular2-multiselect-dropdown/angular2-multiselect-dropdown/multiselect.model.js ***!
  \*******************************************************************************************************/
/*! exports provided: ListItem, MyException */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListItem", function() { return ListItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyException", function() { return MyException; });
var ListItem = /*@__PURE__*/ (function () {
    function ListItem() {
    }
    return ListItem;
}());

var MyException = /*@__PURE__*/ (function () {
    function MyException(status, body) {
        this.status = status;
        this.body = body;
    }
    return MyException;
}());

//# sourceMappingURL=multiselect.model.js.map


/***/ }),

/***/ "./src/app/department-program-filter/department-program-filter.module.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/department-program-filter/department-program-filter.module.ts ***!
  \*******************************************************************************/
/*! exports provided: DepartmentProgramFilterModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DepartmentProgramFilterModule", function() { return DepartmentProgramFilterModule; });
var DepartmentProgramFilterModule = /** @class */ /*@__PURE__*/ (function () {
    function DepartmentProgramFilterModule() {
    }
    return DepartmentProgramFilterModule;
}());



/***/ }),

/***/ "./src/app/etl-api/patient-program-enrollment.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/etl-api/patient-program-enrollment.service.ts ***!
  \***************************************************************/
/*! exports provided: PatientProgramEnrollmentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientProgramEnrollmentService", function() { return PatientProgramEnrollmentService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _app_settings_app_settings_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-settings/app-settings.service */ "./src/app/app-settings/app-settings.service.ts");
/* harmony import */ var _shared_services_data_cache_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/services/data-cache.service */ "./src/app/shared/services/data-cache.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");




var PatientProgramEnrollmentService = /** @class */ /*@__PURE__*/ (function () {
    function PatientProgramEnrollmentService(_http, _appSettingsService, _cacheService) {
        this._http = _http;
        this._appSettingsService = _appSettingsService;
        this._cacheService = _cacheService;
    }
    /*
     This service fetches patient enrollments based on
     location, date and program
    */
    PatientProgramEnrollmentService.prototype.getBaseUrl = function () {
        return this._appSettingsService.getEtlRestbaseurl().trim();
    };
    PatientProgramEnrollmentService.prototype.getActivePatientEnrollmentSummary = function (payload) {
        if (!payload) {
            return null;
        }
        var urlParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpParams"]()
            .set('endDate', payload.endDate)
            .set('startDate', payload.startDate);
        if (payload.locationUuids) {
            if (payload.locationUuids.length > 0) {
                urlParams = urlParams.set('locationUuids', payload.locationUuids);
            }
        }
        if (payload.programType) {
            if (payload.programType.length > 0) {
                urlParams = urlParams.set('programType', payload.programType);
            }
        }
        var url = this.getBaseUrl() + 'patient-program-enrollments';
        var request = this._http.get(url, {
            params: urlParams
        });
        return this._cacheService.cacheRequest(url, urlParams, request);
    };
    PatientProgramEnrollmentService.prototype.getActivePatientEnrollmentPatientList = function (payload) {
        if (!payload) {
            return null;
        }
        var urlParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpParams"]()
            .set('endDate', payload.endDate)
            .set('startDate', payload.startDate);
        if (payload.locationUuids) {
            if (payload.locationUuids.length > 0) {
                urlParams = urlParams.set('locationUuids', payload.locationUuids);
            }
        }
        if (payload.programType) {
            if (payload.programType.length > 0) {
                urlParams = urlParams.set('programType', payload.programType);
            }
        }
        var url = this.getBaseUrl() + 'program-enrollment/patient-list';
        var request = this._http.get(url, {
            params: urlParams
        });
        return this._cacheService.cacheRequest(url, urlParams, request);
    };
    return PatientProgramEnrollmentService;
}());



/***/ }),

/***/ "./src/app/patients-program-enrollment/patients-program-enrollment.module.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/patients-program-enrollment/patients-program-enrollment.module.ts ***!
  \***********************************************************************************/
/*! exports provided: PatientProgramEnrollmentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientProgramEnrollmentModule", function() { return PatientProgramEnrollmentModule; });
var PatientProgramEnrollmentModule = /** @class */ /*@__PURE__*/ (function () {
    function PatientProgramEnrollmentModule() {
    }
    return PatientProgramEnrollmentModule;
}());



/***/ })

}]);