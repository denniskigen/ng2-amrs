(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[40],{

/***/ "./src/app/patient-dashboard/common/formentry/form-schema.service.ts":
/*!***************************************************************************!*\
  !*** ./src/app/patient-dashboard/common/formentry/form-schema.service.ts ***!
  \***************************************************************************/
/*! exports provided: FormSchemaService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormSchemaService", function() { return FormSchemaService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _openmrs_api_forms_resource_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../openmrs-api/forms-resource.service */ "./src/app/openmrs-api/forms-resource.service.ts");
/* harmony import */ var _utils_local_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/local-storage.service */ "./src/app/utils/local-storage.service.ts");
/* harmony import */ var ngx_openmrs_formentry_dist_ngx_formentry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-openmrs-formentry/dist/ngx-formentry */ "./node_modules/ngx-openmrs-formentry/dist/ngx-formentry/fesm5/ngx-openmrs-formentry.js");





var FormSchemaService = /** @class */ /*@__PURE__*/ (function () {
    function FormSchemaService(formsResourceService, localStorage, formSchemaCompiler) {
        this.formsResourceService = formsResourceService;
        this.localStorage = localStorage;
        this.formSchemaCompiler = formSchemaCompiler;
    }
    /**
     *
     *
     * @param {string} formUuid
     * @param {boolean} cached
     * @returns {ReplaySubject<any>}
     *
     * @memberOf FormSchemaService
     */
    FormSchemaService.prototype.getFormSchemaByUuid = function (formUuid, cached) {
        var _this = this;
        if (cached === void 0) {
            cached = true;
        }
        var formSchema = new rxjs__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](1);
        var cachedCompiledSchema = this.getCachedCompiledSchemaByUuid(formUuid);
        if (cachedCompiledSchema && cached === true) {
            formSchema.next(cachedCompiledSchema);
        }
        else {
            this.getFormSchemaByUuidFromServer(formUuid)
                .subscribe(function (unCompiledSchema) {
                var form = unCompiledSchema.form;
                var referencedComponents = unCompiledSchema.referencedComponents;
                // add from metadata to the uncompiled schema
                _this.formsResourceService.getFormMetaDataByUuid(formUuid)
                    .subscribe(function (formMetadataObject) {
                    formMetadataObject.pages = form.pages || [];
                    formMetadataObject.referencedForms = form.referencedForms || [];
                    formMetadataObject.processor = form.processor;
                    // compile schema
                    var compiledSchema = _this.formSchemaCompiler
                        .compileFormSchema(formMetadataObject, referencedComponents);
                    // now cache the compiled schema
                    _this.cacheCompiledSchemaByUuid(formUuid, compiledSchema);
                    // return the compiled schema
                    formSchema.next(compiledSchema);
                }, function (err) {
                    console.error(err);
                    formSchema.error(err);
                });
            }, function (err) {
                console.error(err);
                formSchema.error(err);
            });
        }
        return formSchema;
    };
    FormSchemaService.prototype.getCachedCompiledSchemaByUuid = function (formUuid) {
        return this.localStorage.getObject(formUuid);
    };
    FormSchemaService.prototype.cacheCompiledSchemaByUuid = function (formUuid, schema) {
        this.localStorage.setObject(formUuid, schema);
    };
    FormSchemaService.prototype.getFormSchemaByUuidFromServer = function (formUuid) {
        var _this = this;
        var formSchema = new rxjs__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](1);
        this.fetchFormSchemaUsingFormMetadata(formUuid)
            .subscribe(function (schema) {
            // check whether whether formSchema has references b4 hitting getFormSchemaWithReferences
            if (schema['referencedForms'] && schema['referencedForms'].length > 0) {
                _this.getFormSchemaWithReferences(schema)
                    .subscribe(function (form) {
                    formSchema.next(form);
                }, function (err) {
                    console.error(err);
                    formSchema.error(err);
                });
            }
            else {
                formSchema.next({
                    form: schema,
                    referencedComponents: []
                });
            }
        }, function (err) {
            console.error(err);
            formSchema.error(err);
        });
        return formSchema;
    };
    FormSchemaService.prototype.getFormSchemaWithReferences = function (schema) {
        var formSchemaWithReferences = new rxjs__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](1);
        this.fetchFormSchemaReferences(schema)
            .subscribe(function (schemaReferences) {
            var forms = {
                form: schema,
                referencedComponents: schemaReferences
            };
            formSchemaWithReferences.next(forms);
        }, function (err) {
            console.error(err);
            formSchemaWithReferences.error(err);
        });
        return formSchemaWithReferences;
    };
    FormSchemaService.prototype.fetchFormSchemaReferences = function (formSchema) {
        var _this = this;
        // first create the observableBatch/ArrayOfRequests
        var observableBatch = [];
        var referencedForms = formSchema.referencedForms;
        if (Array.isArray(referencedForms) && referencedForms.length > 0) {
            var referencedUuids = this.getFormUuidArray(referencedForms);
            referencedUuids.forEach(function (referencedUuid, key) {
                observableBatch.push(_this.fetchFormSchemaUsingFormMetadata(referencedUuid));
            });
        }
        // now get schemaReferences sequentially
        var schemaReferences = [];
        return rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].create(function (observer) {
            var current = 0;
            var max = observableBatch.length;
            if (current === max) {
                // resolve
                observer.next(schemaReferences);
                return;
            }
            var concatenatedObservables = observableBatch[0];
            for (var i = 1; i < observableBatch.length; i++) {
                concatenatedObservables = concatenatedObservables.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concat"])(observableBatch[i]));
            }
            concatenatedObservables.subscribe(function (schema) {
                schemaReferences.push(schema);
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.next(schemaReferences);
            });
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])());
    };
    FormSchemaService.prototype.fetchFormSchemaUsingFormMetadata = function (formUuid) {
        var _this = this;
        return rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].create(function (observer) {
            return _this.formsResourceService.getFormMetaDataByUuid(formUuid)
                .subscribe(function (formMetadataObject) {
                if (formMetadataObject.resources.length > 0) {
                    _this.formsResourceService
                        .getFormClobDataByUuid(formMetadataObject.resources[0].valueReference)
                        .subscribe(function (clobData) {
                        observer.next(clobData);
                        // observer.compconste();
                    }, function (err) {
                        console.error(err);
                        observer.error(err);
                    });
                }
                else {
                    observer.error(formMetadataObject.display +
                        ':This formMetadataObject has no resource');
                }
            }, function (err) {
                console.error(err);
                observer.error(err);
            });
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["first"])());
    };
    FormSchemaService.prototype.getFormUuidArray = function (formSchemaReferences) {
        var formUuids = [];
        formSchemaReferences.forEach(function (value, key) {
            formUuids.push(value.ref.uuid);
        });
        return formUuids;
    };
    return FormSchemaService;
}());



/***/ }),

/***/ "./src/app/patient-dashboard/common/formentry/form-updater.service.ts":
/*!****************************************************************************!*\
  !*** ./src/app/patient-dashboard/common/formentry/form-updater.service.ts ***!
  \****************************************************************************/
/*! exports provided: FormUpdaterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormUpdaterService", function() { return FormUpdaterService; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _openmrs_api_forms_resource_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../openmrs-api/forms-resource.service */ "./src/app/openmrs-api/forms-resource.service.ts");
/* harmony import */ var _forms_form_list_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../forms/form-list.service */ "./src/app/patient-dashboard/common/forms/form-list.service.ts");
/* harmony import */ var _form_schema_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form-schema.service */ "./src/app/patient-dashboard/common/formentry/form-schema.service.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _utils_local_storage_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/local-storage.service */ "./src/app/utils/local-storage.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");








var LAST_UPDATED = 'formsLastUpdated';
var FormUpdaterService = /** @class */ /*@__PURE__*/ (function () {
    function FormUpdaterService(formsResourceService, formListService, formSchemaService, localStorageService, toast) {
        this.formsResourceService = formsResourceService;
        this.formListService = formListService;
        this.formSchemaService = formSchemaService;
        this.localStorageService = localStorageService;
        this.toast = toast;
    }
    FormUpdaterService.prototype.setDateLastChecked = function (timestamp) {
        this.localStorageService.setItem(LAST_UPDATED, timestamp);
    };
    FormUpdaterService.prototype.getDateLastChecked = function () {
        return this.localStorageService.getItem(LAST_UPDATED);
    };
    FormUpdaterService.prototype.getUpdatedForms = function () {
        var _this = this;
        this.checkUpdatedForms().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["catchError"])(function (error) { _this.toast.clear(); return error; }))
            .subscribe(function (updatedSchemas) {
            if (updatedSchemas.length > 0) {
                var filteredSchemas = updatedSchemas.filter(function (x) { return x !== null; });
                _this.toast.clear();
                if (filteredSchemas.length > 0) {
                    lodash__WEBPACK_IMPORTED_MODULE_4__["each"](filteredSchemas, function (schema) {
                        _this.replaceSchemaInCache(schema);
                    });
                    _this.showPlainToast('Forms Successfully Updated!', 3000);
                }
                else {
                    _this.showPlainToast('All forms are up to date.', 3000);
                }
                _this.setDateLastChecked(new Date().toDateString());
            }
            else {
                _this.showPlainToast('No forms in cache to update.', 2000);
            }
        });
    };
    FormUpdaterService.prototype.doesUpdatedSchemaExist = function (uuid, cachedSchema) {
        var cache = lodash__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](cachedSchema);
        return this.formSchemaService.getFormSchemaByUuid(uuid, false).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])(function (schema) {
            if (!lodash__WEBPACK_IMPORTED_MODULE_4__["isEqual"](schema.pages, cachedSchema.pages)) {
                return schema;
            }
            else {
                return null;
            }
        }));
    };
    FormUpdaterService.prototype.checkUpdatedForms = function () {
        var _this = this;
        var arrayOfObservables = [];
        return this.formsResourceService.getForms().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["switchMap"])(function (forms) {
            lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](forms, function (form, index) {
                var cachedSchema = _this.localStorageService.getObject(form.uuid);
                if (cachedSchema) {
                    arrayOfObservables
                        .push(_this.doesUpdatedSchemaExist(form.uuid, cachedSchema));
                }
            });
            if (arrayOfObservables.length > 0) {
                _this.showToastWithSpinner('Checking for updated forms');
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["from"])(arrayOfObservables).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["combineAll"])());
            }
            else {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["of"])([]);
            }
        }));
    };
    FormUpdaterService.prototype.replaceSchemaInCache = function (schema) {
        var temp = this.localStorageService.getObject(schema.uuid);
        temp.referencedForms = schema.referencedForms;
        temp.pages = schema.pages;
        this.localStorageService.setObject(schema.uuid, temp);
    };
    FormUpdaterService.prototype.showToastWithSpinner = function (message) {
        this.toast.info(message, '', { progressBar: true,
            progressAnimation: 'increasing',
            easeTime: 150,
            timeOut: 45000,
            positionClass: 'toast-bottom-center' });
    };
    FormUpdaterService.prototype.showPlainToast = function (message, duration) {
        if (duration) {
            this.toast.success(message, '', { timeOut: duration, positionClass: 'toast-bottom-center' });
        }
        else {
            this.toast.success(message, '', { positionClass: 'toast-bottom-center' });
        }
    };
    return FormUpdaterService;
}());



/***/ }),

/***/ "./src/environments/version.ts":
/*!*************************************!*\
  !*** ./src/environments/version.ts ***!
  \*************************************/
/*! exports provided: VERSION */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return VERSION; });
// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
var VERSION = {
    "dirty": true,
    "raw": "v2.1.0-1014-g1709c994-dirty",
    "hash": "g1709c994",
    "distance": 1014,
    "tag": "v2.1.0",
    "semver": {
        "raw": "v2.1.0",
        "major": 2,
        "minor": 1,
        "patch": 0,
        "prerelease": [],
        "build": [],
        "version": "2.1.0"
    },
    "suffix": "1014-g1709c994-dirty",
    "semverString": "2.1.0+1014.g1709c994",
    "version": "2.12.0-SNAPSHOT",
    "buildDate": "2019-02-05T06:34:31.718Z"
};
/* tslint:enable */


/***/ })

}]);