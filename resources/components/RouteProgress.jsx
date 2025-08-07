"use client";

import { useEffect } from "react";
import { router } from "@inertiajs/react";
import NProgress from "nprogress";

export default function RouteProgress() {
  NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    easing: 'ease',
    speed: 800,
  });

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleFinish = () => {
      NProgress.done();
    };

    const handleError = () => {
      NProgress.done();
    };

    router.on('start', handleStart);
    router.on('finish', handleFinish);
    router.on('error', handleError);

    return () => {
      router.off('start', handleStart);
      router.off('finish', handleFinish);
      router.off('error', handleError);
      NProgress.done();
    };
  }, []);

  return null;
}
