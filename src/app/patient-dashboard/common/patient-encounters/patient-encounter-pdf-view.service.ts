import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

const pdfMake = require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');

export class PatientEncounterPdfViewService {
  constructor() {}

  public generatePdf(sectionDefinitions: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (sectionDefinitions) {
        const pdfStructure = this.generatePdfEncounterObj(sectionDefinitions);
        const pdfProxy = pdfMake.createPdf(JSON.parse(JSON.stringify(pdfStructure)));

        pdfProxy.getBase64((output) => {
          const int8Array: Uint8Array = this._base64ToUint8Array(output);
          const blob = new Blob([int8Array], {
              type: 'application/pdf'
          });

          observer.next({
            pdfSrc: URL.createObjectURL(blob),
            pdfDefinition: pdfStructure,
            pdfProxy: pdfProxy
          });
        });
      } else {
        observer.error('Some required information is missing');
      }
    }).pipe(first());
  }

  public generatePdfEncounterObj(pdfReportSections: any) {
    const mainReportObject = this.generateReportHeaders();
    _.each(pdfReportSections, (section: any, sectionIndex) => {
      const sectionIndicatorLabels = [];
      const sectionIndicatorValues = [];
      _.each(section.indicators, (sectionIndicator: any, index) => {
        sectionIndicatorLabels.push([sectionIndicator.label]);
        let indicatorValue = ':';
        const indicatorDefinition = sectionIndicator.indicator;
        sectionIndicatorValues.push([sectionIndicator.ref]);
      });

      const sectionData = {
        sectionHead: section.sectionTitle,
        sectionLabels: sectionIndicatorLabels,
        sectionDataValues: sectionIndicatorValues
      };

      const reportSection = this.generateReportSection(sectionData);
      mainReportObject.content.push(reportSection);
    });
  }

  private _base64ToUint8Array(base64: any): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  private generateReportSection(sectionData): any {
    return {
      style: 'tableExample',
      table: {
        widths: ['*'],
        body: [
          [
            [{
              table: {
                widths: ['*'],
                body: [
                  [{
                    text: sectionData.sectionHead,
                    style: 'sectionhead'
                  }]
                ]
              }
            }]
          ],
          [
            {
              table: {
                widths: [310, 10, 10, '*'],
                body: [
                  [{
                    table: {
                      widths: ['*'],
                      body: sectionData.sectionLabels
                   }
                  }, {
                    text: ''
                  }, {
                    text: ''
                  },
                  [
                    {
                      table: {
                        widths: [50, '*'],
                        body: sectionData.sectionDataValues
                      }
                    }
                  ]]
                ]
              }
            }
          ]
        ]
      }
    };
  }

  private generateReportHeaders(): any {
    return {
      content: [
        {
          text: 'Observations',
          style: 'header',
          alignment: 'left'
        },
        {
          text: 'Patient Encounter Report',
          style: 'subheader'
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      },
      defaultStyle: { fontSize: 10 }
    };
  }
}
