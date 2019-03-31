export default class Account {
  constructor(id, accountNumber, createdOn, owner, type, status, balance) {
    this.id = id;
    this.accountNumber = accountNumber;
    this.createdOn = createdOn;
    this.owner = owner;
    this.type = type;
    this.status = status;
    this.balance = balance;
  }
}
