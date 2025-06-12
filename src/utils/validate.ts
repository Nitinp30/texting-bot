
import {  Group } from '../interfaces';
export const isValidGroup = (group: unknown): group is Group => {
  return (
    typeof group === 'object' &&
    group !== null &&
    'id' in group &&
    'name' in group &&
    typeof (group as Group).id === 'string' &&
    typeof (group as Group).name === 'string' &&
    (group as Group).id.trim().length > 0 &&
    (group as Group).name.trim().length > 0
  );
};