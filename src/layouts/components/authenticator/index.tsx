// ** React Imports
import { ChangeEvent, useState } from 'react'

import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import Cleave from 'cleave.js/react'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormHelperText } from '@mui/material'
import { DeepMap, FieldError } from 'react-hook-form'


const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  border: '1px solid red',
  textAlign: 'center',
  height: '50px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}

interface AuthenticatorProps {
  onChangeCode: (code: string) => void;
  errors: DeepMap<Record<string, any>, FieldError>;
}

const Authenticator: React.FC<AuthenticatorProps> = ({ onChangeCode, errors }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));

  // ** Hooks
  const theme = useTheme()

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && value.length < 6) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput instanceof HTMLInputElement) {
        nextInput.focus();
      }
    }

    onChangeCode(newCode.join(''));

  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, target } = event;
    const value = (target as HTMLInputElement).value;
    const prevSibling = (target as HTMLInputElement).previousSibling as HTMLInputElement;

    const regExpIsOk = /^\d$|Backspace|Delete|Tab|ArrowLeft|ArrowRight/g.test(key);

    if (!regExpIsOk) {
      event.preventDefault();
    }

    if (key === 'Backspace' && !value && prevSibling) {
      prevSibling.focus();
    }
  };



  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Box
        key={val}
        name={`key-${index}`}
        type='tel'
        maxLength={1}
        autoFocus={index === 0}
        component={CleaveInput}
        onKeyDown={handleOnKeyDown}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(index, event)}
        options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
        sx={{
          [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` },
          border: errors.code && '#FF4C51 2px solid !important'
        }}
      />
    ))
  }

  return (
    <CleaveWrapper>
      <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Escriba su código de seguridad de 6 dígitos</Typography>
      {renderInputs()}
      {errors.code && (
        <FormHelperText sx={{ color: 'error.main' }}>
          {errors.code.message}
        </FormHelperText>
      )}
    </CleaveWrapper>
  )
}


export default Authenticator
