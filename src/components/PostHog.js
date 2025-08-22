import React, {useEffect} from "react";
import { useAuth } from "util/auth";
import { usePostHog } from 'posthog-js/react'

function PostHog(props) {
    const auth = useAuth();
    const posthog = usePostHog();

    //identify  user with posthog
    useEffect(() => {
        if (auth?.user) {
            posthog.identify({
                distinctId: auth.user.uid,
                properties: {
                    email: auth.user.email,
                    name: auth.user.name,
                }
            });
        }
    }, [posthog, auth]);

    return null;
}

export default PostHog;
