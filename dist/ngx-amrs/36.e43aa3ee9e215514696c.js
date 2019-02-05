(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[36],{

/***/ "./src/app/etl-api/program-referral-resource.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/etl-api/program-referral-resource.service.ts ***!
  \**************************************************************/
/*! exports provided: ProgramReferralResourceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramReferralResourceService", function() { return ProgramReferralResourceService; });
/* harmony import */ var _app_settings_app_settings_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-settings/app-settings.service */ "./src/app/app-settings/app-settings.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var ProgramReferralResourceService = /** @class */ /*@__PURE__*/ (function () {
    function ProgramReferralResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    ProgramReferralResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-referral';
    };
    ProgramReferralResourceService.prototype.saveReferralEncounter = function (payload) {
        if (!payload) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["from"])(null);
        }
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'Content-Type': 'application/json' });
        return this.http.post(this.getUrl(), JSON.stringify(payload), { headers: headers });
    };
    return ProgramReferralResourceService;
}());



/***/ }),

/***/ "./src/app/patient-dashboard/group-enrollment/group-enrollment.module.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/patient-dashboard/group-enrollment/group-enrollment.module.ts ***!
  \*******************************************************************************/
/*! exports provided: GroupEnrollmentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupEnrollmentModule", function() { return GroupEnrollmentModule; });
var GroupEnrollmentModule = /** @class */ /*@__PURE__*/ (function () {
    function GroupEnrollmentModule() {
    }
    return GroupEnrollmentModule;
}());



/***/ }),

/***/ "./src/app/patient-dashboard/services/patient.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/patient-dashboard/services/patient.service.ts ***!
  \***************************************************************/
/*! exports provided: PatientService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientService", function() { return PatientService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _models_patient_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/patient.model */ "./src/app/models/patient.model.ts");
/* harmony import */ var _openmrs_api_patient_resource_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../openmrs-api/patient-resource.service */ "./src/app/openmrs-api/patient-resource.service.ts");
/* harmony import */ var _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../openmrs-api/encounter-resource.service */ "./src/app/openmrs-api/encounter-resource.service.ts");
/* harmony import */ var _programs_patient_programs_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../programs/patient-programs.service */ "./src/app/patient-dashboard/programs/patient-programs.service.ts");





var PatientService = /** @class */ /*@__PURE__*/ (function () {
    function PatientService(patientResourceService, patientProgramsService, encounterResource) {
        this.patientResourceService = patientResourceService;
        this.patientProgramsService = patientProgramsService;
        this.encounterResource = encounterResource;
        this.currentlyLoadedPatient = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](null);
        this.currentlyLoadedPatientUuid = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](null);
        this.isBusy = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](false);
    }
    PatientService.prototype.setCurrentlyLoadedPatientByUuid = function (patientUuid) {
        if (this.currentlyLoadedPatient.value !== null) {
            // this means there is already a currently loaded patient
            var previousPatient = new _models_patient_model__WEBPACK_IMPORTED_MODULE_1__["Patient"](this.currentlyLoadedPatient.value);
            // fetch from server if patient is NOT the same
            if (previousPatient.uuid !== patientUuid) {
                this.fetchPatientByUuid(patientUuid);
            }
        }
        else {
            this.fetchPatientByUuid(patientUuid);
        }
        return this.currentlyLoadedPatient;
    };
    PatientService.prototype.fetchPatientByUuid = function (patientUuid) {
        var _this = this;
        // reset patient
        this.currentlyLoadedPatient.next(null);
        this.currentlyLoadedPatientUuid.next(null);
        // busy
        this.isBusy.next(true);
        // hit server
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])(this.patientResourceService.getPatientByUuid(patientUuid, false), this.patientProgramsService.getCurrentlyEnrolledPatientPrograms(patientUuid), this.encounterResource.getEncountersByPatientUuid(patientUuid)).subscribe(function (data) {
            var patient = data[0];
            patient.enrolledPrograms = data[1];
            patient.encounters = data[2];
            _this.currentlyLoadedPatient.next(new _models_patient_model__WEBPACK_IMPORTED_MODULE_1__["Patient"](patient));
            _this.currentlyLoadedPatientUuid.next(patientUuid);
            _this.isBusy.next(false);
        }, function (err) {
            console.error(err);
            _this.isBusy.next(false);
        });
    };
    PatientService.prototype.reloadCurrentPatient = function () {
        if (this.currentlyLoadedPatient.value !== null) {
            var previousPatient = new _models_patient_model__WEBPACK_IMPORTED_MODULE_1__["Patient"](this.currentlyLoadedPatient.value);
            this.fetchPatientByUuid(previousPatient.uuid);
        }
    };
    return PatientService;
}());



/***/ }),

/***/ "./src/app/program-manager/patient-referral-service.ts":
/*!*************************************************************!*\
  !*** ./src/app/program-manager/patient-referral-service.ts ***!
  \*************************************************************/
/*! exports provided: PatientReferralService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatientReferralService", function() { return PatientReferralService; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _patient_dashboard_programs_program_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../patient-dashboard/programs/program.service */ "./src/app/patient-dashboard/programs/program.service.ts");
/* harmony import */ var _openmrs_api_encounter_resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../openmrs-api/encounter-resource.service */ "./src/app/openmrs-api/encounter-resource.service.ts");
/* harmony import */ var _etl_api_program_referral_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../etl-api/program-referral-resource.service */ "./src/app/etl-api/program-referral-resource.service.ts");
/* harmony import */ var _openmrs_api_provider_resource_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../openmrs-api/provider-resource.service */ "./src/app/openmrs-api/provider-resource.service.ts");
/* harmony import */ var _etl_api_patient_program_resource_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../etl-api/patient-program-resource.service */ "./src/app/etl-api/patient-program-resource.service.ts");
/* harmony import */ var _etl_api_patient_referral_resource_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../etl-api/patient-referral-resource.service */ "./src/app/etl-api/patient-referral-resource.service.ts");










var PatientReferralService = /** @class */ /*@__PURE__*/ (function () {
    function PatientReferralService(programService, patientProgramResourceService, programReferralResourceService, encounterResourceService, providerResourceService, patientReferralResourceService) {
        this.programService = programService;
        this.patientProgramResourceService = patientProgramResourceService;
        this.programReferralResourceService = programReferralResourceService;
        this.encounterResourceService = encounterResourceService;
        this.providerResourceService = providerResourceService;
        this.patientReferralResourceService = patientReferralResourceService;
        this.formsComplete = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
    }
    PatientReferralService.prototype.createUpdatePatientEnrollment = function (payload) {
        var enrollPayload = this.programService.createEnrollmentPayload(payload.programUuid, payload.patient, payload.dateEnrolled || this.toOpenmrsDateFormat(new Date()), payload.dateCompleted ? payload.dateCompleted : null, payload.location, payload.enrollmentUuid);
        return this.programService.saveUpdateProgramEnrollment(enrollPayload);
    };
    PatientReferralService.prototype.saveReferralEncounter = function (encounter) {
        return this.programReferralResourceService.saveReferralEncounter(encounter);
    };
    PatientReferralService.prototype.getReferredByLocation = function (locationUuid, enrollmentUud) {
        return this.patientReferralResourceService
            .getReferralByLocationUuid(locationUuid, enrollmentUud);
    };
    PatientReferralService.prototype.getEncounterProvider = function (encounterUuid) {
        var subject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.encounterResourceService.getEncounterByUuid(encounterUuid).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (encounter) {
            var encounterProvider = lodash__WEBPACK_IMPORTED_MODULE_1__["first"](encounter.encounterProviders);
            if (encounterProvider) {
                subject.next(encounterProvider.provider);
            }
        });
        return subject;
    };
    PatientReferralService.prototype.getUserProviderDetails = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (user && user.person) {
                _this.providerResourceService
                    .getProviderByPersonUuid(user.person.uuid).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (provider) {
                    resolve(provider);
                }, function (error) {
                    reject(error);
                });
            }
            else {
                reject('User is required');
            }
        });
    };
    PatientReferralService.prototype.fetchAllProgramManagementConfigs = function (patientUuid) {
        var subject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.patientProgramResourceService.getPatientProgramVisitConfigs(patientUuid).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (programConfigs) {
            subject.next(programConfigs);
        });
        return subject;
    };
    PatientReferralService.prototype.getReferralPatientList = function (params) {
        var referralInfo = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]([]);
        var referralObservable = this.patientReferralResourceService
            .getPatientReferralPatientList({
            endDate: params.endDate,
            locationUuids: params.locationUuids,
            startDate: params.startDate,
            startAge: params.startAge,
            programUuids: params.programUuids,
            startIndex: params.startIndex
        });
        if (referralObservable === null) {
            throw new Error('Null referral provider observable');
        }
        else {
            referralObservable.take(1).subscribe(function (referrals) {
                referralInfo.next(referrals);
            });
        }
        return referralInfo.asObservable();
    };
    PatientReferralService.prototype.getProgramWorkflows = function (programUuid) {
        var subject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.programService.getProgramWorkFlows(programUuid).take(1).subscribe(function (workflows) {
            var programWorkflows = lodash__WEBPACK_IMPORTED_MODULE_1__["filter"](workflows, function (w) { return !w.retired; });
            subject.next(programWorkflows.length > 0);
        });
        return subject;
    };
    PatientReferralService.prototype.getProgramEnrollmentReferralLocation = function (enrollmentUuid) {
        var referral = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]([]);
        var referralObservable = this.patientReferralResourceService.getReferralByLocationUuid(enrollmentUuid);
        if (referralObservable === null) {
            throw new Error('Null referral location observable');
        }
        else {
            referralObservable.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(function (referrals) {
                referral.next(referrals);
            });
        }
        return referral.asObservable();
    };
    PatientReferralService.prototype.updateReferalNotificationStatus = function (payload) {
        return this.patientReferralResourceService.updateReferralNotificationStatus(payload);
    };
    PatientReferralService.prototype.getReferralEncounterDetails = function (encounterUuid) {
        return this.encounterResourceService.getEncounterByUuid(encounterUuid);
    };
    PatientReferralService.prototype.toOpenmrsDateFormat = function (dateToConvert) {
        var date = moment__WEBPACK_IMPORTED_MODULE_2__(dateToConvert);
        if (date.isValid()) {
            return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
        }
        return '';
    };
    return PatientReferralService;
}());



/***/ }),

/***/ "./src/app/program-manager/program-manager.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/program-manager/program-manager.module.ts ***!
  \***********************************************************/
/*! exports provided: ProgramManagerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramManagerModule", function() { return ProgramManagerModule; });
var ProgramManagerModule = /** @class */ /*@__PURE__*/ (function () {
    function ProgramManagerModule() {
    }
    return ProgramManagerModule;
}());



/***/ }),

/***/ "./src/app/program-manager/program-manager.service.ts":
/*!************************************************************!*\
  !*** ./src/app/program-manager/program-manager.service.ts ***!
  \************************************************************/
/*! exports provided: ProgramManagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramManagerService", function() { return ProgramManagerService; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _patient_referral_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./patient-referral-service */ "./src/app/program-manager/patient-referral-service.ts");
/* harmony import */ var _openmrs_api_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../openmrs-api/user.service */ "./src/app/openmrs-api/user.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _patient_dashboard_programs_program_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../patient-dashboard/programs/program.service */ "./src/app/patient-dashboard/programs/program.service.ts");
/* harmony import */ var _openmrs_api_person_resource_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../openmrs-api/person-resource.service */ "./src/app/openmrs-api/person-resource.service.ts");







var ProgramManagerService = /** @class */ /*@__PURE__*/ (function () {
    function ProgramManagerService(patientReferralService, programService, personResourceService, userService) {
        this.patientReferralService = patientReferralService;
        this.programService = programService;
        this.personResourceService = personResourceService;
        this.userService = userService;
        this.availablePrograms = [];
        this.requiredProgramQuestions = [];
        this.referralCompleteStatus = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
    }
    ProgramManagerService.prototype.enrollPatient = function (payload) {
        return this.patientReferralService.createUpdatePatientEnrollment(payload);
    };
    ProgramManagerService.prototype.referPatient = function (payload) {
        var encounter = lodash__WEBPACK_IMPORTED_MODULE_0__["first"](payload.submittedEncounter);
        lodash__WEBPACK_IMPORTED_MODULE_0__["extend"](payload, {
            notificationStatus: null,
            referralReason: '',
            state: null
        });
        if (encounter) {
            lodash__WEBPACK_IMPORTED_MODULE_0__["extend"](payload, { encounter: encounter.uuid });
            this.handleReferralWithEncounter(payload);
        }
        else {
            this.handleReferralWithProvider(payload);
        }
        return this.referralCompleteStatus;
    };
    ProgramManagerService.prototype.editProgramEnrollments = function (theChange, patient, programs, newLoc) {
        var _this = this;
        var programBatch = [];
        lodash__WEBPACK_IMPORTED_MODULE_0__["each"](programs, function (program) {
            var location = program.enrolledProgram._openmrsModel.location.uuid;
            var unenrollPayload = _this.programService.createEnrollmentPayload(program.programUuid, patient, _this.toOpenmrsDateFormat(program.dateEnrolled || program.enrolledProgram.dateEnrolled), _this.toOpenmrsDateFormat(program.dateCompleted || new Date()), location, program.enrolledProgram._openmrsModel.uuid);
            // if intra-ampath, unenroll and enroll in the new location
            if (theChange === 'location') {
                var enrollPayload = _this.programService.createEnrollmentPayload(program.programUuid, patient, _this.toOpenmrsDateFormat(program.dateEnrolled), null, newLoc, '');
                programBatch.push(_this.programService.saveUpdateProgramEnrollment(unenrollPayload));
                programBatch.push(_this.programService.saveUpdateProgramEnrollment(enrollPayload));
            }
            else {
                // just unenroll
                programBatch.push(_this.programService.saveUpdateProgramEnrollment(unenrollPayload));
            }
        });
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["forkJoin"])(programBatch);
    };
    ProgramManagerService.prototype.updatePersonHealthCenter = function (payload) {
        var personUuid = payload.person.uuid;
        delete payload.person;
        return this.personResourceService.saveUpdatePerson(personUuid, payload);
    };
    ProgramManagerService.prototype.handleReferralWithProvider = function (payload) {
        var _this = this;
        var currentUser = this.userService.getLoggedInUser();
        this.patientReferralService.getUserProviderDetails(currentUser)
            .then(function (provider) {
            if (provider) {
                lodash__WEBPACK_IMPORTED_MODULE_0__["extend"](payload, { provider: provider.uuid });
                _this.enrollPatientInReferredProgram(payload);
            }
        });
    };
    ProgramManagerService.prototype.handleReferralWithEncounter = function (payload) {
        var _this = this;
        this.patientReferralService.getEncounterProvider(payload.encounter)
            .subscribe(function (provider) {
            if (provider) {
                lodash__WEBPACK_IMPORTED_MODULE_0__["extend"](payload, { provider: provider.uuid });
                _this.enrollPatientInReferredProgram(payload);
            }
        });
    };
    ProgramManagerService.prototype.enrollPatientInReferredProgram = function (programInfo) {
        var _this = this;
        // 1. Enroll patient
        this.patientReferralService.createUpdatePatientEnrollment({
            programUuid: programInfo.programUuid,
            patient: programInfo.patient,
            location: programInfo.referredToLocation,
            dateEnrolled: programInfo.dateEnrolled,
            enrollmentUuid: ''
        }).subscribe(function (enrollment) {
            // 2. Save encounter
            lodash__WEBPACK_IMPORTED_MODULE_0__["extend"](programInfo, {
                patientProgram: enrollment.uuid,
                patient: programInfo.patient.uuid
            });
            delete programInfo.submittedEncounter;
            _this.saveReferral(programInfo, enrollment);
        }, function (error) {
            _this.handleError(error);
        });
    };
    ProgramManagerService.prototype.saveReferral = function (programInfo, enrollment) {
        var _this = this;
        this.patientReferralService.saveReferralEncounter(programInfo)
            .subscribe(function (savedEncounter) {
            // 3. complete referral if its referring back
            if (programInfo.patient_referral_id) {
                _this.patientReferralService.updateReferalNotificationStatus({
                    patient_referral_id: programInfo.patient_referral_id,
                    notificationStatus: 1
                }).subscribe(function (response) {
                    _this.handleSuccessfulReferral(response);
                }, function (error) {
                    console.log('updateReferalNotificationStatus error ====> ', error);
                    // complete the referral anyway
                    _this.handleError(error);
                });
            }
            else {
                _this.handleSuccessfulReferral(enrollment);
            }
        }, function (error) {
            _this.handleError(error);
        });
    };
    ProgramManagerService.prototype.handleSuccessfulReferral = function (response) {
        this.referralCompleteStatus.next(response);
    };
    ProgramManagerService.prototype.handleError = function (err) {
        this.referralCompleteStatus.error(err);
    };
    ProgramManagerService.prototype.toOpenmrsDateFormat = function (dateToConvert) {
        var date = dateToConvert ? moment__WEBPACK_IMPORTED_MODULE_1__(dateToConvert) : moment__WEBPACK_IMPORTED_MODULE_1__();
        if (date.isValid()) {
            return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
        }
        return '';
    };
    return ProgramManagerService;
}());



/***/ })

}]);