'use strict';
const assert = require('assert');

class BankAccount {
  constructor(accountNumber, owner) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.transactions = [];
  }
  balance() {
    let sum = 0;
    for (let i = 0; i < this.transactions.length; i++) {
      sum += this.transactions[i].amount;
    }
    return sum;
    // const sumTransactions = this.transactions;
    // sumTransactions.reduce((acc, cur) => acc + cur.amount, 0);
    // return sumTransactions;
  }
  deposit(amount) {
    if (amount > 0) {
      let depositTransaction = new Transaction(amount, 'Deposit');
      this.transactions.push(depositTransaction);
    }
  }

  charge(payee, amount) {
    let currBalance = this.balance();

    if (amount <= currBalance) {
      let chargeTransaction = new Transaction(-amount, payee);
      this.transactions.push(chargeTransaction);
    }
  }
}

class SavingsAccount extends BankAccount {
  constructor(accountNumber, owner, interestRate) {
    super(accountNumber, owner);
    this.interestRate = interestRate;
  }
  accrueInterest() {
    let balance = this.balance();
    let interestAmount = balance * this.interestRate;
    let interestTransaction = new Transaction(
      interestAmount,
      'Interest Payment'
    );
    this.transactions.push(interestTransaction);
  }
}

class Transaction {
  constructor(amount, payee) {
    this.date = new Date();
    this.amount = amount;
    this.payee = payee;
  }
}

// const myAccount = new BankAccount(123456, 'Stephen Lyssy');
// console.log(myAccount);

// myAccount.deposit(100);
// console.log(myAccount);
// myAccount.charge('target', 50);
// console.log(myAccount.transactions[1].payee);
// console.log(myAccount.balance());
// console.log(myAccount.transactions);

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
      assert.equal(acct1.transactions[0].amount, 1000);
      assert.equal(acct1.balance(), 1000);
      acct1.charge('Home Depot', 250);
      assert.equal(acct1.transactions[1].amount, -250);
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

  describe('#Testing transaction creation for withdrawals.', () => {
    it('Should create a transaction object correctly for a charge', () => {
      let t1 = new Transaction(-55.6, 'Home Depot');
      assert.equal(t1.amount, -55.6);
      assert.equal(t1.payee, 'Home Depot');
      assert.notEqual(t1.date, undefined);
      assert.notEqual(t1.date, null);
    });
  });

  describe('Transactions and tests', () => {
    let testAccount = new BankAccount('987456321', 'Tyler Joseph');
    it('Should correctly create an account.', () => {
      assert.equal(testAccount.owner, 'Tyler Joseph');
      assert.equal(testAccount.accountNumber, '987456321');
      assert.equal(testAccount.balance(), 0);
    });

    it('Should deposit money correctly.', () => {
      testAccount.deposit(300);
      testAccount.deposit(100);
      testAccount.deposit(-25);
      testAccount.deposit(100.25);
      assert.equal(testAccount.transactions.length, 3);
      assert.equal(testAccount.balance(), 500.25);
      testAccount.charge('Zero Account', 500.25);
      assert.equal(testAccount.balance(), 0);
    });

    it('Should charge money correctly.', () => {
      testAccount.deposit(100000);
      testAccount.charge('USAA', 3000.25); //96,999.75
      assert.equal(testAccount.transactions[5].payee, 'USAA');
      assert.equal(testAccount.transactions[5].amount, -3000.25);
      testAccount.charge('Capital One', 10000); //86,999.75
      testAccount.charge("Maria's Tacos", -25.45); //87,025.20
      testAccount.charge('Exxon', 100); //86,925.20
      assert.equal(testAccount.transactions.length, 9);
      assert.equal(testAccount.balance(), 86925.2);
    });

    it('Should NOT allow overdrafts.', () => {
      testAccount.charge('USAA', 130000.25);
      assert.equal(testAccount.transactions.length, 9);
      assert.equal(testAccount.balance(), 86925.2);
    });
  });

  describe('Should track and allocate interest payments.', () => {
    it('Create new savings account', () => {
      let saving = new SavingsAccount('321456987', 'Francis Judge', 0.1);
      assert.equal(saving.accountNumber, '321456987');
      assert.equal(saving.owner, 'Francis Judge');
      assert.equal(saving.interestRate, 0.1);
      assert.equal(saving.balance(), 0);
    });

    it('Should create transactions base on the interest rate and balance. Includes charges only.', () => {
      let saving = new SavingsAccount('321456987', 'Francis Judge', 0.1);
      assert.equal(saving.accountNumber, '321456987');
      assert.equal(saving.owner, 'Francis Judge');
      assert.equal(saving.interestRate, 0.1);
      assert.equal(saving.balance(), 0);
      saving.deposit(1000);
      saving.accrueInterest();
      assert.equal(saving.balance(), 1100);
    });

    it('Should create transactions base on the interest rate and balance. Includes deposits and charges.', () => {
      let saving = new SavingsAccount('321456987', 'Francis Judge', 0.1);
      saving.deposit(1000);
      saving.charge('ATM', 300);
      saving.accrueInterest();
      assert.equal(saving.balance(), 770);
    });
  });
}
