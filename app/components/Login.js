import React from "react";
import ThemeContext from "../contexts/theme";
import netlify from 'netlify-auth-providers'
import {withRouter} from "react-router-dom";

const REACT_APP_NETLIFY_SITE_ID= 'e2973bc7-f173-487b-b597-241c1def1d18';


function Login({updateToken, history}) {
 const theme = React.useContext(ThemeContext);

 function login() {
    var authenticator = new netlify({site_id: REACT_APP_NETLIFY_SITE_ID});
    authenticator.authenticate({provider:"github", scope: "user"}, function(err, data) {
      if (err) {
        return console.log("Error Authenticating with GitHub: " + err);
      }
      console.log("Authenticated with GitHub. Access Token: " + data.token);
      updateToken(data.token);
      history.push("/");
    });
  }

 return (   
   <div className="instructions-center">
    <label htmlFor='username' className='player-label'>
      Bienvenido anónimo
    </label>
    <div className=''>
     
      <button
        className={`btn ${theme === 'dark' ? 'light-btn' : 'dark-btn'}`}
        onClick={login}
      >
        Log-in with Githug
      </button>
    </div>
  </div>
  );
}

export default withRouter(Login);
