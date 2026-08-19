import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout()
{
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <Header />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}

export default MainLayout;
