import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'
import { getUserAuthorizedPages } from 'src/utils/middleware'

const Home = () => {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user) {
      const pages = getUserAuthorizedPages(auth.user);
      if (pages?.length) {
        router.replace(pages[0].pag as string);
      }
    }
  }, [auth.user, router])

  return <Spinner sx={{ height: '100%' }} />
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
