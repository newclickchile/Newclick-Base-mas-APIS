import React from 'react'
import AppAlert from './AppAlert'

export const AlertError = () => {
  return (
    <AppAlert
      severity='warning'
      appTitle='Ha ocurrido un error.'
      message='No pudimos validar tu acceso, debes ponerte en contacto con el Administrador.'
    />
  )
}
