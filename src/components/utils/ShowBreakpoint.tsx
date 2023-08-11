import { Grid } from '@mui/material'
import React from 'react'
import useCurrentBreakpoint from 'src/@core/hooks/useCurrentBrakpoint';


const ShowBreakPoint = () => {
  const currentBreakpoint = useCurrentBreakpoint();

  return (
    <Grid container item justifyContent={'center'}
      sx={{
        color: 'red',
        bottom: 0,
        position: 'absolute',
      }}>
      {currentBreakpoint}
    </Grid>
  )
}

export default ShowBreakPoint
