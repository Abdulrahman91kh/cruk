declare global {
  namespace NodeJS {
    interface ProcessEnv {
        USERS_TABLE: string
        DONATION_TABLE: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};