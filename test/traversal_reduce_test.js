const expect = require('expect');
const focalize = require('../src');

describe('Traversal#reduce(acc, initial)', () => {
  const traversal = focalize.select(account => account.type === 'debit');
  const tasks = [
    { id: 1, account: 'Savings', type: 'debit', amount: 3200 },
    { id: 2, account: 'Current', type: 'debit', amount: 1250 },
    { id: 3, account: 'Credit', type: 'credit', amount: -250 }
  ];

  it('reduces results with a given function', () => {
    expect(traversal.reduce(tasks, (acc, account) => acc + account.amount, 0)).toBe(4450);
  });
});
