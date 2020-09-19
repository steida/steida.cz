import { useEffect, useRef, useState } from 'react';
import { FacebookStatus } from '../types';

interface Response {
  data: FacebookStatus[];
  paging: {
    next: string;
  };
  error: unknown;
}

const FetchFromFacebook = () => {
  useEffect(() => {
    // @ts-ignore
    window.fbAsyncInit = () => {
      FB.init({
        appId: '1216163152087609',
        cookie: true,
        xfbml: true,
        version: 'v8.0',
      });

      FB.AppEvents.logPageView();

      FB.Event.subscribe('auth.statusChange', response => {
        console.log(response.authResponse);

        // if (response.authResponse) {
        //   // this.checkLoginState();
        // } else {
        //   console.log(
        //     '[FacebookLoginButton] User cancelled login or did not fully authorize.',
        //   );
        // }
      });
    };

    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      // @ts-expect-error
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      // @ts-expect-error
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const [data, setData] = useState<FacebookStatus[]>([]);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });

  const handleResponse = (response: Response) => {
    if (response && !response.error) {
      setData(data => data.concat(response.data));
      callApi(response.paging.next);
    } else {
      console.log(response.error);
    }
  };

  const [curUrl, setCurUrl] = useState('');

  const callApi = (url: string) => {
    setCurUrl(url);
    FB.api(url, handleResponse);
  };

  const login = () => {
    FB.login(
      function(response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
            // @ts-expect-error
            const id = response.id as string;
            // Broken FB API returns only 2398 posts. Then it fails with unknown error.
            // I have tried offset, timeout, etc., nothing helps.
            // {message: "An unknown error has occurred.", type: "OAuthException", code: 1, fbtrace_id: "AiWhK7QtphcEvidDEoDQ7Ot"}
            callApi(
              `/${id}/posts?fields=id,type,link,created_time,message,reactions.summary(total_count)&limit=200`,
            );
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      { scope: 'user_posts' },
    );
  };

  const [shown, setShown] = useState(false);

  const show = () => {
    setShown(true);
  };

  return (
    <div>
      Welcome to Next.js!
      <button onClick={login}>login</button>
      <br />
      {data.length}
      <br />
      {curUrl}
      {shown && (
        <textarea
          value={JSON.stringify(data)}
          readOnly
          style={{ width: 500, height: 300 }}
        />
      )}
      <button onClick={show}>show</button>
    </div>
  );
};

export default FetchFromFacebook;
