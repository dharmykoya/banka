const SQL = {
  UsersTable: `CREATE TABLE IF NOT EXISTS users (
    id serial primary key NOT NULL,
    email varchar(128) NOT NULL UNIQUE,
    first_name varchar(128) NOT NULL,
    last_name varchar(128) NOT NULL,
    password varchar(256) NOT NULL,
    profile_image varchar(256) NULL,
    type varchar(10) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS accounts (
            id serial primary key NOT NULL,
            account_number integer NOT NULL UNIQUE,
            owner integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            type varchar(12) NOT NULL,
            status varchar(12) NOT NULL DEFAULT 'active',
            balance numeric(15, 2) NOT NULL,
            created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
    CREATE TABLE IF NOT EXISTS transactions (
            id serial primary key NOT NULL,
            type varchar(12) NOT NULL,
            account_number integer NOT NULL,
            cashier integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount numeric(15, 2) NOT NULL,
            old_balance numeric(15, 2) NOT NULL,
            new_balance numeric(15, 2) NOT NULL,
            created_on TIMESTAMP WITH TIME ZONE DEFAULT now()
            )`,

  SuperAdmin: `insert into 
        users(email, first_name, last_name, password, type, admin) 
        values (
          'dharmykoya38@gmail.com', 
          'Damilola', 
          'Adekoya',
          '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
          'staff', 
          true
          )`,

  Staff: `insert into 
        users(email, first_name, last_name, password, type, admin) 
        values (
          'phil@gmail.com', 
          'Phillip', 
          'Newman',
          '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
          'staff', 
          false
        )`,

  Client: `insert into 
        users(email, first_name, last_name, password, type, admin) 
        values (
          'martin@gmail.com', 
          'Martins', 
          'Oguns',
          '$2b$08$XsJYgQbVYbBAbbFnyYVP6.Y9OLG0quY7SZVZRL35maIZz1CG4IKFm', 
          'client', 
          false
        )`,

  AccountA: `insert into accounts(account_number, owner, type, status, balance) 
        values (
          '2000000000', 
          '3', 
          'savings',
          'dormant', 
          '4000'
        )`,

  AccountB: `insert into accounts(account_number, owner, type, status, balance) 
        values (
          '2000000001', 
          '3', 
          'current',
          'active', 
          '4000'
        )`,

  TransactionA: `insert into 
        transactions(type, account_number, cashier, 
        amount, old_balance, new_balance) 
        values (
          'credit', 
          '2000000000', 
          '2',
          '3000',
          '4000',
          '7000'
        )`,

  TransactionB: `insert into 
        transactions(type, account_number, cashier, 
          amount, old_balance, new_balance) 
        values (
          'debit', 
          '2000000000', 
          '2',
          '3000', 
          '7000',
          '4000'
        )`,

  TransactionC: `insert into 
        transactions(type, account_number, cashier, 
          amount, old_balance, new_balance) 
        values (
          'credit', 
          '2000000001', 
          '2',
          '3000',
          '4000', 
          '7000'
        )`,

  TransactionD: `insert into 
        transactions(type, account_number, cashier, 
          amount, old_balance, new_balance) 
        values (
          'debit', 
          '2000000001', 
          '2',
          '3000',
          '7000', 
          '4000'
        )`,
};

export default SQL;
