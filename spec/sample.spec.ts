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

