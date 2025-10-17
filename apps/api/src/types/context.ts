import { Context } from "hono";

export interface AuthVariables {
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  [key: string]: any;
}

export type AuthContext = Context<{ Variables: AuthVariables }>;
