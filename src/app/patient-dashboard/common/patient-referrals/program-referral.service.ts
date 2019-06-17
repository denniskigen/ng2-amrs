import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { LocalStorageService } from '../../../utils/local-storage.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';

@Injectable()
export class ProgramReferralService {
  public availablePrograms: any[] = [];
  public enrolledPrograms: any = [];
  public department: string;
  public patientProgramVisitConfigs: any = {};
  public programVisitConfig: any;
  public selectedProgram: any;

  constructor(
    private localStorageService: LocalStorageService,
    private patientProgramResourceService: PatientProgramResourceService,
    private programManagerService: ProgramManagerService,
    public userDefaultPropertiesService: UserDefaultPropertiesService) { }

  // get patient_program_config
  // filter config and get the program object
  // look for incompatible programs and unenroll from them
  // construct enrollment payload and pass on to referPatient
  public referPatient(patient, referralData: any) {
    const location = localStorage.getItem('referralLocation');
    const referredFromLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const referralVisitEncounter = localStorage.getItem('referralVisitEncounter');

    const payload = {
      dateEnrolled: moment().format('YYYY-MM-DD'),
      patient: patient,
      programUuid: referralData.programUuid,
      referredToLocation: location,
      referredFromLocation: referredFromLocation.uuid,
      submittedEncounter: referralVisitEncounter ? JSON.parse(referralVisitEncounter) : referralData.submittedEncounter
    };
    console.log('Referral: ', payload);
    return this.programManagerService.referPatient(payload);
  }
}
