var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', ()=>{
  it('should generate correct message obj', ()=>{
    var msg = generateMessage('John', 'eloelo');
    expect(msg.from).toBe('John');
    expect(msg.text).toBe('eloelo');
  })
});
