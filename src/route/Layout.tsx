import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader";

export default function Layout() {
    return (
        <div>
            <TopHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
}