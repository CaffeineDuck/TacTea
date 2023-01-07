import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

import "../../styles/global.css";

require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>TacTea</title>
            </Head>

            <ContextProvider>
                <div className="flex flex-col h-screen">
                    <Notifications />
                    <AppBar />
                    <div className="flex-1">
                        {/* @ts-ignore */}
                        <Component {...pageProps} />
                    </div>
                    <Footer />
                </div>
            </ContextProvider>
        </>
    );
};

export default App;
