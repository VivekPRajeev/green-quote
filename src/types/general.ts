export interface LoginData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  api?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
