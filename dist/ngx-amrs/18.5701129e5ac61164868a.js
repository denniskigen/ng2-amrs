(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[18],{

/***/ "./src/app/models/address.model.ts":
/*!*****************************************!*\
  !*** ./src/app/models/address.model.ts ***!
  \*****************************************/
/*! exports provided: PersonAddress */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonAddress", function() { return PersonAddress; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _base_model_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-model.model */ "./src/app/models/base-model.model.ts");
/* harmony import */ var _serializable_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serializable.decorator */ "./src/app/models/serializable.decorator.ts");





var PersonAddress = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PersonAddress, _super);
    function PersonAddress(openmrsModel) {
        return _super.call(this, openmrsModel) || this;
    }
    Object.defineProperty(PersonAddress.prototype, "preferred", {
        get: function () {
            return this._openmrsModel.preferred;
        },
        set: function (v) {
            this._openmrsModel.preferred = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address1", {
        get: function () {
            return this._openmrsModel.address1;
        },
        set: function (v) {
            this._openmrsModel.address1 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address2", {
        get: function () {
            return this._openmrsModel.address2;
        },
        set: function (v) {
            this._openmrsModel.address2 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address3", {
        get: function () {
            return this._openmrsModel.address3;
        },
        set: function (v) {
            this._openmrsModel.address3 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address4", {
        get: function () {
            return this._openmrsModel.address4;
        },
        set: function (v) {
            this._openmrsModel.address4 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address5", {
        get: function () {
            return this._openmrsModel.address5;
        },
        set: function (v) {
            this._openmrsModel.address5 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "address6", {
        get: function () {
            return this._openmrsModel.address6;
        },
        set: function (v) {
            this._openmrsModel.address6 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "cityVillage", {
        get: function () {
            return this._openmrsModel.cityVillage;
        },
        set: function (v) {
            this._openmrsModel.cityVillage = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "stateProvince", {
        get: function () {
            return this._openmrsModel.stateProvince;
        },
        set: function (v) {
            this._openmrsModel.stateProvince = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "country", {
        get: function () {
            return this._openmrsModel.country;
        },
        set: function (v) {
            this._openmrsModel.country = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "countyDistrict", {
        get: function () {
            return this._openmrsModel.countyDistrict;
        },
        set: function (v) {
            this._openmrsModel.countyDistrict = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonAddress.prototype, "postalCode", {
        get: function () {
            return this._openmrsModel.postalCode;
        },
        set: function (v) {
            this._openmrsModel.postalCode = v;
        },
        enumerable: true,
        configurable: true
    });
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "preferred", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address1", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address2", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address3", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address4", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address5", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "address6", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "cityVillage", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "stateProvince", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "country", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "countyDistrict", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAddress.prototype, "postalCode", null);
    return PersonAddress;
}(_base_model_model__WEBPACK_IMPORTED_MODULE_1__["BaseModel"]));



/***/ }),

/***/ "./src/app/models/person-attribute-type.model.ts":
/*!*******************************************************!*\
  !*** ./src/app/models/person-attribute-type.model.ts ***!
  \*******************************************************/
/*! exports provided: PersonAttributeType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonAttributeType", function() { return PersonAttributeType; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _base_model_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-model.model */ "./src/app/models/base-model.model.ts");
/* harmony import */ var _serializable_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serializable.decorator */ "./src/app/models/serializable.decorator.ts");





var PersonAttributeType = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PersonAttributeType, _super);
    // private name: string;
    function PersonAttributeType(openmrsModel) {
        return _super.call(this, openmrsModel) || this;
    }
    Object.defineProperty(PersonAttributeType.prototype, "name", {
        get: function () {
            return this._openmrsModel.name;
        },
        set: function (v) {
            this._openmrsModel.name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], PersonAttributeType.prototype, "name", null);
    return PersonAttributeType;
}(_base_model_model__WEBPACK_IMPORTED_MODULE_1__["BaseModel"]));



/***/ }),

/***/ "./src/app/models/person-attribute.model.ts":
/*!**************************************************!*\
  !*** ./src/app/models/person-attribute.model.ts ***!
  \**************************************************/
/*! exports provided: PersonAttribute */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonAttribute", function() { return PersonAttribute; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _base_model_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-model.model */ "./src/app/models/base-model.model.ts");
/* harmony import */ var _serializable_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serializable.decorator */ "./src/app/models/serializable.decorator.ts");
/* harmony import */ var _person_attribute_type_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./person-attribute-type.model */ "./src/app/models/person-attribute-type.model.ts");






var PersonAttribute = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PersonAttribute, _super);
    function PersonAttribute(openmrsModel) {
        return _super.call(this, openmrsModel) || this;
    }
    Object.defineProperty(PersonAttribute.prototype, "attributeType", {
        get: function () {
            if (this._attributeType === null || this._attributeType === undefined) {
                this.initializeNavigationProperty('');
                this._attributeType = new _person_attribute_type_model__WEBPACK_IMPORTED_MODULE_3__["PersonAttributeType"](this._openmrsModel.attributeType);
            }
            return this._attributeType;
        },
        set: function (v) {
            this._openmrsModel.attributeType = v.openmrsModel;
            this._attributeType = v;
        },
        enumerable: true,
        configurable: true
    });
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", _person_attribute_type_model__WEBPACK_IMPORTED_MODULE_3__["PersonAttributeType"]),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_person_attribute_type_model__WEBPACK_IMPORTED_MODULE_3__["PersonAttributeType"]])
    ], PersonAttribute.prototype, "attributeType", null);
    return PersonAttribute;
}(_base_model_model__WEBPACK_IMPORTED_MODULE_1__["BaseModel"]));



/***/ }),

/***/ "./src/app/models/person.model.ts":
/*!****************************************!*\
  !*** ./src/app/models/person.model.ts ***!
  \****************************************/
/*! exports provided: Person */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Person", function() { return Person; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _base_model_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-model.model */ "./src/app/models/base-model.model.ts");
/* harmony import */ var _serializable_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serializable.decorator */ "./src/app/models/serializable.decorator.ts");
/* harmony import */ var _date_extensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./date.extensions */ "./src/app/models/date.extensions.ts");
/* harmony import */ var _date_extensions__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_date_extensions__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _person_attribute_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./person-attribute.model */ "./src/app/models/person-attribute.model.ts");
/* harmony import */ var _address_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./address.model */ "./src/app/models/address.model.ts");








var Person = /** @class */ /*@__PURE__*/ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Person, _super);
    function Person(openmrsModel) {
        var _this = _super.call(this, openmrsModel) || this;
        _this._attributes = _this.openmrsModel.attributes;
        _this._convertedAttributes = [];
        return _this;
    }
    Object.defineProperty(Person.prototype, "gender", {
        get: function () {
            return this._openmrsModel.gender;
        },
        set: function (v) {
            this._openmrsModel.gender = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "age", {
        get: function () {
            return this._openmrsModel.age;
        },
        set: function (v) {
            this._openmrsModel.age = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "birthdate", {
        get: function () {
            if (this._birthdate === null || this._birthdate === undefined) {
                this._birthdate = new Date(this._openmrsModel.birthdate);
            }
            return this._birthdate;
        },
        set: function (v) {
            this._openmrsModel.birthdate = v.toServerTimezoneString();
            this._birthdate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "preferredName", {
        get: function () {
            return this._openmrsModel.preferredName;
        },
        set: function (v) {
            this._openmrsModel.preferredName = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "attributes", {
        get: function () {
            if (this._attributes === null || this._attributes === undefined) {
                this.initializeNavigationProperty('');
                this._attributes = new _person_attribute_model__WEBPACK_IMPORTED_MODULE_4__["PersonAttribute"](this._openmrsModel.attributes);
            }
            return this._attributes;
        },
        set: function (v) {
            this._openmrsModel.attributes = v.openmrsModel;
            this._attributes = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "healthCenter", {
        get: function () {
            var healthCenterPersonAttributeTypeUuid = '8d87236c-c2cc-11de-8d13-0010c6dffd0f';
            if (this._attributes) {
                var location_1 = this.getPersonAttribute(healthCenterPersonAttributeTypeUuid);
                if (location_1) {
                    return location_1.display;
                }
                else {
                    return '';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "nextofkinPhoneNumber", {
        get: function () {
            var nextofkinPhoneNumberPersonAttributeTypeUuid = 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d';
            if (this._attributes) {
                var nextofkinPhoneNumber = this.getPersonAttribute(nextofkinPhoneNumberPersonAttributeTypeUuid);
                if (nextofkinPhoneNumber) {
                    return nextofkinPhoneNumber;
                }
                else {
                    return '';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "patnerPhoneNumber", {
        get: function () {
            var patnerPhoneNumberPersonAttributeTypeUuid = 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46';
            if (this._attributes) {
                var patnerPhoneNumber = this.getPersonAttribute(patnerPhoneNumberPersonAttributeTypeUuid);
                if (patnerPhoneNumber) {
                    return patnerPhoneNumber;
                }
                else {
                    return '';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "alternativePhoneNumber", {
        get: function () {
            var alternativePhoneNumberPersonAttributeTypeUuid = 'c725f524-c14a-4468-ac19-4a0e6661c930';
            if (this._attributes) {
                var alternativePhoneNumber = this.getPersonAttribute(alternativePhoneNumberPersonAttributeTypeUuid);
                if (alternativePhoneNumber) {
                    return alternativePhoneNumber;
                }
                else {
                    return '';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "patientPhoneNumber", {
        get: function () {
            var phoneNumberPersonAttributeTypeUuid = '72a759a8-1359-11df-a1f1-0026b9348838';
            if (this._attributes) {
                var phoneNumber = this.getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
                if (phoneNumber) {
                    return phoneNumber;
                }
                else {
                    return '';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "contacts", {
        get: function () {
            var phoneNumberPersonAttributeTypeUuid = '72a759a8-1359-11df-a1f1-0026b9348838';
            var patnerPhoneNumberPersonAttributeTypeUuid = 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46';
            var alternativePhoneNumberPersonAttributeTypeUuid = 'c725f524-c14a-4468-ac19-4a0e6661c930';
            var nextofkinPhoneNumberPersonAttributeTypeUuid = 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d';
            if (this._attributes) {
                var filteredContacts = void 0;
                var patnerPhoneNumber = this.getPersonAttribute(patnerPhoneNumberPersonAttributeTypeUuid);
                var patientPhoneNumber = this.getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
                var alternativePhoneNumber = this.getPersonAttribute(alternativePhoneNumberPersonAttributeTypeUuid);
                var nextofkinPhoneNumber = this.getPersonAttribute(nextofkinPhoneNumberPersonAttributeTypeUuid);
                if ((patnerPhoneNumber) === undefined && (patientPhoneNumber) === undefined &&
                    (alternativePhoneNumber) === undefined && (nextofkinPhoneNumber) === undefined &&
                    (patientPhoneNumber) === undefined) {
                    if ((this._attributes)) {
                        filteredContacts = { 'default': this._attributes };
                    }
                    else {
                        filteredContacts = { 'default': '' };
                    }
                }
                else {
                    filteredContacts = {
                        patnerPhoneNumber: (patnerPhoneNumber),
                        patientPhoneNumber: (patientPhoneNumber),
                        alternativePhoneNumber: (alternativePhoneNumber),
                        nextofkinPhoneNumber: (nextofkinPhoneNumber)
                    };
                }
                return filteredContacts;
            }
            else {
                return this._attributes = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Person.prototype.getPersonAttribute = function (personAttributeTypeUuid) {
        if (this._attributes.length > 0) {
            for (var i in this._attributes) {
                if (this._attributes.hasOwnProperty(i)) {
                    var attr = this._attributes[i];
                    if (attr.attributeType && attr.attributeType.uuid === personAttributeTypeUuid) {
                        return attr.value;
                    }
                }
            }
        }
    };
    Object.defineProperty(Person.prototype, "addresses", {
        get: function () {
            if (this._address === null || this._address === undefined) {
                this.initializeNavigationProperty('');
                this._address = new _address_model__WEBPACK_IMPORTED_MODULE_5__["PersonAddress"](this._openmrsModel.addresses);
            }
            return this._address;
        },
        set: function (v) {
            this._openmrsModel.addresses = v.openmrsModel;
            this._address = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "preferredAddress", {
        get: function () {
            return this._openmrsModel.preferredAddress;
        },
        set: function (v) {
            this._openmrsModel.preferredAddress = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "dead", {
        get: function () {
            return this._openmrsModel.dead;
        },
        set: function (v) {
            this._openmrsModel.dead = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "birthdateEstimated", {
        get: function () {
            return this._openmrsModel.birthdateEstimated;
        },
        set: function (v) {
            this._openmrsModel.birthdateEstimated = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "deathDate", {
        get: function () {
            return this._openmrsModel.deathDate;
        },
        set: function (v) {
            this._openmrsModel.deathDate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "causeOfDeath", {
        get: function () {
            if (this._openmrsModel.causeOfDeath) {
                return this._openmrsModel.causeOfDeath.display;
            }
            return '';
        },
        set: function (v) {
            this._openmrsModel.causeOfDeath = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "causeOfDeathUuId", {
        get: function () {
            if (this._openmrsModel.causeOfDeath) {
                return this._openmrsModel.causeOfDeath.uuid;
            }
            return '';
        },
        set: function (v) {
            this._openmrsModel.causeOfDeathUuId = v;
        },
        enumerable: true,
        configurable: true
    });
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], Person.prototype, "gender", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Number),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [Number])
    ], Person.prototype, "age", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Date),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [Date])
    ], Person.prototype, "birthdate", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(false, true),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], Person.prototype, "preferredName", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", _person_attribute_model__WEBPACK_IMPORTED_MODULE_4__["PersonAttribute"]),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_person_attribute_model__WEBPACK_IMPORTED_MODULE_4__["PersonAttribute"]])
    ], Person.prototype, "attributes", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(false, true),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], Person.prototype, "preferredAddress", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Boolean),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [Boolean])
    ], Person.prototype, "dead", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Boolean),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [Boolean])
    ], Person.prototype, "birthdateEstimated", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Date),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [Date])
    ], Person.prototype, "deathDate", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], Person.prototype, "causeOfDeath", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_serializable_decorator__WEBPACK_IMPORTED_MODULE_2__["serializable"])(true, false),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", String),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [String])
    ], Person.prototype, "causeOfDeathUuId", null);
    return Person;
}(_base_model_model__WEBPACK_IMPORTED_MODULE_1__["BaseModel"]));



/***/ })

}]);