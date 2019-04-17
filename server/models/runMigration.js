import CreateTableMigrations from './createTableMigrations';

const {
  UserSchema,
  SuperAdmin,
} = CreateTableMigrations;

(async () => {
  try {
    await UserSchema();
    await SuperAdmin();
    return true;
  } catch (error) { return error; }
})();
