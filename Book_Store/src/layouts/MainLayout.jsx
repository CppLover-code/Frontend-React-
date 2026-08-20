import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout()
{
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper text-muted dark:bg-night dark:text-faint">
            <Header />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}

export default MainLayout;
