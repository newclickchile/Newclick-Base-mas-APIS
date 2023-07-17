const urlBase = 'http://localhost:3005';

export default {
  meEndpoint: '/auth/me',
  apiUsuario: `${urlBase}/api-usuario`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
