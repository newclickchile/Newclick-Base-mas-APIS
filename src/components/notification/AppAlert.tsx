import React, { ReactNode } from 'react'
import { Alert, AlertProps, AlertTitle, Grid } from '@mui/material'

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

interface AlertCustomProps extends AlertProps {
  message: ReactNode
  appTitle: ReactNode
}

const AppAlert = (props: AlertCustomProps) => {
  const { message, appTitle, icon, children } = props;

  return (
    <>
      <Alert {...props} icon={false}>
        <AlertTitle sx={{ fontWeight: 600, my: '4px !important', textAlign: 'center' }}>
          {icon}
          {appTitle}
        </AlertTitle>
        <Grid mt={4} justifyContent={'center'}>
          {message}
        </Grid>
      </Alert>
      {children}
    </>
  )
}

export default AppAlert
