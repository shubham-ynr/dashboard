import Echo from "laravel-echo";
import React from "react";
export default function Reverb() {
    const echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
    });

    echo.channel('reverb')
        .listen('.reverb-event', (e) => {
            console.log('Reverb event received:', e);
        });

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            echo.disconnect();
        };
    }, [echo]);
    return (
        <div>
            <h1>Reverb</h1>
        </div>
    );
}