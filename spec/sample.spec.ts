import { describe } from 'mocha';
import { expect } from 'chai';
import { parseTextBotCommand } from '../src';
import { TEXTING_BOT_GROUPS } from './data';

describe('Sample test', () => {
  it('finds the correct message and group', () => {
    expect(parseTextBotCommand('txt hotline foo', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'foo',
    });
  });
});


describe('Basic functionality', () => {
  it('finds the correct message and group', () => {
    expect(parseTextBotCommand('txt hotline foo', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'foo',
    });
  });

  it('handles simple group name and message', () => {
    expect(parseTextBotCommand('txt saRT hello world', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: 'a',
      messageToSend: 'hello world',
    });
  });

  it('handles multi-word group names', () => {
    expect(parseTextBotCommand('txt A very long Name urgent update', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '2',
      messageToSend: 'urgent update',
    });
  });
});

 describe('Case sensitivity', () => {
  it('handles uppercase TXT command', () => {
    expect(parseTextBotCommand('TXT hotline message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });

  it('handles mixed case TXT command', () => {
    expect(parseTextBotCommand('TxT hotline message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });

  it('handles uppercase group name', () => {
    expect(parseTextBotCommand('txt HOTLINE message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });

  it('handles mixed case group name', () => {
    expect(parseTextBotCommand('txt HoTlInE message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });

  it('handles mixed case multi-word group', () => {
    expect(parseTextBotCommand('txt A VERY long Name message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '2',
      messageToSend: 'message',
    });
  });
});


describe('Whitespace handling', () => {
  it('handles extra spaces around txt command', () => {
    expect(parseTextBotCommand('   txt   hotline   message   ', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });

  it('handles multiple spaces in group name', () => {
    expect(parseTextBotCommand('txt A   very    long Name message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '2',
      messageToSend: 'message',
    });
  });

  it('handles tabs and mixed whitespace in group name', () => {
    expect(parseTextBotCommand('txt A very\t\tlong Name message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '2',
      messageToSend: 'message',
    });
  });

  it('preserves message formatting with multiple spaces', () => {
    expect(parseTextBotCommand('txt hotline hello    world', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'hello    world',
    });
  });
});


describe('Longest match priority', () => {
  it('chooses longest matching group name', () => {
    expect(parseTextBotCommand('txt test group message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '5',
      messageToSend: 'message',
    });
  });

  it('matches shorter group when longer is not applicable', () => {
    expect(parseTextBotCommand('txt test message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '4', 
      messageToSend: 'message',
    });
  });

  it('handles complex longest match scenario', () => {
    expect(parseTextBotCommand('txt A very long Name urgent', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '2',
      messageToSend: 'urgent',
    });
  });
});


describe('Word boundary validation', () => {
  it('does not match partial group names', () => {
    expect(parseTextBotCommand('txt hotlines message', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('does not match group name as part of larger word', () => {
    expect(parseTextBotCommand('txt testgroup message', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('matches group name at end of input', () => {
    expect(parseTextBotCommand('txt hotline', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: '',
    });
  });
});


describe('Message edge cases', () => {
  it('handles empty message', () => {
    expect(parseTextBotCommand('txt hotline', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: '',
    });
  });

  it('handles empty message with trailing spaces', () => {
    expect(parseTextBotCommand('txt hotline   ', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: '',
    });
  });

  it('handles message with only spaces', () => {
    expect(parseTextBotCommand('txt hotline     ', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: '',
    });
  });

  it('handles single character message', () => {
    expect(parseTextBotCommand('txt hotline a', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'a',
    });
  });

  it('handles very long message', () => {
    const longMessage = 'a'.repeat(1000);
    expect(parseTextBotCommand(`txt hotline ${longMessage}`, TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: longMessage,
    });
  });
});


describe('Special characters in messages', () => {
  it('handles message with punctuation', () => {
    expect(parseTextBotCommand('txt hotline Hello, world!', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'Hello, world!',
    });
  });

  it('handles message with numbers and symbols', () => {
    expect(parseTextBotCommand('txt hotline Meeting @ 3:30 PM - Room #101', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'Meeting @ 3:30 PM - Room #101',
    });
  });

  it('handles message with emojis', () => {
    expect(parseTextBotCommand('txt hotline Great job! 🎉👏', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'Great job! 🎉👏',
    });
  });

  it('handles message with newlines', () => {
    expect(parseTextBotCommand('txt hotline line1\nline2', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'line1\nline2',
    });
  });

  it('handles message with quotes', () => {
    expect(parseTextBotCommand('txt hotline He said "hello"', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '1',
      messageToSend: 'He said "hello"',
    });
  });
});


describe('Invalid inputs', () => {
  it('returns null for null input', () => {
    expect(parseTextBotCommand(null as any, TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for undefined input', () => {
    expect(parseTextBotCommand(undefined as any, TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for empty string', () => {
    expect(parseTextBotCommand('', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for whitespace only input', () => {
    expect(parseTextBotCommand('   ', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for non-string input', () => {
    expect(parseTextBotCommand(123 as any, TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for input without txt prefix', () => {
    expect(parseTextBotCommand('send hotline message', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for txt without space or content', () => {
    expect(parseTextBotCommand('txt', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for txtabc (txt not separated)', () => {
    expect(parseTextBotCommand('txthotline message', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for input too short', () => {
    expect(parseTextBotCommand('tx', TEXTING_BOT_GROUPS)).to.be.null;
  });
});


describe('Invalid groups parameter', () => {
  it('returns null for null groups', () => {
    expect(parseTextBotCommand('txt hotline message', null as any)).to.be.null;
  });

  it('returns null for undefined groups', () => {
    expect(parseTextBotCommand('txt hotline message', undefined as any)).to.be.null;
  });

  it('returns null for non-array groups', () => {
    expect(parseTextBotCommand('txt hotline message', {} as any)).to.be.null;
  });

  it('returns null for empty groups array', () => {
    expect(parseTextBotCommand('txt hotline message', [])).to.be.null;
  });

  it('handles groups with invalid entries', () => {
    const invalidGroups = [
      null,
      undefined,
      { id: '1' }, 
      { name: 'test' },
      { id: '', name: 'test' }, 
      { id: 'valid', name: '' }, 
      { id: 'valid', name: '   ' }, 
      { id: '2', name: 'valid group' }, 
    ];
    expect(parseTextBotCommand('txt valid group message', invalidGroups as any)).to.deep.equals({
      groupId: '2',
      messageToSend: 'message',
    });
  });
});


describe('No matching group scenarios', () => {
  it('returns null when no group matches', () => {
    expect(parseTextBotCommand('txt nonexistent message', TEXTING_BOT_GROUPS)).to.be.null;
  });

  it('returns null for partial group name match', () => {
    expect(parseTextBotCommand('txt hot message', TEXTING_BOT_GROUPS)).to.be.null;
  });

});


describe('Special characters in group names', () => {
  it('handles group names with periods', () => {
    expect(parseTextBotCommand('txt v1.0 team message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '10',
      messageToSend: 'message',
    });
  });

  it('handles group names with hyphens', () => {
    expect(parseTextBotCommand('txt front-end message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '11',
      messageToSend: 'message',
    });
  });

  it('handles group names with parentheses', () => {
    expect(parseTextBotCommand('txt team (alpha) message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '12',
      messageToSend: 'message',
    });
  });

  it('handles group names with brackets', () => {
    expect(parseTextBotCommand('txt team [beta] message', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '13',
      messageToSend: 'message',
    });
  });
});

describe('Duplicate group handling', () => {
  it('uses first occurrence when groups have same normalized name', () => {
    const groupsWithDuplicates = [
      { id: '1', name: 'Marketing Team' },
      { id: '2', name: 'MARKETING TEAM' }, 
      { id: '3', name: 'marketing    team' }, 
      { id: '4', name: 'Support' },
    ];
    expect(parseTextBotCommand('txt marketing team message', groupsWithDuplicates)).to.deep.equals({
      groupId: '1', 
      messageToSend: 'message',
    });
  });
});


describe('Performance and edge cases', () => {
  it('handles many groups efficiently', () => {
    const manyGroups = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      name: `group${i}`,
    }));
    manyGroups.push({ id: '1000', name: 'target' });
    
    expect(parseTextBotCommand('txt target message', manyGroups)).to.deep.equals({
      groupId: '1000',
      messageToSend: 'message',
    });
  });

  it('handles very long group names', () => {
    const longGroupName = 'very '.repeat(100) + 'long group name';
    const groups = [{ id: '1', name: longGroupName }];
    expect(parseTextBotCommand(`txt ${longGroupName} message`, groups)).to.deep.equals({
      groupId: '1',
      messageToSend: 'message',
    });
  });
});

describe('Real-world scenarios', () => {
  it('handles typical slack-style group names', () => {
    expect(parseTextBotCommand('txt general Hello everyone!', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '6',
      messageToSend: 'Hello everyone!',
    });
  });

  it('handles project-specific group names', () => {
    expect(parseTextBotCommand('txt project-alpha Status update: 75% complete', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '7',
      messageToSend: 'Status update: 75% complete',
    });
  });

  it('handles emergency scenarios', () => {
    expect(parseTextBotCommand('txt emergency URGENT: Server down!', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '9',
      messageToSend: 'URGENT: Server down!',
    });
  });

  it('handles casual messages', () => {
    expect(parseTextBotCommand('txt random Anyone up for coffee? ☕', TEXTING_BOT_GROUPS)).to.deep.equals({
      groupId: '14',
      messageToSend: 'Anyone up for coffee? ☕',
    });
  });
});


