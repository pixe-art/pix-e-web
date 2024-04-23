'use client'

import { observer } from "mobx-react-lite";

import DashboardView from "./dashboardView.jsx";

export default observer(
    function Dashboard(){
        return <DashboardView/>
    }
);