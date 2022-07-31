'use strict';
const assert = require('assert');

class BankAccount {
  constructor(accountNumber, owner) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.transactions = [];
  }
  balance() {
    const sumTransactions = this.transactions.reduce(
      (acc, cur) => acc + cur,
      0
    );
    return sumTransactions;
  }
  deposit(amount) {
    if (amount > 0) {
      let depositTransaction = new Transaction(amount, 'Deposit');
      this.transactions.push(depositTransaction.amount);
    }
  }

  charge(payee, amount) {
    let balance = this.balance();

    if (amount <= balance) {
      let chargeTransaction = new Transaction(amount * -1, payee);
      this.transactions.push(chargeTransaction.amount);
    }
  }
}

class Transaction {
  constructor(amount, payee) {
    this.date = new Date();
    this.amount = amount;
    this.payee = payee;
  }
}

const myAccount = new BankAccount(123456, 'Stephen Lyssy');
console.log(myAccount);

myAccount.deposit(100);
console.log(myAccount);
myAccount.charge('target', -50);
console.log(myAccount);

// # Start Test Section
if (typeof describe === 'function') {
  const assert = require('assert');
  describe('#Testing account creation', () => {
    it('should create a new account correctly', () => {
      let acct1 = new BankAccount('123456', 'James Doe');
      assert.equal(acct1.owner, 'James Doe');
      assert.equal(acct1.accountNumber, '123456');
      assert.equal(acct1.transactions.length, 0);
      assert.equal(acct1.balance(), 0);
    });
  });

  describe('#Testing account balance', () => {
    it('should track transactions and update balance.', () => {
      let acct1 = new BankAccount('123456', 'James Doe');
      acct1.deposit(1000);
      assert.equal(acct1.transactions[0], 1000);
      assert.equal(acct1.balance(), 1000);
      acct1.charge('Home Depot', 250);
      assert.equal(acct1.transactions[1], -250);
      assert.equal(acct1.balance(), 750);
    });
  });

  describe('#Testing that negative amounts cannot be deposited', () => {
    it('negative deposits should not be added to the transactions array.', () => {
      let acct1 = new BankAccount('123456', 'James Doe');
      acct1.deposit(-100);
      assert.equal(acct1.transactions.length, 0);
    });
  });

  describe('#Testing that overdrafts are NOT permitted', () => {
    it('Overdrafts should not be allowed, but you can withdraw everything.', () => {
      let acct1 = new BankAccount('123456', 'James Doe');
      acct1.charge('Walmart', 100);
      assert.equal(acct1.balance(), 0);
      acct1.deposit(101);
      acct1.charge('Walmart', 100);
      assert.equal(acct1.balance(), 1);
      acct1.charge('7-11', 1, 0);
    });
  });

  describe('#Testing to see if refunds are allowed.', () => {
    it('Refunds should be allowed', () => {
      let acct1 = new BankAccount('123456', 'James Doe');
      acct1.charge('Pizza Hut', -100);
      assert.equal(acct1.balance(), 100);
    });
  });

  describe('#Testing transaction creation', () => {
    it('Should create a transaction object correctly for a deposit', () => {
      let t1 = new Transaction(500, 'Deposit');
      assert.equal(t1.amount, 500);
      assert.equal(t1.payee, 'Deposit');
      assert.notEqual(t1.date, undefined);
      assert.notEqual(t1.date, null);
    });
  });

  describe('#Testing transaction creation', () => {
    it('Should create a transaction object correctly for a charge', () => {
      let t1 = new Transaction(-55.6, 'Home Depot');
      assert.equal(t1.amount, -55.6);
      assert.equal(t1.payee, 'Home Depot');
      assert.notEqual(t1.date, undefined);
      assert.notEqual(t1.date, null);
    });
  });
}
