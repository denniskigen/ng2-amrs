import { Component, OnInit, ViewChild } from '@angular/core';

import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';

@Component({
  selector: 'patient-encounter-report-base',
  template: 'patient-encounter-report-base.component.html',
  styleUrls: ['./patient-encounter-port.base.component.css']
})
export class PatientEncounterReportBaseComponent {
  @ViewChild('patientEncounterPdf')
  public pdfView: any;
  public data = [];
  public sectionsDef = [];
  public statusError = false;

  constructor(public encounterResourceService: EncounterResourceService) {}

  public generateReport() {
    
  }
}
