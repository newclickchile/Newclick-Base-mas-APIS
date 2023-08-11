import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

const AdminBoxs = () => {
  return <>
    <Card>
      <CardHeader title='Administrador de Casillas' />
      <CardContent>
        <Typography variant='body2' sx={{ mb: 3.25 }}>
          Lista de Casillas
        </Typography>
      </CardContent>

    </Card>
  </>
}


export default AdminBoxs
