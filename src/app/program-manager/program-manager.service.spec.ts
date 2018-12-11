import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import { PatientReferralResourceService } from '../etl-api/patient-referral-resource.service';
import { PatientReferralService } from './patient-referral-service';
import { PatientProgramResourceService } from '../etl-api/patient-program-resource.service';
import { PersonResourceService } from '../openmrs-api/person-resource.service';
import { ProgramService } from '../patient-dashboard/programs/program.service';
import { ProgramReferralResourceService  } from '../etl-api/program-referral-resource.service';
import { ProgramEnrollmentResourceService } from '../openmrs-api/program-enrollment-resource.service';
import { ProgramManagerService } from './program-manager.service';
import { ProgramResourceService } from '../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../openmrs-api/program-workflow-state-resource.service';
import { ProviderResourceService } from '../openmrs-api/provider-resource.service';
import { UserService } from '../openmrs-api/user.service';

import { HttpClient } from '@angular/common/http';

describe('Service: ProgramManager', () => {
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['']);
  const appsettingsServiceSpy = jasmine.createSpyObj('AppSettingsService', ['']);
  const encounterResourceServiceSpy = jasmine.createSpyObj('EncounterResourceService', ['']);
  const patientReferralServiceSpy = jasmine.createSpyObj('PatientReferralService', ['']);
  const patientProgramResourceServiceSpy = jasmine.createSpyObj('PatientProgramResourceService', ['']);
  const patientReferralResourceServiceSpy = jasmine.createSpyObj('PatientReferralResourceService', ['']);
  const personResourceServiceSpy = jasmine.createSpyObj('PersonResourceService', ['']);
  const programResourceServiceSpy = jasmine.createSpyObj('ProgramResourceService', ['']);
  const programRefererralResourceServiceSpy = jasmine.createSpyObj('ProgramReferralResourceService', ['']);
  const programServiceSpy = jasmine.createSpyObj('ProgramService', ['']);
  const programWorkFlowResourceServiceSpy = jasmine.createSpyObj('ProgramWorkFlowResourceService', ['']);
  const programWorkFlowStateResourceServiceSpy = jasmine.createSpyObj('ProgramWorkFlowStateResourceService', ['']);
  const providerResourceServiceSpy = jasmine.createSpyObj('ProviderResourceSpy', ['']);
  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);

  let service: ProgramManagerService;

  beforeEach(() => {
    service = new ProgramManagerService(
      <any>
      patientReferralServiceSpy,
      programServiceSpy,
      personResourceServiceSpy,
      userServiceSpy);

    TestBed.configureTestingModule({
      providers: [
        PatientReferralService,
        PersonResourceService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramManagerService,
        { provide: AppSettingsService, useValue: appsettingsServiceSpy },
        { provide: EncounterResourceService, useValue: encounterResourceServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: PatientProgramResourceService, useValue: patientProgramResourceServiceSpy },
        { provide: PatientReferralResourceService, useValue: patientReferralResourceServiceSpy },
        { provide: ProgramResourceService, useValue: programResourceServiceSpy },
        { provide: ProgramReferralResourceService, useValue: programRefererralResourceServiceSpy },
        { provide: ProgramWorkFlowResourceService, useValue: programWorkFlowResourceServiceSpy },
        { provide: ProgramWorkFlowStateResourceService, useValue: programWorkFlowStateResourceServiceSpy },
        { provide: ProviderResourceService, useValue: providerResourceServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
  });

  // afterEach(() => {
  //   TestBed.resetTestingModule();
  // });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should have all the functions defined', () => {
    expect(service.availablePrograms).toBeTruthy();
    expect(service.editProgramEnrollments).toBeTruthy();
    expect(service.enrollPatient).toBeTruthy();
    expect(service.referPatient).toBeTruthy();
    expect(service.referralCompleteStatus).toBeTruthy();
    expect(service.requiredProgramQuestions).toBeTruthy();
    expect(service.updatePersonHealthCenter).toBeTruthy();
  });

  it('should enroll patient from payload data', () => {
    const patientPayload = {
      programUuid: 1,
      patient: 'Test Patient',
      dateEnrolled: new Date(),
      dataCompleted: new Date(),
      location: 'Test Location',
      enrollmentUuid: 10
    };

    patientReferralResourceServiceSpy.createUpdatePatientEnrollment(patientPayload);
  });
});
