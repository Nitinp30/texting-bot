import { Group } from '../interfaces';
import { normalizeString } from '../utils/normalize';
import { escapeRegexChars } from '../utils/regex';

export const findMatchingGroup = (
  afterTxtText: string,
  preprocessedGroups: Array<Group & { normalizedName: string }>
): { group: Group & { normalizedName: string }, messageStart: number } | null => {
  const normalizedInput = normalizeString(afterTxtText);
  
  for (const group of preprocessedGroups) {
    const groupName = group.normalizedName;
    
    if (normalizedInput.startsWith(groupName)) {
      const afterGroupName = normalizedInput.slice(groupName.length);
      
      if (afterGroupName === '' || afterGroupName.startsWith(' ')) {
        const originalTrimmed = afterTxtText.trim();
        const groupNamePattern = escapeRegexChars(group.name.trim()).replace(/\s+/g, '\\s+');
        const regex = new RegExp(`^${groupNamePattern}(?=\\s|$)`, 'i');
        
        const match = originalTrimmed.match(regex);
        if (match) {
          return {
            group,
            messageStart: match[0].length
          };
        }
      }
    }
  }
  
  return null;
};
