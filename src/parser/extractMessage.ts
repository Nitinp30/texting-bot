
export const extractMessage = (text: string, startPosition: number): string => {
    const trimmedText = text.trim();
    const messageWithLeadingSpace = trimmedText.slice(startPosition);
   
    return messageWithLeadingSpace.replace(/^\s+/, '');
  };