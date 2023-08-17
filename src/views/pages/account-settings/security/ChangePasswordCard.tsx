// ** React Imports

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// ** Icon Imports

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FormInput } from 'src/components/form/FormInput'
import { updateUserPassword } from 'src/utils/middleware'
import { useAuth } from 'src/hooks/useAuth'
import { Grid, Typography, Box } from '@mui/material'
import { createPasswordRules } from 'src/@core/utils/functions'

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

export const PASSWORD_RULES = [
  { re: /^.{8,16}$/, label: 'Debe ingresar entre 8 y 16 caracteres' },
  { re: /[0-9]/, label: 'Debe incluir un número' },
  { re: /[a-z]/, label: 'Debe incluir letra minúscula' },
  { re: /[A-Z]/, label: 'Debe incluir letra mayúscula' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Debe incluir un caracter especial' },
];

const ChangePasswordCard = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: initState })

  const { user } = useAuth();

  const onSubmit = async (data: State) => {
    const response = await updateUserPassword(user!.username!, data.currentPassword, data.newPassword, data.code);
    if (response.isOk) {
      // reset(initState);
      toast.success("Su contraseña ha sido actualizada con éxito");
    }
    else toast.error(response.errorMessage);
  }

  return (
    <Card>
      <CardHeader title='Actualizar Contraseña' />
      <CardContent>
        <Grid container>
          <Grid container item xs={5} sx={{ border: '0px solid red' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                autoFocus
                name='currentPassword'
                type='password'
                errors={errors}
                control={control}
                placeholder="Actual contraseña"
                label='Actual contraseña'
                rules={{ required: 'Actual contraseña es requerida' }}
              />
              <FormInput
                name='newPassword'
                type='password'
                errors={errors}
                control={control}
                placeholder="Nueva contraseña"
                label='Nueva contraseña'
                rules={{
                  required: 'Nueva contraseña es requerida',
                  validate: {
                    ...createPasswordRules(PASSWORD_RULES),
                  }
                }}
              />

              <FormInput
                name='newPasswordConfirm'
                type='password'
                errors={errors}
                control={control}
                placeholder="Confirmar contraseña"
                label='Confirmar contraseña'
                rules={{
                  required: 'Confirmar contraseña es requerida',
                  validate: {
                    ...createPasswordRules(PASSWORD_RULES),
                    samePass: value => watch('newPassword') === value || "Las contraseñas deben ser iguales"
                  }
                }}
              />

              <FormInput
                errors={errors}
                control={control}
                placeholder="Usuario"
                name='code'
                type='authenticator'

              />
              <Grid item xs={6}>
                <Button fullWidth variant='contained' type='submit' sx={{ mr: 3 }}>
                  Actualizar
                </Button>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>Requirimientos:</Typography>
            <Box
              component='ul'
              sx={{ pl: 4, mb: 0, '& li': { mb: 4, color: 'text.secondary', '&::marker': { fontSize: '1.25rem' } } }}
            >
              <li>Entre 8 y 16 caracteres de longitud.</li>
              <li>Al menos un carácter en minúscula.</li>
              <li>Al menos un carácter en mayúscula.</li>
              <li>Al menos un número.</li>
              <li>Al menos un símbolo.</li>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
