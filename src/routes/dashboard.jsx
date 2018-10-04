import Whatshot from "@material-ui/icons/Whatshot"
import DashboardPage from "views/Dashboard/Dashboard.jsx";


const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "NASDAQ Query",
    navbarName: "",
    icon: Whatshot,
    component: DashboardPage
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
