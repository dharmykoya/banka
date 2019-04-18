import CreateTableMigrations from './createTableMigrations';

const {
  UserSchema,
  AccountSchema,
  TransactionSchema,
  SuperAdmin,
} = CreateTableMigrations;

(async () => {
  try {
    await UserSchema();
    await AccountSchema();
    await TransactionSchema();
    await SuperAdmin();
    return true;
  } catch (error) { return error; }
})();
