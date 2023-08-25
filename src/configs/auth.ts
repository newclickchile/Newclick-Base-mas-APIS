const urlBase = process.env.NEXT_PUBLIC_URL_BASE

export default {
  meEndpoint: '/auth/me',
  apiUsuario: `${urlBase}/api-usuario`,
  apiAdmin: `${urlBase}/api-adm`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
