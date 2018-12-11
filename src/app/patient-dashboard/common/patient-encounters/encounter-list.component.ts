import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Encounter } from '../../../models/encounter.model';
import { NgModel } from '@angular/forms';
import { PatientEncounterProviderPipe } from './patient-encounter-provider.pipe';
import { PatientEncounterPdfViewService } from './patient-encounter-pdf-view.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'encounter-list',
  templateUrl: './encounter-list.component.html',

})
export class EncounterListComponent implements OnInit {
  @ViewChild('patientEncounterPdf')
  @Input() public encountersLoading = false;
  @Input() public encounters: Encounter[];
  @Input('messageType') public messageType: string;
  @Input('message') public message: string;
  @Input('isVisible') public isVisible: boolean;
  @Output() public onEncounterEdit = new EventEmitter();
  @Output() public isBusy = new EventEmitter();
  @Output() public onShowPrettyEncounterViewer = new EventEmitter();
  // @Output() public onPrint = new EventEmitter();
  @Output() public onEncounterObservations = new EventEmitter();
  @Input() public encounterTypes: any [];
  @Input() public showPagination = true;
  @Input() public showFilterers = true;
  public selectedEncounterType: any = [];
  public encounterFilterTypeArray: any = [];
  public sectionDefinitions: any[];
  public selectedEncounter: any;
  public data = [];
  public pdfView: any;
  public sectionsDef = [];
  public isLoadingReport = false;
  public showInfoMessage = false;
  public errorMessage = '';
  public statusError = false;


  constructor(
    private encounterResourceService: EncounterResourceService,
    private patientEncounterPdfViewService: PatientEncounterPdfViewService
  ) {}

  public ngOnInit() {
  }

  public editEncounter(encounter) {
    this.onEncounterEdit.emit(encounter);
  }

  public showEncounterObservations(encounter) {
    this.isBusy.emit(true);
    this.onEncounterObservations.emit(encounter);
    // console.log('Show observations', encounter);

  }

  public showEncounterViewer(encounterObj) {
    this.isBusy.emit(true);
    this.onShowPrettyEncounterViewer.emit(encounterObj);
  }

  public printEncounter(encounter) {
    this.generateReport(encounter);
  }

  public generateReport(encounter) {
    // this.displayEncounterObs(encounter);
    this.isLoadingReport = true;
    this.showInfoMessage = false;
    this.statusError = false;
    if (this.pdfView && this.pdfView.generateReport) {
      this.pdfView.generateReport();
    }
  }

  public onEncounterTypeChange(selectedEncounterType) {
    let count = 0;

    this.encounterFilterTypeArray.forEach((element) => {
      if (element === selectedEncounterType) {
        count++;
      }
    });

    if (count === 0 && selectedEncounterType !== '') {
      this.encounterFilterTypeArray.push(selectedEncounterType);
    } else if (count === 0 && selectedEncounterType === '') {

      this.encounterFilterTypeArray = this.encounterTypes;

    } else {
      // if all is selected then add all the items in the encounter types array
      alert(selectedEncounterType);
      alert('Item is already in filter');
    }
  }

  public clearEncounterFilter() {
    this.encounterFilterTypeArray = [];
  }

  public removeFilterItem(i) {
    this.encounterFilterTypeArray.splice(i, 1);
  }

  // public displayEncounterObs(encounter) {
  //   console.log('called...')
  //   const encounterUuid = encounter.uuid;
  //   if (this.selectedEncounter) {
  //       if (encounterUuid === this.selectedEncounter.uuid) { return; }
  //   }
  //   this.selectedEncounter = encounter;
  //   this.encounterResourceService.getEncounterByUuid(encounterUuid)
  //       .pipe(
  //       take(1)).subscribe((compiledSchema) => {
  //           console.log('Compiled Schema Pages: ', compiledSchema.pages);
  //           compiledSchema.pages.forEach((label) => {
  //             this.sectionDefinitions.push(label);
  //           });
  //           console.log('Section definitions: ', this.sectionDefinitions);
  //       });
  // }
}
