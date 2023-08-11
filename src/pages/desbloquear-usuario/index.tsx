
// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useRouter } from 'next/router'
import AuthWrapper from 'src/components/auth/AuthWrapper'
import AppAlert from 'src/components/notification/AppAlert'
import { unlockUser, validateTempToken } from 'src/utils/middleware'

const EnabledUnlockUser = () => {
  const router = useRouter();
  const { _tkn, _ce } = router.query;
  const userToken = _tkn?.toString() ?? '';
  const userName = _ce?.toString() ?? '';

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!router.isReady) return;

      if (!userToken || !userName) {
        setShowError(true);
        setLoading(false);
      }
      else {
        const isValidToken = await validateTempToken(userName, userToken);

        if (!isValidToken.isOk) {
          setShowError(!isValidToken.isOk);
          setLoading(false);
        }
        else {
          const response = await unlockUser(userName!, userToken!);
          setLoading(false);
          if (response.isOk) setShowSuccess(response.isOk);
          else setShowError(true);
        }
      }
    })();
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
            message='No pudimos validar tu acceso, debes ponerte en contacto con el Administrador.'
            appTitle='Ha ocurrido un error.'
          />
          : showSuccess &&
          <AppAlert
            severity='success'
            appTitle='¡Usuario ha sido desbloqueado con éxito!'
          >
            <Button onClick={() => router.replace("/")} fullWidth size='large' type='submit' variant='contained' sx={{ my: 5.25 }}>
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
