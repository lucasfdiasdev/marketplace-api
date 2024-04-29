export interface IRegisterBody {
  email: string;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

// activate user
export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export interface ILoginRequest {
  email: string;
}
