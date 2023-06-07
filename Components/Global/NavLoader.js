import React from 'react';
import { useRouter } from 'next/router';

const LOADER_THRESHOLD = 250;

export default function NavigationLoader(props) {

  const {text = "Loading..."} = props;
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();
  
  React.useEffect(() => {

    let timer;
  
    const start = () => timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD);
  
    const end = () => {
      if (timer) {
        clearTimeout(timer);
      }
      
      if(document.getElementById("navLoader")) {
        document.getElementById("navLoader").style.opacity = "0";
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
  
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
  
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);

      if(timer) {
        clearTimeout(timer.current);
      }
    };
  
  }, [router.events]);

  return isLoading ? <div id="navLoader" className="navigation-loader">{text}</div> : null;

}