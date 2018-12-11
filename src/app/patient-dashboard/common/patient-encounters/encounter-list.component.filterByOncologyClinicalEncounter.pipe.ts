import { EncounterType } from '../../../models/encounter-type.model';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

const oncologyClinicalEncountersArray = [
  "5fa823ce-7592-482f-a0aa-361abf326ade",
  "ba5a15eb-576f-496b-a58d-e30b802a5da5",
  "3a0e7e4e-426e-4dc7-8f60-9114c43432eb",
  "d17b3adc-0837-4ac6-862b-0953fc664cb8",
  "3945005a-c24f-478b-90ec-4af84ffcdf6b",
  "36927b3c-db32-4063-90df-e45640e9aabc",
  "be7b0971-b2ab-4f4d-88c7-e7322aa58dbb",
  "eca95bb1-b651-45b7-85f8-2d3ce7e8313e",
  "bf762b3e-b60a-436a-a40b-f874c59869ec",
  "a4c4dacc-11ff-4301-99a4-88d52c1390d5",
  "00da8227-e7da-43c2-99b2-a4f237dd3924",
  "50f307c4-b92e-4a41-bbbb-5cee1bd1c561",
  "2cd62224-5507-48ee-a7b3-55f66162b148",
  "eeb9600c-314f-4071-9122-133ff3da37bb",
  "9ad5292c-14c3-489b-9c14-5f816e839691",
  "e58469f1-f6be-4e53-a843-fb06f93c60ba",
  "81166f83-1ee6-486e-8f56-aca528fc0fc0"
];

@Pipe({
  name: 'clinicalEncounterFilter',
  pure: false
})

export class ClinicalEncounterFilter implements PipeTransform {
  public transform(oncologyClinicalEncountersArray, encounterType) {
    if (_.includes(oncologyClinicalEncountersArray, encounterType.uuid)) {
      return true;
    } else {
      return false;
    }
  }
}!