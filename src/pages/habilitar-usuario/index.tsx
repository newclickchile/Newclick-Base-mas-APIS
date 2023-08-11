import { useForm } from 'react-hook-form'

// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import AuthWrapper from 'src/components/auth/AuthWrapper'
import { FormInput } from 'src/components/form/FormInput'
import AppAlert from 'src/components/notification/AppAlert'
import { enabledUser, validateTempToken } from 'src/utils/middleware'

interface State {
  currentPassword: string
  showCurrentPassword: boolean
  newPassword: string
  showNewPassword: boolean
  newPasswordConfirm: string
  showNewPasswordConfirm: boolean
  code: string;
}

const initState = {
  currentPassword: "",
  showCurrentPassword: false,
  newPassword: "",
  showNewPassword: false,
  newPasswordConfirm: "",
  showNewPasswordConfirm: false,
  code: ''
}

const EnabledUnlockUser = () => {
  const router = useRouter();
  const { _tkn, _ce } = router.query;
  const userToken = _tkn?.toString() ?? '';
  const userName = _ce?.toString() ?? '';

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const { handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: initState
  });

  const onSubmit = async (data: State) => {
    const response = await enabledUser(userName, userToken, data.currentPassword, data.newPassword, data.code);
    if (response.isOk) {
      setShowSuccess(true);
    }
    else toast.error(response.errorMessage);
  }

  useEffect(() => {
    if (!router.isReady) return;

    if (!userToken || !userName) {
      setShowError(true);
      setLoading(false);
    }
    else {
      validateTempToken(userName, userToken)
        .then(response => {
          setShowError(!response.isOk);
          setLoading(false);
        })
    }
  }, [router, userName, userToken]);

  return (
    <AuthWrapper>
      {loading
        ? <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
        </Box>
        : showError
          ? <AppAlert
            severity='warning'
            appTitle='Ha ocurrido un error.'
            message='No pudimos validar tu acceso, debes ponerte en contacto con el Administrador.'
          />
          : !showSuccess
            ? <>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
                  Habilitar Usuario
                </Typography>
                <Typography variant='body2'>Favor ingresa y confirma tus contraseñas.</Typography>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  autoFocus
                  name='currentPassword'
                  type='password'
                  errors={errors}
                  control={control}
                  placeholder="Contraseña"
                  label='Contraseña'
                  rules={{ required: 'Contraseña es requerida' }}
                />
                <FormInput
                  name='newPassword'
                  type='password'
                  errors={errors}
                  control={control}
                  placeholder="Nueva contraseña"
                  label='Nueva contraseña'
                  rules={{ required: 'Nueva contraseña es requerida' }}
                />

                <FormInput
                  name='newPasswordConfirm'
                  type='password'
                  errors={errors}
                  control={control}
                  placeholder="Confirmar contraseña"
                  label='Confirmar contraseña'
                  rules={{ required: 'Confirmar contraseña es requerida' }}
                />

                <FormInput
                  errors={errors}
                  control={control}
                  placeholder="Usuario"
                  name='code'
                  type='authenticator'
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
                  Continuar
                </Button>
              </form>
            </>
            :
            <AppAlert
              severity='success'
              appTitle='¡Tu contraseña ha sido cambiada con éxito!'
            >
              <Button onClick={() => router.replace("/")} fullWidth size='large' variant='contained' sx={{ my: 5.25 }}>
                Iniciar Sesión
              </Button>
            </AppAlert>
      }
    </AuthWrapper>
  )
}

EnabledUnlockUser.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

EnabledUnlockUser.authGuard = false;

export default EnabledUnlockUser
