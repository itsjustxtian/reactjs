import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EditIcon from '@mui/icons-material/Edit';
import BugReportIcon from '@mui/icons-material/BugReport';
import AppsIcon from '@mui/icons-material/Apps';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        activeIcon: <DashboardIcon sx={{ fontSize: 50 }} />,
        link: "/dashboard",
      },
      {
        title: "User Management",
        icon: <AccountCircleIcon />,
        activeIcon: <AccountCircleIcon sx={{ fontSize: 50 }} />,
        link: "/usermanagement",
      },
      {
        title: "Applications",
        icon: <AppsIcon />,
        activeIcon: <AppsIcon sx={{ fontSize: 50 }} />,
        link: "/view-all-applications",
      },
      /*{
        title: "Inbox",
        icon: <MailIcon />,
        activeIcon: <MailIcon sx={{ fontSize: 50 }} />,
        link: "/inbox",
      },*/
      {
        title: "Suggestions Box",
        icon: <AssistantPhotoIcon />,
        activeIcon: <AssistantPhotoIcon sx={{ fontSize: 50 }} />,
        link: "/suggestions",
      },
]
