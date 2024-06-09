import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Assuming white color is primary
import { Link } from "react-router-dom";
import ChartIcon from "@mui/icons-material/ShowChart"; // Assuming white color is primary
import LogoutIcon from "@mui/icons-material/Logout";
import axiosInstance from "../Common/axios";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const nav = useNavigate();

    return (
        <AppBar position="sticky" sx={{ marginBottom: 1.5 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Electricity Connections Management
                </Typography>
                {/* Dashboard Link with Tooltip */}
                <Link to="/">
                    <Tooltip title="Dashboard">
                        <IconButton >
                            <DashboardIcon style={{ color: 'white' }} />
                        </IconButton>
                    </Tooltip>
                </Link>
                {/* Charts Link with Tooltip */}
                <Link to="/graphs-charts">
                    <Tooltip title="Graphs & Charts">
                        <IconButton>
                            <ChartIcon style={{ color: 'white' }} />
                        </IconButton>
                    </Tooltip>
                </Link>
                {/* Logout Button */}
                <Tooltip title="Logout">
                    <IconButton color="inherit" onClick={() => {
                        const refreshToken = localStorage.getItem("refreshtoken");

                        let payload = {
                            refresh_token: refreshToken,
                        };

                        axiosInstance
                            .post('/api/auth/logout/', payload)
                            .then((response) => {
                                nav("/login");
                                window.localStorage.clear();
                            })
                    }}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
