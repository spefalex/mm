import { Drawer, IconButton, List } from "@material-ui/core";
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
  QuestionAnswer as SupportIcon
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
// context
import {
  toggleSidebar,
  useLayoutDispatch,
  useLayoutState
} from "../../context/LayoutContext";
import Dot from "./components/Dot";
// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
// styles
import useStyles from "./styles";

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

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
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

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
