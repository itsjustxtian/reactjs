import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Inbox",
        icon: <MailIcon />,
        link: "/inbox"
    },
    {
        title: "User Management",
        icon: <AccountCircleIcon />,
        link: "/usermanagement"
    },
]
