import loadScript from 'load-script';
import React, { useEffect } from 'react';

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

export default function GoogleAPIs() {
  useEffect(() => {
    if (!window.gapi) {
      loadScript(GOOGLE_SDK_URL, () => {
        window.gapi.load('auth');
      });
    }
  }, []);

  return <></>;
}
