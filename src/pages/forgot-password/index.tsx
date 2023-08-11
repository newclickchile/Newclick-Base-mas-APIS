import { useForm } from 'react-hook-form'

// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'
import AuthWrapper from 'src/components/auth/AuthWrapper'
import { FormInput } from 'src/components/form/FormInput'
import { forgotPassword } from 'src/utils/middleware'

const defaultValues = {
  username: '',
  code: ''
}

interface FormValues {
  username: string;
  code: string;
}


const ForgotPasswordV1 = () => {
  // ** Hook
  const auth = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ defaultValues })

  const [successPage, setSuccessPage] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const onSubmit = async (data: FormValues) => {
    const response = await forgotPassword(data.username, data.code);

    if (response.isOk) {
      const userEmail = response.responseData;
      setUserEmail(userEmail);
      setSuccessPage(true);
    }
    else {
      toast.error(response.errorMessage);
    }

  }

  return (
    <AuthWrapper>

      {successPage
        ? <Box sx={{ mb: 8 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Comprueba tu email
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Hemos enviado un mensaje de correo electrónico a: <strong>{userEmail}</strong>
          </Typography>
          <Typography mt={2} sx={{ color: 'text.secondary' }}>
            Comprueba tu bandeja de entrada y sigue las instrucciones para continuar.
          </Typography>
        </Box>
        :
        <>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
              ¿Olvidaste tu contraseña? 🔒
            </Typography>
            <Typography variant='body2' sx={{ maxWidth: 400 }}>
              Ingresa tu nombre de usuario y te enviaremos un enlace con las instrucciones para restablecer la contraseña.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              autoFocus
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
              placeholder="Usuario"
              name='code'
              type='authenticator'
            />

            <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
              Verificar mi cuenta
            </Button>
          </form>
          <Button onClick={auth.logout} fullWidth sx={{ mt: 2 }}>
            Volver
          </Button>
        </>
      }
    </AuthWrapper>
  )
}

ForgotPasswordV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPasswordV1.authGuard = false;

export default ForgotPasswordV1
