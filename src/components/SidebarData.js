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

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Suggestions",
        icon: <MailIcon />,
        link: "/suggestions"
    },
    {
        title: "User Management",
        icon: <AccountCircleIcon />,
        link: "/usermanagement"
    },
    {
        title: "Application Screen",
        icon: <AppsIcon />,
        link: "/applications"
    },
    {
        title: "Edit Profile Screen",
        icon: <AssignmentIndIcon />,
        link: "/edit-profile"
    },
    {
        title: "View all applications/projects screen ",
        icon: <AppsIcon />,
        link: "/view-all-applications"
    },
    {
        title: "Settings screen ",
        icon: <SettingsIcon />,
        link: "/settings"
    },
    {
        title: "Add Applications screen ",
        icon: <AddBoxIcon />,
        link: "/add-applications"
    },
]
