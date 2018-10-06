import Whatshot from "@material-ui/icons/Whatshot"
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Crypto from "views/Dashboard/Crypto.jsx";


const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "NASDAQ Stocks",
    navbarName: "",
    icon: Whatshot,
    component: DashboardPage
  },
  {
    path: "/crypto",
    sidebarName: "Crypto Currency",
    navbarName: "",
    icon: Whatshot,
    component: Crypto
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
