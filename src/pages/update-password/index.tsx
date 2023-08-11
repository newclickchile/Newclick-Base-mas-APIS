import { useForm } from 'react-hook-form'

// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import AuthWrapper from 'src/components/auth/AuthWrapper'
import { FormInput } from 'src/components/form/FormInput'
import { AlertError } from 'src/components/notification/AlertError'
import AppAlert from 'src/components/notification/AppAlert'
import { updateUserPasswordExpirated } from 'src/utils/middleware'

interface State {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
  code: string;
}

const initState = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
  code: ''
}

const ForceUpdatePassword = () => {
  const router = useRouter();
  const { username } = router.query;

  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const { handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: initState
  });

  const onSubmit = async (data: State) => {
    const response = await updateUserPasswordExpirated(username!.toString(), data.currentPassword, data.newPassword, data.code);

    if (!response.isOk) {
      if (response.responseStatus === 510) {
        router.replace("/");

        return;
      }
      toast.error(response.errorMessage)
    }
    else setShowSuccess(true);

  }


  useEffect(() => {
    if (!router.isReady) return;

    if (!username) {
      setShowError(true);
    }
  }, [router, username]);

  return (
    <AuthWrapper>
      {showError
        ? <AlertError />
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
                placeholder=""
                name='code'
                type='authenticator'
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
                Continuar
              </Button>
            </form>
          </>
          : <AppAlert
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

ForceUpdatePassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForceUpdatePassword.authGuard = false;

export default ForceUpdatePassword
