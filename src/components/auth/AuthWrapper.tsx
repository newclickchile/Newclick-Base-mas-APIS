import { Box, Card, CardContent } from '@mui/material'
import { ReactNode } from 'react'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import AppCardHeader from './AppCardHeader'

const AuthWrapper = (props: { children: ReactNode, image1?: string, image2?: string }) => {
  const { children, image1, image2 } = props;

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppCardHeader />
          </Box>
          {children}
        </CardContent>

      </Card>
      <FooterIllustrationsV1 image1={image1} image2={image2} />
    </Box>
  )
}

export default AuthWrapper
