// ** MUI Imports
import Box from '@mui/material/Box'

// ** Icon Imports

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown, {
  NotificationsType
} from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const notifications: NotificationsType[] = [
  {
    meta: 'Today',

    // avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',

    // avatarImg: '/images/avatars/4.png',
    avatarText: 'Flora Monhd',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',

    // avatarAlt: 'message',
    title: 'New message received 👋🏻',

    // avatarImg: '/images/avatars/5.png',
    avatarText: 'M',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',

    // avatarAlt: 'paypal',
    subtitle: 'Received Payment',

    // avatarImg: '/images/misc/paypal.png'
    avatarText: 'P',
  },
  {
    meta: '19 Mar',

    // avatarAlt: 'order',
    title: 'Received Order 📦',

    // avatarImg: '/images/avatars/3.png',
    avatarText: 'M',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',

    // avatarAlt: 'chart',
    subtitle: '25 hrs ago',

    // avatarImg: '/images/misc/chart.png',
    avatarText: 'PU',
    title: 'Finance report has been generated'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box className='actions-left' sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            <NotificationDropdown settings={settings} notifications={notifications} />
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
