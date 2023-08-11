import React, { ReactNode } from 'react'
import { Alert, AlertProps, AlertTitle, Grid } from '@mui/material'

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

interface AlertCustomProps extends Omit<AlertProps, 'appTitle' | 'message'> {
  message?: ReactNode
  appTitle?: ReactNode
}

const AppAlert = (props: AlertCustomProps) => {
  const { message, appTitle, children, ...alertProps } = props;

  return (
    <>
      <Alert {...alertProps} icon={false}>
        <AlertTitle sx={{ fontWeight: 600, my: '4px !important', textAlign: 'center' }}>
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
