import React, { useEffect } from "react";

interface AdBannerProps {
    adSlot: string;
}

const AdBanner = ({ adSlot }: AdBannerProps) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("Adsbygoogle error", e);
        }
    }, [adSlot]);

    return (
        <div className="w-full flex justify-center py-2 bg-background overflow-hidden min-h-[60px]">
            {/* AdMob/AdSense Banner */}
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-client="ca-pub-7906696637723167"
                data-ad-slot={adSlot}
                data-ad-format="horizontal"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdBanner;
