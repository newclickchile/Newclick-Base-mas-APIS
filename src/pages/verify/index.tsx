// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import router from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { checkGoogleAuthCode, getUserAuthorizedPages } from 'src/utils/middleware'


import Authenticator from 'src/layouts/components/authenticator'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

interface FormValues {
  code: string;
}

const VerifyAuthenticator = () => {
  const auth = useAuth();

  const { handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    const response = await checkGoogleAuthCode(auth.user!.username!, data.code)
    if (response.isOk) {
      const data = JSON.parse(response.responseData);
      const userAuthorizedPages = data[2];
      if (!userAuthorizedPages.length) {
        auth.logout();

        return;
      }

      auth.setVerify(data);
      router.replace(userAuthorizedPages[0].pag);

    }
    else {
      if (response.responseStatus === 510) {
        router.replace("/");

        return;
      }

      toast.error(response.errorMessage);
    }
  }


  useEffect(() => {
    const pages = getUserAuthorizedPages(auth.user);

    // If the pages do not exist, I redirect to index
    if (!pages.length) router.replace("/");
    else if (pages[0].pag !== 'verify') {
      router.replace(pages[0].pag);
    }
  }, [auth.user])

  return (
    <>
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            <Box sx={{ mb: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5' sx={{ mb: 4 }}>
                Verificación de dos pasos 🔐
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>Bienvenido {' '}
                <Typography component={'span'} sx={{ fontWeight: 900, color: 'text.secondary' }}>
                  {auth.user?.username}
                </Typography>
                <Typography component={'span'} sx={{ color: 'text.secondary' }}>
                  , solo falta una comprobación más, ingresa el código que se encuentra dentro de tu aplicación.
                </Typography>
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name='code'
                rules={{
                  required: { value: true, message: 'Código es requerido' },
                  validate: {
                    f1: (value: string) => /^\d{6}$/.test(value) || `Debe ingresar el código correctamente`,
                  }
                }}
                render={({ field: { onChange } }) => <Authenticator errors={errors} onChangeCode={onChange} />}
              />

              <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
                Verificar mi cuenta
              </Button>
            </form>


            <Button onClick={auth.logout} fullWidth sx={{ mt: 2 }}>
              Volver
            </Button>

          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </Box>
    </>
  )
}

VerifyAuthenticator.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

VerifyAuthenticator.authGuard = false;

export default VerifyAuthenticator
