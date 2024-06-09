import * as React from 'react';
import Box from "@mui/material/Box";
import { BarChart } from '@mui/x-charts/BarChart';
import Navbar from '../Dashboard/Navbar';
import axiosInstance from '../Common/axios';

const chartSetting = {
    yAxis: [
        {
            label: 'number of connection',
        },
    ],
    width: window.innerWidth - 200,
    height: window.innerHeight - 180,
};
// Mock dataset for better view
// const dataset = [
//   {
//     approved: 59,
//     pending: 57,
//     rejected: 86,
//     connection_released: 21,
//     month: 'Jan',
//   },
//   {
//     approved: 50,
//     pending: 52,
//     rejected: 78,
//     connection_released: 28,
//     month: 'Feb',
//   },
//   {
//     approved: 47,
//     pending: 53,
//     rejected: 106,
//     connection_released: 41,
//     month: 'Mar',
//   },
//   {
//     approved: 54,
//     pending: 56,
//     rejected: 92,
//     connection_released: 73,
//     month: 'Apr',
//   },
//   {
//     approved: 57,
//     pending: 69,
//     rejected: 92,
//     connection_released: 99,
//     month: 'May',
//   },
//   {
//     approved: 60,
//     pending: 63,
//     rejected: 103,
//     connection_released: 144,
//     month: 'June',
//   },
//   {
//     approved: 59,
//     pending: 60,
//     rejected: 105,
//     connection_released: 319,
//     month: 'July',
//   },
//   {
//     approved: 65,
//     pending: 60,
//     rejected: 106,
//     connection_released: 249,
//     month: 'Aug',
//   },
//   {
//     approved: 51,
//     pending: 51,
//     rejected: 95,
//     connection_released: 131,
//     month: 'Sept',
//   },
//   {
//     approved: 60,
//     pending: 65,
//     rejected: 97,
//     connection_released: 55,
//     month: 'Oct',
//   },
//   {
//     approved: 67,
//     pending: 64,
//     rejected: 76,
//     connection_released: 48,
//     month: 'Nov',
//   },
//   {
//     approved: 61,
//     pending: 70,
//     rejected: 103,
//     connection_released: 25,
//     month: 'Dec',
//   },
// ];

const valueFormatter = (value: number | null) => `${value} connections`;

export default function BarsDataset() {
    const [dataSet, setDataSet] = React.useState([]);
    React.useEffect(() => {
        axiosInstance.get('/api/monthly_stats/').then((res) => {
            setDataSet(res.data)
        })
    }, [])
    return (
        <>

            <Navbar></Navbar>
            <Box
                sx={{
                    paddingTop: 5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <BarChart
                    dataset={dataSet}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[
                        { dataKey: 'approved', label: 'Approved', valueFormatter },
                        { dataKey: 'pending', label: 'Pending', valueFormatter },
                        { dataKey: 'rejected', label: 'Rejected', valueFormatter },
                        { dataKey: 'connection_released', label: 'Connection Released', valueFormatter },
                    ]}
                    {...chartSetting}
                />
            </Box>
        </>
    );
}
