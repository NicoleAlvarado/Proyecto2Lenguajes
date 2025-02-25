process.loadEnvFile();

export const { CONNECTION_STRING_DB, PORT, SALT_ROUNDS, SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV, API_URL } =
    process.env;
