import { ParseTextBotCommandOutput, Group } from './interfaces';
import { preprocessGroups } from './parser/preprocessGroups';
import { findMatchingGroup } from './parser/findMatchingGroup';
import { extractMessage } from './parser/extractMessage'
/**
 * We're writing a command line program that users can use to send text messages
 * to different groups of people. The program will take in a string, and parse it
 * to determine which group of people to send the message to, and what the message
 * should be.
 *
 * For example, if the user says "txt GROUP1 Hello, world!", the program
 * should send the message "Hello, world!" to everyone in GROUP1.
 *
 * If there is a group named "sart group", and the user says "txt sart group Hello, world!",
 * then we'll send a text message to everyone in the "sart group" group.
 *
 * Your goal here is to implement the `parseTextBotCommand` function, which will
 * determine the group to send the message to, and the message to send.
 *
 * Details:
 * - When parsing the group name, please ignore any leading or
 * trailing whitespace, case, and any whitespace between words (e.g.,
 * if the group name contains multiple words). For example, if the message is
 * "txt   hotline  1  Hello,  world!" then it should send the message "Hello,  world!"
 * to the "hotline 1" group. If the group name is hotline and the message is "txt hot line hello"
 * then it should send the message "hello" to the group "hotline". You can assume there
 * is at least one whitespace character between the group name and the message.
 * - If the message provided could refer to multiple different groups
 * then please use the longest group in the groups array
 * is the correct one. For example, if "test copy" and "test" are both
 * possible groups, then "txt test copy one" should send the message "one"
 * to the "test copy" group.
 *
 * - Once you've parsed the group name please return the
 * message with leading and trailing whitespace removed and no
 * other changes. Empty values for "messageToSend" are allowed.
 *
 * If you cannot determine a group and message, return null.
 *
 * @param rawInput
 */

export const parseTextBotCommand = (rawInput: string, groups: Group[]): ParseTextBotCommandOutput | null => {
  if (!rawInput || typeof rawInput !== 'string') {
    return null;
  }
  
  if (!groups || !Array.isArray(groups)) {
    return null;
  }
  
  const trimmedInput = rawInput.trim();

  if (trimmedInput.length < 4) {
    return null;
  }

  if (!trimmedInput.toLowerCase().startsWith('txt ')) {
    return null;
  }

  const afterTxt = trimmedInput.slice(3);
  if (!afterTxt || afterTxt.trim().length === 0) {
    return null;
  }
  
  
  const preprocessedGroups = preprocessGroups(groups);

  const match = findMatchingGroup(afterTxt, preprocessedGroups);

  if (!match) {
    return null;
  }

  const message = extractMessage(afterTxt, match.messageStart);
  
  return {
    groupId: match.group.id,
    messageToSend: message
  };

};
