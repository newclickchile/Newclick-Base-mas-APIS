export type ErrCallbackType = (err: { [key: string]: string }) => void

export interface IUserData {
  username?: string;
  token?: string;
  csll?: string;
  mailBoxs?: string;
  name?: string;
  profile?: string;
  password?: string;
  userAuthorizedPages?: IPage[];
};

export type LoginParams = {
  username: string
  password: string
}
export interface AppResponse {
  isOk: boolean;
  errorMessage: string;
  responseData?: any;
  responseStatus?: number;
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export interface IMailBox {
  idCasilla: string;
  username: string;
  habilitado: boolean;
};

export interface IPage {
  id?: number
  ipPerfil?: string
  pag: string
  titulo?: string
  orden?: number
  muestraMenuCasilla?: boolean
}

export type UserDataType = {
  id?: number
  role?: string
  email?: string
  fullName?: string
  username?: string
  password?: string
  avatar?: string | null
  aclAbilities?: string[]

  userAuthorizedPages?: IPage[];
  token?: string;
  csll?: string;
  mailBoxs?: string;
  name?: string;
  profile?: string;

}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  setVerify: (params: any, errorCallback?: ErrCallbackType) => void
}
