import { IPage, IUserData } from "src/configs/interfaces";
import { APIRequest } from "./APIRequest";
import authConfig from 'src/configs/auth'

export interface AppResponse {
  isOk: boolean;
  errorMessage: string;
  responseData?: any;
  responseStatus?: number;
}

const MESSAGE_OK = "OK";
const ERROR_RESPONSE = { isOk: false, errorMessage: "Error en servicio" }

const handlerApiResponse = (response: any): AppResponse => {
  // Primera validación
  if (response.data.status !== 200 || response.data.message !== MESSAGE_OK) {
    return { isOk: false, errorMessage: "Servicio no se encuentra disponible" };
  }

  // Segunda validación
  const response2 = JSON.parse(response.data.result);
  const errorMessage = response2.message || "Error en servicio"

  if (response2.status !== 200 || response2.message !== MESSAGE_OK) {
    if (response2.status === 401) {
      return { isOk: false, errorMessage };
    }
    if (response2.status === 509) {
      return {
        isOk: false,
        responseStatus: response2.status,
        errorMessage
      };
    }
    if (response2.status === 510) {
      return {
        isOk: false,
        responseData: response2.result,
        responseStatus: response2.status,
        errorMessage
      };
    }
    else if (response2.status === 404) {
      return {
        isOk: false,
        responseStatus: response2.status,
        errorMessage
      };
    }

    return { isOk: false, errorMessage };
  }

  return { isOk: true, responseData: response2.result, errorMessage: "" };
}


export const login = async (username: string, password: string) => {
  try {
    const headers = { "CSRFP466": password }

    const response = await APIRequest.post({
      path: `${authConfig.loginEndpoint}?pus3rN4m3=${username}`,
      headers
    });

    return handlerApiResponse(response);
  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}

export const getUserAuthorizedPages = (user: IUserData) => {
  console.log('user :', user);
  const pages: IPage[] = [];

  if (!user || !user?.username) return pages;
  else if (!user?.token || !user?.profile || !user.password) return [{ pag: "verify" }];
  else if (!user.userAuthorizedPages?.length) return pages;

  return user.userAuthorizedPages;
}

export const checkGoogleAuthCode = async (username: string, code: string) => {
  try {
    const headers = { "CSRFC0d160": code }

    const response = await APIRequest.post({
      path: `${authConfig.urlUsuario}/usuario/login/token?pus3rN4m3=${username}`,
      headers
    });

    return handlerApiResponse(response);
  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}