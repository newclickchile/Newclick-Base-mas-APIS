import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface FooterIllustrationsProp {
  image1?: string
  image2?: string
}

// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))

const Tree1Img = styled('img')(({ theme }) => ({
  left: 0,
  width: theme.breakpoints.values.sm,
  height: theme.breakpoints.values.sm,
  bottom: 0,
  position: 'absolute'
}))

const Tree2Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: theme.breakpoints.values.sm,
  height: theme.breakpoints.values.sm,
  position: 'absolute'
}))

const FooterIllustrationsV1 = (props: FooterIllustrationsProp) => {
  const { image1, image2 } = props

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <>
        {image1 && <Tree1Img alt='tree' src={image1} />}
        <MaskImg alt='mask' src={`/images/pages/auth-v1-mask-${theme.palette.mode}.png`} />
        {image2 && <Tree2Img alt='tree-2' src={image2} />}
      </>
    )
  } else {
    return null
  }
}

export default FooterIllustrationsV1
