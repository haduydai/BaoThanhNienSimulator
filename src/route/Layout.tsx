    import { Outlet } from "react-router-dom";
    import TopHeader from "../components/TopHeader";
    import MainHeader from "../components/MainHeader.tsx";
    import MainHeaderMenu from "../components/MainHeaderMenu.tsx";
    import {useState} from "react";
    import NavBar from "../components/NavBar.tsx";

    export default function Layout() {
        const [isOpenMenu, setIsOpenMenu] = useState(false);
        return (
            <div className="bg-light min-vh-100">
                <header className="sticky-top ">
                    {isOpenMenu ? (
                        <MainHeaderMenu isOpen={isOpenMenu} onClose={() => setIsOpenMenu(false)} />
                    ) : (
                        <>
                            <TopHeader />
                            <MainHeader onToggleMenu={() => setIsOpenMenu(!isOpenMenu)} />
                            <NavBar/>
                            <main>
                                <Outlet />
                            </main>
                        </>
                    )}
                </header>
            </div>
        );
    }