import React from "react";
import {Route, Redirect} from "react-router-dom";
import AuthContext from "../contexts/auth";

export default function ProtectedRoute({component: Component, ...restProps}) {
   const token = React.useContext(AuthContext);

   return <Route {...restProps} render={
       () => {
           if (token) {
            return <Component />;
           }
           console.log("redirecting");
           return <Redirect to="/login" />
       }
   }></Route>

}