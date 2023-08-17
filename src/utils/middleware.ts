import { APIRequest } from "./APIRequest";
import authConfig from 'src/configs/auth'
import { AppResponse, IPage, IUserData } from "src/context/types";

const MESSAGE_OK = "OK";
const ERROR_MESSAGE = 'Lo sentimos, ha ocurrido un error'
const ERROR_RESPONSE = { isOk: false, errorMessage: ERROR_MESSAGE }

const handlerApiResponse = (response: any): AppResponse => {
  // Primera validación
  if (response.data.status !== 200 || response.data.message !== MESSAGE_OK) {
    return { isOk: false, errorMessage: "Servicio no se encuentra disponible" };
  }

  // Segunda validación
  const response2 = JSON.parse(response.data.result);
  const errorMessage = response2.message || ERROR_MESSAGE;

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


export const login = async (username: string, password: string): Promise<AppResponse> => {
  try {
    const headers = { "CSRFP466": password }

    const response = await APIRequest.post({
      path: `${authConfig.apiUsuario}/usuario/login?pus3rN4m3=${username}`,
      headers
    });

    return handlerApiResponse(response);
  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}

export const getUserAuthorizedPages = (user: IUserData | null): IPage[]  => {
  const pages: IPage[] = [];

  if (!user || !user?.username) return pages;
  else if (!user?.token || !user?.profile || !user.password) return [{ pag: "verify" }];
  else if (!user.userAuthorizedPages?.length) return pages;

  return user.userAuthorizedPages;
}

export const checkGoogleAuthCode = async (username: string, code: string): Promise<AppResponse> => {
  try {
    const headers = { "CSRFC0d160": code }

    const response = await APIRequest.post({
      path: `${authConfig.apiUsuario}/usuario/login/token?pus3rN4m3=${username}`,
      headers
    });

    return handlerApiResponse(response);
  } catch (error) {
    console.error(error);

    return ERROR_RESPONSE;
  }
}

export const forgotPassword = async (username: string, code: string): Promise<AppResponse> => {
  try {
      const headers = {
          "CSRFC0d160": code
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiUsuario}/usuario/correo/olvido/clave?pus3rN4m3=${username}`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
    console.error(error);

    return ERROR_RESPONSE;
  }
}

export const recoveryUserPassword = async (userName: string, userToken: string, newPassword: string, code: string): Promise<AppResponse> => {
  try {
      const headers = {
          "CSRFC0d160": code,
          "CSRFPassNueva": newPassword,
          "CSRFTokenMail": userToken,
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiAdmin}/adm/usuario/p4ssw0rd/nologeado/cambiar?usuario=${userName}`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}

export const validateTempToken = async (userName: string, userToken: string):Promise<AppResponse>  => {
  try {
      const headers = {
          "pus3rN4m3": userName,
          "CSRFTokenMail": userToken,
      };
      const response = await APIRequest.post({
          path: `${authConfig.apiUsuario}/usuario/acceso/validar`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
      console.error(error)

      return ERROR_RESPONSE;
  }
}

export const unlockUser = async (userName: string, userToken: string) => {
  try {
      const headers = {
          "CSRFTokenMail": userToken
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiUsuario}/usuario/activar?pus3rN4m3=${userName}`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}

export const enabledUser = async (userName: string, userToken: string, currentPassword: string, newPassword: string, code: string) => {
  try {
      const headers = {
          "CSRFTokenMail": userToken,
          "CSRFPassAnterior": currentPassword,
          "CSRFPassNueva": newPassword,
          "CSRFC0d160": code
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiAdmin}/adm/usuario/p4ssw0rd/bloqueado/cambiar?usuario=${userName}`,
          headers
      });

      return handlerApiResponse(response);

    } catch (error) {
      console.error(error)

      return ERROR_RESPONSE;
    }
}

export const updateUserPassword = async (userName: string, currentPassword: string, newPassword: string, code: string) => {
  try {
      const headers = {
          "CSRFPassAnterior": currentPassword,
          "CSRFPassNueva": newPassword,
          "CSRFC0d160": code
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiAdmin}/adm/usuario/p4ssw0rd/logeado/cambiar?usuario=${userName}`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
    console.error(error)

    return ERROR_RESPONSE;
  }
}

export const updateUserPasswordExpirated = async (userName: string, currentPass: string, newPass: string, code: string) :Promise<AppResponse> => {
  try {
      const headers = {
          "CSRFC0d160": code,
          "CSRFPassAnterior": currentPass,
          "CSRFPassNueva": newPass,
          "userName": userName
      };

      const response = await APIRequest.post({
          path: `${authConfig.apiAdmin}/adm/usuario/p4ssw0rd/expirar`,
          headers
      });

      return handlerApiResponse(response);

  } catch (error) {
      console.error(error)

return ERROR_RESPONSE;
  }
}
