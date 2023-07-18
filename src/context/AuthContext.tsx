// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, IMailBox, LoginParams, UserDataType } from './types'

import { login } from 'src/utils/middleware'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setVerify: () => null
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('userData');
      if (storedToken) {
        setUser(JSON.parse(storedToken));
      }
      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params: LoginParams) => {
    // TODO: validate error on login
    await login(params.username, params.password);

    // TODO: remember me
    // params.rememberMe
    //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
    //   : null
    const returnUrl = router.query.returnUrl

    setUser({ username: params.username })

    window.localStorage.setItem('userData', JSON.stringify({ username: params.username }))

    const redirectURL = returnUrl && returnUrl !== '/verify' ? returnUrl : '/verify'

    router.replace(redirectURL as string)
  }

  const handleVerify = async (loguedInUserData: any) => {
    const userAuthorizedPages = loguedInUserData[2];

    const userData = loguedInUserData[0];
    const mailBoxs = loguedInUserData[3];
    const sesionData = loguedInUserData[4];
    const mailBoxsEnabled = mailBoxs?.length ? mailBoxs.sort((a: any, b: any) => Number(b.defaultCasilla) - Number(a.defaultCasilla)).map((mailBox: IMailBox) => mailBox.habilitado === true && mailBox.idCasilla) : [];
    const name = userData.nombre;

    const user = {
      username: userData.userName,
      userAuthorizedPages,
      token: sesionData.token,
      csll: mailBoxsEnabled[0],
      mailBoxs: JSON.stringify(mailBoxsEnabled),
      name,
      password: userData.passwd,
      profile: userData.perfil
    }

    setUser(user);
    window.localStorage.setItem('userData', JSON.stringify(user));
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    setVerify: handleVerify,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
