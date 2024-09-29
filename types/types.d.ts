export type DataType = {
  id: number;
  name: string;
  displayName: string | null;
  email: string;
  message: string;
  createdAt: Date;
  ableToShow: boolean;
};

export type DataModifyType = {
  id?: number;
  name?: string;
  displayName?: string | null;
  email?: string;
  message?: string;
  createdAt?: Date;
  ableToShow?: boolean;
};

export type SingleMessageType = {
  id?: number;
  name?: string;
  displayName?: string | null;
  email?: string;
  message?: string;
  createdAt?: Date;
  ableToShow?: boolean;
};

export type UserType = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  csrfToken: string;
  sessionId: string;
  authorized: boolean;
};

export type UserModifyType = {
  id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  csrfToken?: string;
  sessionId?: string;
  authorized?: boolean;
};
