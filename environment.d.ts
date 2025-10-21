/**
 * This is used to tell Typescript what all we are loading in with our .env configuration files
 *
 * @author jordanskomer
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      DATABASE_NAME: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      ENV: 'local' | 'development' | 'staging' | 'production' | 'qa';
      JWT_SECRET: string;
      AWS_REGION: string;
      SESSION_SECRET: string;
      SESSION_SALT: string;
      COOKIE_SECRET: string;
      CI_BEARER_TOKEN: string;
      COLLEGE_FOOTBALL_DATA_API_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
