declare global {
  namespace NodeJS {
    interface ProcessEnv {
        USERS_TABLE: string
        DONATION_TABLE: string
        ACCOUNT_ID: string
        REGION: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};