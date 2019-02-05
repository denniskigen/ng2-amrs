(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[39],{

/***/ "./src/app/patient-dashboard/common/forms/form-list.service.ts":
/*!*********************************************************************!*\
  !*** ./src/app/patient-dashboard/common/forms/form-list.service.ts ***!
  \*********************************************************************/
/*! exports provided: FormListService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormListService", function() { return FormListService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_api_forms_resource_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../openmrs-api/forms-resource.service */ "./src/app/openmrs-api/forms-resource.service.ts");
/* harmony import */ var _form_order_metadata_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form-order-metadata.service */ "./src/app/patient-dashboard/common/forms/form-order-metadata.service.ts");




var FormListService = /** @class */ /*@__PURE__*/ (function () {
    function FormListService(formsResourceService, formOrderMetaDataService) {
        this.formsResourceService = formsResourceService;
        this.formOrderMetaDataService = formOrderMetaDataService;
    }
    FormListService.prototype.removeVersionFromFormNames = function (pocForms) {
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](pocForms, function (form) {
            form.display = form.name;
        });
        return pocForms;
    };
    FormListService.prototype.sortFormList = function (unsortArray, sortingMetadataArrays) {
        var _this = this;
        if (!Array.isArray(unsortArray)) {
            throw new Error('unsortedArray must be an array');
        }
        if (!Array.isArray(sortingMetadataArrays)) {
            throw new Error('sortingMetadataArrays must be an array');
        }
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](sortingMetadataArrays, function (array) {
            if (!Array.isArray(array)) {
                throw new Error('Every member of the sortingMetadataArrays  must be an array');
            }
        });
        var sortedArray = [];
        // add items to the list of sorted array by using the metadata provided
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](sortingMetadataArrays, function (sortingMetadata) {
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](sortingMetadata, function (metadata) {
                var found = _this._findItemByName(metadata.name, unsortArray);
                if (found) {
                    _this._addMemberToArray(found, sortedArray);
                }
            });
        });
        // add missing items that weren't in the sorting metadata
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](unsortArray, function (item) {
            var found = _this._findItemByName(item.name, sortedArray);
            if (lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"](found)) {
                var toAdd = _this._findItemByName(item.name, unsortArray);
                _this._addMemberToArray(toAdd, sortedArray);
            }
        });
        return sortedArray;
    };
    FormListService.prototype.filterPublishedOpenmrsForms = function (unsortArray) {
        if (!Array.isArray(unsortArray)) {
            throw new Error('Input must be an array');
        }
        // comment out /*item.published && */ for all unretired forms (NOTE : ng-forms build)
        var publishedOpenmrsForms = lodash__WEBPACK_IMPORTED_MODULE_1__["filter"](unsortArray, function (item) {
            return item.published && !item.retired;
        });
        return publishedOpenmrsForms;
    };
    FormListService.prototype.processFavouriteForms = function (openmrsForms, favouriteForms) {
        var _this = this;
        if (!Array.isArray(openmrsForms)) {
            throw new Error('unsortedArray must be an array');
        }
        if (!Array.isArray(favouriteForms)) {
            throw new Error('favourite must be an array');
        }
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](openmrsForms, function (form) {
            if (_this._findItemByName(form.name, favouriteForms)) {
                form.favourite = true;
            }
            else {
                form.favourite = false;
            }
        });
        return openmrsForms;
    };
    FormListService.prototype.removeVersionInformationFromForms = function (formsArray) {
        var _this = this;
        lodash__WEBPACK_IMPORTED_MODULE_1__["each"](formsArray, function (form) {
            form.display = lodash__WEBPACK_IMPORTED_MODULE_1__["clone"](form.name);
            form.name = _this.removeVersionInformation(form.name);
        });
        return formsArray;
    };
    FormListService.prototype.removeVersionInformation = function (formName) {
        if (typeof formName !== 'string') {
            throw new Error('formName should be a string');
        }
        var trimmed = formName.trim();
        // minimum form length is 5 characters
        if (trimmed.length < 5) {
            return trimmed;
        }
        var lastFiveCharacters = trimmed.substr(trimmed.length - 5);
        var indexOfV = lastFiveCharacters.search('v') === -1 ? lastFiveCharacters
            .search('V') : lastFiveCharacters.search('v');
        if (indexOfV === -1 || indexOfV === (lastFiveCharacters.length - 1)) {
            return trimmed;
        }
        if (this._isVersionInformation(lastFiveCharacters
            .substr(indexOfV, lastFiveCharacters.length - indexOfV))) {
            return trimmed.substr(0, (trimmed.length - (5 - indexOfV))).trim();
        }
        return trimmed;
    };
    FormListService.prototype.getFormList = function () {
        var _this = this;
        var formList = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"]([]);
        var favouriteForms = this.formOrderMetaDataService.getFavouriteForm();
        this.formsResourceService.getForms().subscribe(function (forms) {
            _this.formOrderMetaDataService.getDefaultFormOrder().subscribe(function (defaultOrder) {
                var formlist = _this.processFavouriteForms(_this._getFormList(forms, [favouriteForms, defaultOrder]), favouriteForms);
                formList.next(formlist);
            });
        });
        return formList;
    };
    FormListService.prototype._getFormList = function (pocForms, formOrderArray) {
        // first filter out unpublished forms
        var effectiveForms = this.removeVersionInformationFromForms(pocForms);
        var publishedForms = this.filterPublishedOpenmrsForms(effectiveForms);
        var sortedList = this.sortFormList(publishedForms, formOrderArray);
        return sortedList;
    };
    FormListService.prototype._isVersionInformation = function (subString) {
        if (subString.length < 2) {
            return false;
        }
        if (subString.substr(0, 1) !== 'v' && subString.substr(0, 1) !== 'V') {
            return false;
        }
        if (!this._isNumeric(subString.substr(1, 1))) {
            return false;
        }
        return true;
    };
    FormListService.prototype._isNumeric = function (str) {
        return /^\d+$/.test(str);
    };
    FormListService.prototype._findItemByName = function (name, array) {
        var foundItems = [];
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && name === array[i].name) {
                foundItems.push(array[i]);
            }
        }
        return foundItems.length === 0 ?
            undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    };
    FormListService.prototype._findItemByUuid = function (uuid, array) {
        var foundItems = [];
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < array.length; i++) {
            // TODO: find a way to compare strings by first eliminating the spaces
            if (array[i] && uuid === array[i].uuid) {
                foundItems.push(array[i]);
            }
        }
        return foundItems.length === 0 ?
            undefined : foundItems.length === 1 ? foundItems[0] : foundItems;
    };
    FormListService.prototype._arrayHasMember = function (member, array) {
        return array.indexOf(member) !== -1;
    };
    FormListService.prototype._addMemberToArray = function (member, array) {
        var _this = this;
        if (Array.isArray(member)) {
            // add individual members to array
            lodash__WEBPACK_IMPORTED_MODULE_1__["each"](member, function (item) {
                _this._addMemberToArray(item, array);
            });
        }
        else {
            if (member && !this._arrayHasMember(member, array)) {
                array.push(member);
            }
        }
    };
    return FormListService;
}());



/***/ }),

/***/ "./src/app/patient-dashboard/common/forms/form-order-metadata.service.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/patient-dashboard/common/forms/form-order-metadata.service.ts ***!
  \*******************************************************************************/
/*! exports provided: FormOrderMetaDataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormOrderMetaDataService", function() { return FormOrderMetaDataService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/local-storage.service */ "./src/app/utils/local-storage.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");




var FormOrderMetaDataService = /** @class */ /*@__PURE__*/ (function () {
    function FormOrderMetaDataService(http, localStorageService) {
        this.http = http;
        this.localStorageService = localStorageService;
        this.formsOrder = new rxjs__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](1);
    }
    FormOrderMetaDataService.prototype.getDefaultFormOrder = function (forceRefresh) {
        var _this = this;
        if (!this.formsOrder.observers.length || forceRefresh) {
            this.http.get('./assets/schemas/form-order.json')
                .subscribe(function (data) { console.log(data); _this.formsOrder.next(data); }, function (error) { return _this.formsOrder.error(error); });
        }
        return this.formsOrder;
    };
    FormOrderMetaDataService.prototype.setFavouriteForm = function (name) {
        var formNames = this.getFavouriteForm();
        var obj = {
            name: name
        };
        if (lodash__WEBPACK_IMPORTED_MODULE_1__["find"](formNames, obj) === undefined) {
            formNames.push(obj);
            this.localStorageService.setObject('formNames', formNames);
        }
    };
    FormOrderMetaDataService.prototype.removeFavouriteForm = function (name) {
        var formNames = this.getFavouriteForm();
        var obj = {
            name: name
        };
        formNames.splice(lodash__WEBPACK_IMPORTED_MODULE_1__["indexOf"](formNames, lodash__WEBPACK_IMPORTED_MODULE_1__["find"](formNames, obj)), 1);
        this.localStorageService.setObject('formNames', formNames);
    };
    FormOrderMetaDataService.prototype.getFavouriteForm = function () {
        var storedData = this.localStorageService.getItem('formNames');
        var arrayData = [];
        if (storedData) {
            arrayData = JSON.parse(storedData);
        }
        return arrayData;
    };
    FormOrderMetaDataService.prototype.handleError = function (error) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])(error.message
            ? error.message
            : error.status
                ? error.status + " - " + error.statusText
                : 'Server Error');
    };
    return FormOrderMetaDataService;
}());



/***/ })

}]);