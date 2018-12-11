import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { take } from 'rxjs/operators';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PatientEncounterPdfViewService } from './patient-encounter-pdf-view.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';

@Component({
  selector: 'patient-encounter-pdf-view',
  templateUrl: './patient-encounter-pdf-view.component.html',
  styleUrls: ['./patient-encounter-pdf-view.component.css']
})

export class PatientEncounterPdfViewComponent implements OnInit {
  public errorFlag = false;
  public isBusy = false;
  public numberOfPages: number = 0;
  public page: number = 1;
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;
  public pdfSrc: string = null;
  public sectionDefinitions = [
    "Encounter Details",
    "OB/Gyn History",
    "Family Planning",
    "Current Medication",
    "Current Symptoms",
    "Clinical Comments",
    "Plan",
    "Next Appointment"
  ];
  public securedUrl: SafeResourceUrl;
  public selectedEncounter: any;

  constructor(
    private encounterResourceService: EncounterResourceService,
    private patientEncounterPdfViewService: PatientEncounterPdfViewService,
    private domSanitizer: DomSanitizer) {}

  public ngOnInit() {}

  // public resolveEncounterObs(encounter) {
  //   const encounterUuid = encounter.uuid;
  //   if (this.selectedEncounter) {
  //     if (encounterUuid === this.selectedEncounter.uuid) { return; }
  //   }
  //   this.selectedEncounter = encounter;
  //   this.encounterResourceService.getEncounterByUuid(encounterUuid)
  //     .pipe(
  //     take(1)).subscribe((compiledSchema) => {
  //         console.log('Compiled Schema Pages: ', compiledSchema.pages);
  //         compiledSchema.pages.forEach((label) => {
  //           this.sectionDefinitions.push(label);
  //         });
  //         console.log('Section definitions: ', this.sectionDefinitions);
  //     });
  //   console.log('Selected encounter available: ', this.selectedEncounter);
  // }


  public generatePdf(sectionDefinitions): void {
    if (sectionDefinitions) {
      this.isBusy = true;
      console.log('making pdf');
      this.patientEncounterPdfViewService.generatePdf(sectionDefinitions)
        .pipe(take(1))
        .subscribe(
          (pdf) => {
            this.pdfSrc = pdf.pdfSrc;
            this.pdfMakeProxy = pdf.pdfProxy;
            this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.isBusy = false;
          },
          (err) => {
            console.error(err);
            this.errorFlag = true;
            this.isBusy = false;
          }
        );
    }
  }

  public afterLoadCompletes(pdf: PDFDocumentProxy): void {
    this.numberOfPages = pdf.numPages;
    this.pdfProxy = pdf;
  }

  public printPatientEncounterReport(): void {
    this.pdfMakeProxy.print();
  }

  public downloadPdf(): void {
    this.pdfMakeProxy.download(('patient_encounter_report') + '.pdf');
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }
}
