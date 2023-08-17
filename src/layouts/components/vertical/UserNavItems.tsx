// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types';
import { useAuth } from 'src/hooks/useAuth';

const fakeNavigation: VerticalNavItemsType = [
  {
    title: 'Home',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/dashboards/crm'
  },
  {
    sectionTitle: 'Custom Levels'
  },
  {
    title: 'Others',
    icon: 'mdi:dots-horizontal',
    children: [
      {
        title: 'Menu Levels',
        children: [
          {
            title: 'Menu Level 2.1'
          },
          {
            title: 'Menu Level 2.2',
            children: [
              {
                title: 'Menu Level 3.1'
              },
              {
                title: 'Menu Level 3.2'
              }
            ]
          }
        ]
      },
      {
        title: 'Disabled Menu',
        disabled: true
      }
    ]
  },
  {
    sectionTitle: 'Admin Levels'
  },
];

const UserNavItems = () => {
  const auth = useAuth()
  const pages = auth.user?.userAuthorizedPages;

  const menuItems: VerticalNavItemsType = pages!.map(page => {
    return {
      path: `/${page.pag}`,
      title: page.titulo!
    }
  })

  return fakeNavigation.concat(menuItems);

  // return menuItems;

}

export default UserNavItems
