import cloudbase from '@cloudbase/js-sdk';

const app = cloudbase.init({
  env: 'yun-develop-8gcjefhj9c90ce20',
});

export const db = app.database();
export const _ = db.command;

export default app;