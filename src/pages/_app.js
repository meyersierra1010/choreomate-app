import React, { useEffect } from "react";
import "styles/global.scss";
import "styles/components/index.scss";
import NavbarCustom from "components/NavbarCustom";
import Footer from "components/Footer";
import "util/analytics";
import { AuthProvider } from "util/auth";
import { QueryClientProvider } from "util/db";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import PostHog from "components/PostHog";
import "react-tooltip/dist/react-tooltip.css";
import "@fontsource/roboto";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        // Disable in development
        loaded: (posthog) => {
            if (process.env.NODE_ENV === "development")
                posthog.opt_out_capturing();
        },
    });
}

const skipFooterPaths = ["/projects/[projectId]"];
const skipNavBarPaths = ["/projects/[projectId]"];

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const skipFooter = skipFooterPaths.includes(router.route);
    const skipNavBar = skipNavBarPaths.includes(router.route);

    useEffect(() => {
        // Track page views
        const handleRouteChange = () => {
            posthog?.capture("$pageview");
        };
        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, []);

    return (
        <PostHogProvider client={posthog}>
            <QueryClientProvider>
                <AuthProvider>
                    <>
                        <PostHog />
                        {!skipNavBar && (
                            <NavbarCustom
                                bg="white"
                                variant="light"
                                expand="md"
                                logo="/logo.svg"
                            />
                        )}

                        <Component {...pageProps} />
                        <Analytics />
                        {!skipFooter && (
                            <Footer
                                bg="white"
                                textColor="dark"
                                size="md"
                                bgImage=""
                                bgImageOpacity={1}
                                description="A short description of what you do here"
                                copyright={`© ${new Date().getFullYear()} Company`}
                                logo="/logo.svg"
                            />
                        )}
                    </>
                </AuthProvider>
            </QueryClientProvider>
        </PostHogProvider>
    );
}

export default MyApp;
