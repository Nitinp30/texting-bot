import { Group } from '../interfaces';
import { normalizeString } from '../utils/normalize'

export const preprocessGroups = (groups: Group[]): Array<Group & { normalizedName: string }> => {
  const validGroups = groups

  const normalizedGroupsMap = new Map<string, Group & { normalizedName: string }>();
  for (const group of validGroups) {
    const normalizedName = normalizeString(group.name);
  
    if (!normalizedGroupsMap.has(normalizedName)) {
      normalizedGroupsMap.set(normalizedName, {
        ...group,
        normalizedName
      });
    }
  }
  
  return Array.from(normalizedGroupsMap.values())
    .sort((a, b) => b.normalizedName.length - a.normalizedName.length);
};