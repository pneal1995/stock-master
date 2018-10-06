import Whatshot from "@material-ui/icons/Whatshot"
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Crypto from "views/Dashboard/Crypto.jsx";
import Portfolio from "views/Dashboard/Portfolio.jsx";
import News from "views/Dashboard/News.jsx";


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
  {
    path: "/news",
    sidebarName: "News",
    navbarName: "",
    icon: Whatshot,
    component: News
  },
  {
    path: "/portfolio",
    sidebarName: "Portfolio",
    navbarName: "",
    icon: Whatshot,
    component: Portfolio
  },
  
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
