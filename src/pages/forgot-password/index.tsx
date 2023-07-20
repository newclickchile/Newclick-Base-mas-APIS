import { Controller, useForm } from 'react-hook-form'

// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { FormControl, FormHelperText } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import Authenticator from 'src/layouts/components/authenticator'

import toast from 'react-hot-toast'
import { forgotPassword } from 'src/utils/middleware'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

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
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          {!successPage
            ? <Box sx={{ mb: 8 }}>
              <Typography variant='h5' sx={{ mb: 2 }}>
                Verify your email ✉️
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
                <Typography variant='body2'>
                  Ingresa tu nombre de usuario y te enviaremos un enlace con las instrucciones para restablecer la contraseña.
                </Typography>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <Controller
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Nombre de usuario'
                        onChange={onChange}
                        error={Boolean(errors.username)}
                        aria-describedby='validation-basic-first-name'
                      />
                    )}
                  />
                  {errors.username && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Nombre de usuario es requerido
                    </FormHelperText>
                  )}


                  <Controller
                    control={control}
                    name='code'
                    rules={{
                      required: { value: true, message: 'Código es requerido' },
                      validate: {
                        f1: (value: string) => /^\d{6}$/.test(value) || `Debe ingresar el código correctamente`,
                      }
                    }}
                    render={({ field: { onChange } }) => <Box mt={3}><Authenticator errors={errors} onChangeCode={onChange} /></Box>}
                  />

                  <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
                    Verificar mi cuenta
                  </Button>
                </FormControl>
              </form>
              <Button onClick={auth.logout} fullWidth sx={{ mt: 2 }}>
                Volver
              </Button>
            </>}
        </CardContent>
      </Card>
    </Box>
  )
}

ForgotPasswordV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPasswordV1.authGuard = false;

export default ForgotPasswordV1
