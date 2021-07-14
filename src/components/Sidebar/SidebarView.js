import { Drawer, IconButton, List, withStyles } from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  AssignmentInd,
  BorderAll as TableIcon,
  FilterNone as UIElementsIcon,
  FormatSize as TypographyIcon,
  HelpOutline as FAQIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryIcon,
  NotificationsNone as NotificationsIcon,
  QuestionAnswer as SupportIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import Dot from "./components/Dot";
import SidebarLink from "./components/SidebarLink/SidebarLinkContainer";

const structure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  {
    id: 1,
    label: "Utilisateurs admin",
    link: "/app/users-admin",
    icon: <AssignmentInd />,
  },
  {
    id: 2,
    label: "Categories",
    link: "/app/categories",
    icon: <AssignmentInd />,
  },
  {
    id: 3,
    label: "Categories Types",
    link: "/app/categories-types",
    icon: <AssignmentInd />,
  },
  {
    id: 4,
    label: "Typography",
    link: "/app/typography",
    icon: <TypographyIcon />,
  },
  { id: 5, label: "Tables", link: "/app/tables", icon: <TableIcon /> },
  {
    id: 6,
    label: "Notifications",
    link: "/app/notifications",
    icon: <NotificationsIcon />,
  },
  {
    id: 7,
    label: "UI Elements",
    link: "/app/ui",
    icon: <UIElementsIcon />,
    children: [
      { label: "Icons", link: "/app/ui/icons" },
      { label: "Charts", link: "/app/ui/charts" },
      { label: "Maps", link: "/app/ui/maps" },
    ],
  },
  { id: 8, type: "divider" },
  { id: 9, type: "title", label: "HELP" },
  {
    id: 10,
    label: "Library",
    link: "https://flatlogic.com/templates",
    icon: <LibraryIcon />,
  },
  {
    id: 11,
    label: "Support",
    link: "https://flatlogic.com/forum/",
    icon: <SupportIcon />,
  },
  {
    id: 12,
    label: "FAQ",
    link: "https://flatlogic.com/forum/",
    icon: <FAQIcon />,
  },
  { id: 13, type: "divider" },
  { id: 14, type: "title", label: "PROJECTS" },
  {
    id: 15,
    label: "My recent",
    link: "",
    icon: <Dot size="small" color="secondary" />,
  },
  {
    id: 16,
    label: "Starred",
    link: "",
    icon: <Dot size="small" color="primary" />,
  },
  {
    id: 17,
    label: "Background",
    link: "",
    icon: <Dot size="small" color="secondary" />,
  },
];

const SidebarView = ({
  classes,
  theme,
  toggleSidebar,
  isSidebarOpened,
  isPermanent,
  location,
}) => {
  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames(classes.drawer, {
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.mobileBackButton}>
        <IconButton onClick={toggleSidebar}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );
};

const drawerWidth = 240;

const styles = (theme) => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    top: theme.spacing.unit * 8,
    [theme.breakpoints.down("sm")]: {
      top: 0,
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 40,
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  mobileBackButton: {
    marginTop: theme.spacing.unit * 0.5,
    marginLeft: theme.spacing.unit * 3,
    [theme.breakpoints.only("sm")]: {
      marginTop: theme.spacing.unit * 0.625,
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});

export default withStyles(styles, { withTheme: true })(SidebarView);
