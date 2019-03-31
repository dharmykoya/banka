export default class Transaction {
  constructor(id, createdOn, type, accountNumber, cashier, amount, oldBalance, newBalance) {
      this.id = id;
      this.createdOn = createdOn;
      this.type = type,       
      this.accountNumber = accountNumber;
      this.cashier = cashier;
      this.amount = amount;
      this.oldBalance = oldBalance;
      this.newBalance = newBalance;
  }
}
