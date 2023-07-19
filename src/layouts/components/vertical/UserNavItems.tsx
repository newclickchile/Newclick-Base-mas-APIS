// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth';

const UserNavItems = () => {
  const auth = useAuth()
  const pages = auth.user?.userAuthorizedPages;

  const menuItems: VerticalNavItemsType = pages!.map(page => {
    return {
      path: `/${page.pag}`,
      title: page.titulo!
    }
  })

  menuItems.push({ path: `/lalal`, title: "No existe" })

  return menuItems;
}

export default UserNavItems
