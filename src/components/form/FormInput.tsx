import { ErrorMessage } from '@hookform/error-message';
import { Box, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import { Control, Controller, DeepMap, FieldError, RegisterOptions } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { IKeyValueData } from 'src/interfaces';
import Authenticator from 'src/layouts/components/authenticator';

// function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
//   return (
//     <Text
//       color={meets ? '#18BA95' : '#C33149'}
//       sx={{ display: 'flex', alignItems: 'center' }}
//       mt={7}
//       size="sm"
//     >
//       {meets ? <MDBIcon fas icon="check" /> : <MDBIcon fas icon="times" />}
//       <div className='px-2'>{label}</div>
//     </Text>
//   );
// }


export const PASSWORD_RULES = [
  { re: /^.{8,16}$/, label: 'Debe ingresar entre 8 y 16 caracteres' },
  { re: /[0-9]/, label: 'Debe incluir un número' },
  { re: /[a-z]/, label: 'Debe incluir letra minúscula' },
  { re: /[A-Z]/, label: 'Debe incluir letra mayúscula' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Debe incluir un caracter especial' },
];

export const FormInput: React.FC<{
  control?: Control<any>;
  listValues?: IKeyValueData[],
  label?: string,
  placeholder?: string,
  searchable?: boolean,
  required?: boolean,
  autoFocus?: boolean;
  message?: string,
  maxLength?: number,
  size?: number,
  name: string,
  errors: DeepMap<Record<string, any>, FieldError>;
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  extraPasswordRules?: { re: RegExp; label: string; }[],
  usePasswordPopover?: boolean,
  type?:
  | 'multiple'
  | 'authenticator'
  | 'select'
  | 'radio'
  | 'number'
  | 'time'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'search'
  | 'date'
  | 'password'
  | 'week'
  | 'month'
  | 'hidden'
  | 'datetime-local'
  | 'textarea';
}> = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const [popoverOpened, setPopoverOpened] = useState(false);
  // const { useWrapper = true, usePasswordPopover = true } = props;

  const authenticatorRules = {
    required: 'Código es requerido',
    validate: {
      f1: (value: string) => /^\d{6}$/.test(value) || `Debe ingresar el código correctamente`,
    }
  }

  return (
    <Box my={5} maxWidth={400} minWidth={400}>
      <Controller
        render={({ field: { value, onChange } }) => {
          switch (props.type) {
            // case "select":
            //     return <Select
            //         radius={8}
            //         onChange={onChange}
            //         data={props.listValues!.length ? props.listValues!.map((data: IKeyValueData) => ({ value: data.id.toString(), label: data.nombre })) : []}
            //         nothingFound="Sin información"
            //         value={value && value.toString()} />;
            // case "multiple":
            //     const data = props.listValues!.length ? props.listValues!.map((data: IKeyValueData) => ({ value: data.id.toString(), label: data.nombre })) : [];
            //     const haveErrors = props.errors[props.name];

            //     return <MultiSelect
            //         onChange={onChange}
            //         data={data}
            //         styles={{ input: { borderColor: haveErrors && '#C33149' } }}
            //         className={"mantine-select"}
            //         radius={8}
            //         value={value}
            //         placeholder={props.placeholder}
            //         searchable={props.searchable} />;
            // case "radio":
            //     return <>
            //         {props.listValues!.map((radio: IKeyValueData, key) => {
            //             return <MDBRadio
            //                 onChange={onChange}
            //                 checked={radio.id === value}
            //                 key={key}
            //                 name={name}
            //                 value={radio.id}
            //                 label={radio.nombre}
            //                 inline />;
            //         })}
            //     </>;
            case "authenticator":
              // const rules = [];

              return <Box mt={3}>
                <Authenticator errors={props.errors} onChangeCode={onChange} />
              </Box>
            case "password":
              return <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                autoFocus={props.autoFocus}
                value={value}
                onChange={onChange}
                error={Boolean(props.errors[props.name])}
                label={props.label}
                placeholder={props.placeholder}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            //     const requirements: { re: RegExp; label: string; }[] = [
            //         // { re: /^.{8,16}$/, label: 'Debe ingresar entre 8 y 16 caracteres' },
            //         // { re: /^.{12,}$/, label: 'Deben ser mínimo 12 caracteres' },
            //         // { re: /[0-9]/, label: 'Debe incluir un número' },
            //         // { re: /[a-z]/, label: 'Debe incluir letra minúscula' },
            //         // { re: /[A-Z]/, label: 'Debe incluir letra mayúscula' },
            //         // { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Debe incluir un caracter especial' },
            //     ];

            //     if (props.extraPasswordRules)
            //         requirements.push(...props.extraPasswordRules);


            //     const getStrength = (password: string) => {
            //         if (!password) return 0;
            //         let multiplier = password.length > 5 ? 0 : 1;

            //         requirements.forEach((requirement) => {
            //             if (requirement?.re && !requirement.re.test(password)) {
            //                 multiplier += 1;
            //             }
            //         });

            //         return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
            //     };

            //     const checks = requirements.map((requirement, index) => (
            //         requirement.re && <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
            //     ));

            //     const strength = getStrength(value);
            //     const color = strength === 100 ? '#18BA95' : strength > 50 ? 'yellow' : '#C33149';

            //     return <>
            //         <div className='row d-flex align-items mb-0'>
            //             <MDBCol size='10'>
            //                 {usePasswordPopover
            //                     ? <Popover opened={popoverOpened} position="bottom" width="target" transition="pop">
            //                         <Popover.Target>
            //                             <div
            //                                 onFocusCapture={() => setPopoverOpened(true)}
            //                                 onBlurCapture={() => setPopoverOpened(false)}
            //                             >
            //                                 <input
            //                                     id={props.name}
            //                                     type={showPassword ? 'password' : 'text'}
            //                                     placeholder={props.placeholder}
            //                                     value={value}
            //                                     onChange={onChange}
            //                                     maxLength={props.maxLength} />
            //                             </div>
            //                         </Popover.Target>
            //                         <Popover.Dropdown>
            //                             <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
            //                             {checks}
            //                         </Popover.Dropdown>
            //                     </Popover>
            //                     : <input
            //                         id={props.name}
            //                         type={showPassword ? 'password' : 'text'}
            //                         placeholder={props.placeholder}
            //                         value={value}
            //                         onChange={onChange}
            //                         maxLength={props.maxLength} />
            //                 }
            //             </MDBCol>
            //             <MDBCol size='2' style={{ textAlign: 'center' }}>
            //                 <MDBIcon
            //                     color="dark"
            //                     onClick={() => setShowPassword(!showPassword)}
            //                     icon={showPassword ? "eye" : "eye-slash"} />
            //             </MDBCol>
            //         </div>
            //     </>;
            // case "textarea":
            //     return <textarea
            //         id={props.name}
            //         placeholder={props.placeholder}
            //         value={value}
            //         onChange={onChange}
            //         maxLength={props.maxLength} />;
            case "hidden":
              return <input
                type={'hidden'}
                id={props.name}
                value={value}
                onChange={onChange}
              />;
            default:
              // const allowOnlyNumber = (value: string) => value.replace(/[^0-9]/g, '');
              return <TextField
                fullWidth
                type={!props.type || props.type === 'number'
                  ? 'text'
                  : props.type}
                autoFocus={props.autoFocus}
                value={value}
                onChange={onChange}
                error={Boolean(props.errors[props.name])}
                label={props.label}
                placeholder={props.placeholder}
              />

            // return <input
            //     id={props.name}
            //     type={!props.type || props.type === 'number'
            //         ? 'text'
            //         : props.type}
            //     placeholder={props.placeholder}
            //     value={value}
            //     onChange={(e) => onChange(props.type === 'number' ? allowOnlyNumber(e.target.value) : e)}
            //     maxLength={props.maxLength} />;
          }


        }}
        control={props.control}
        name={props.name}
        rules={{
          ...props.rules,
          ...(props.type === 'authenticator' && authenticatorRules),
        }}
      />

      <ErrorMessage
        errors={props.errors}
        name={props.name}
        render={({ message }) =>
          <Typography
            sx={{
              maxWidth: '80%',
              fontSize: '12px !important',
              color: 'red'
            }}
          >
            {message}
          </Typography>
        }
      />

    </Box>
  );
};
