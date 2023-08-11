// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import router from 'next/router'
import { FormInput } from 'src/components/form/FormInput'
import AppAlert from 'src/components/notification/AppAlert'
import { login } from 'src/utils/middleware'
import AuthWrapper from 'src/components/auth/AuthWrapper'

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  password: '',
  username: ''
}

interface FormData {
  username: string
  password: string
}

const AlertLockUser = (props: { userEmail: string }) => {
  return <AppAlert
    sx={{ mb: 4 }}
    severity='warning'
    appTitle={<Icon icon='mdi-lock' style={{ fontSize: '2em' }} />}
    message={
      <>
        Tu usuario ha sido bloqueado, hemos enviado un mensaje de correo electrónico a:
        <Box sx={{ fontWeight: 600, my: '4px !important', textAlign: 'center' }}>{props.userEmail}</Box>
        <Box mt={4}>
          Comprueba tu bandeja de entrada y sigue las instrucciones para continuar.
        </Box>
      </>
    }
  />
}

const AlertExpiredUserPassword = (props: { userName: string, onClick: () => void }) => {
  return <AppAlert
    severity='warning'
    appTitle={<>¡Bienvenido {props.userName}! 👋🏻</>}
    message={
      <>
        Por motivos de seguridad tu contraseña ha expirado.
        <Box mt={4}>Sigue los siguientes pasos para actualizar.</Box>
      </>
    }
  >
    <Button onClick={props.onClick} fullWidth size='large' type='button' variant='contained' sx={{ mt: 7 }}>
      Continuar
    </Button>
  </AppAlert>
}

const LoginPage = () => {
  const auth = useAuth()
  const [userMustUpdatePassword, setUserMustUpdatePassword] = useState<boolean>(false);
  const [userIsLock, setUserIsLock] = useState<boolean>(false);
  const [userNameToUpdatePassword, setUserNameToUpdatePassword] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',

  })

  const onSubmit = async (data: FormData) => {
    const { username, password } = data

    const response = await login(username, password);

    if (response.isOk) {
      localStorage.clear();
      const returnUrl = router.query.returnUrl

      auth.setUser({ username })

      window.localStorage.setItem('userData', JSON.stringify({ username }))

      const redirectURL = returnUrl && returnUrl !== '/verify' ? returnUrl : '/verify'

      router.replace(redirectURL as string)

    }
    else {
      if (response?.responseStatus === 509) {
        setUserMustUpdatePassword(true);
        setUserNameToUpdatePassword(data.username);
      }
      else if (response?.responseStatus === 510) {
        setUserEmail(response.responseData);
        setUserIsLock(true);
      }
      else {
        toast.error(response.errorMessage);
      }

    }
  }

  const handleGoToRecoveryPage = () => {
    router.replace({
      pathname: '/update-password',
      query: { username: userNameToUpdatePassword }
    })
  }

  const LoginForm = () => {
    return (
      <>
        <Box sx={{ mb: 6 }}>
          <TypographyStyled variant='h5'>Bienvenido a {themeConfig.templateName}! 👋🏻</TypographyStyled>
          <Typography variant='body2'>Ingresa tus credenciales para acceder al sistema.</Typography>
        </Box>

        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            errors={errors}
            control={control}
            placeholder="Usuario"
            label='Nombre de usuario'
            name='username'
            rules={{ required: "Nombre de usuario es requerido" }}
          />

          <FormInput
            errors={errors}
            control={control}
            placeholder="Contraseña"
            label='Contraseña'
            name='password'
            type='password'
            rules={{
              required: "Contraseña es requerida",
              pattern: {
                value: /^[a-zA-Z0-9_.-]*$/,
                message: "Solo se permite un valor alfanúmerico además de .(punto) - (guión medio) _ (guión bajo)"
              }
            }}
          />

          <Box sx={{ my: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'end' }}>
            <LinkStyled href='/forgot-password'>¿Olvidaste tu contraseña?</LinkStyled>
          </Box>
          {isSubmitting
            ? <Button disabled fullWidth size='large' variant='contained' sx={{ mb: 7 }}>
              <CircularProgress size={25} />
            </Button>
            : <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Iniciar Sesión
            </Button>
          }
        </form>
      </>
    )
  }

  return (
    <>
      <AuthWrapper>
        {userIsLock &&
          <AlertLockUser userEmail={userEmail} />}

        {userMustUpdatePassword &&
          <AlertExpiredUserPassword userName={userNameToUpdatePassword} onClick={handleGoToRecoveryPage} />}

        {!userMustUpdatePassword && !userIsLock &&
          <LoginForm />}
      </AuthWrapper>
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
