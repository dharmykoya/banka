import CreateTableMigrations from './createTableMigrations';

const {
  UserSchema,
  AccountSchema,
  SuperAdmin,
} = CreateTableMigrations;

(async () => {
  try {
    await UserSchema();
    await AccountSchema();
    await SuperAdmin();
    return true;
  } catch (error) { return error; }
})();
