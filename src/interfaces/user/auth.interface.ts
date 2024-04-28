export interface IRegisterBody {
  email: string;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}
