import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";

import ForgotPassword from "./pages/ForgotPassword";

import Register from "./pages/Register";

import Customer from "./pages/Customer";

import Rider from "./pages/Rider";

import Admin from "./pages/Admin";

// PRIVATE ROUTE

function PrivateRoute({

  children,
  role

}){

  const token =

    localStorage.getItem(
      "token"
    );

  const storedUser =

    localStorage.getItem(
      "user"
    );

  let user = null;

  try{

    user =

      storedUser &&
      storedUser !==
      "undefined"

      ?

      JSON.parse(
        storedUser
      )

      :

      null;

  }catch(error){

    console.log(
      "Invalid user data"
    );

    localStorage.removeItem(
      "user"
    );
  }

  // NOT LOGGED IN

  if(!token){

    return (
      <Navigate to="/login"/>
    );
  }

  // ROLE CHECK

  if(
    role &&
    user?.role !== role
  ){

    return (
      <Navigate to="/login"/>
    );
  }

  return children;
}

// APP

export default function App(){

  return(

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route

          path="/"

          element={
            <Navigate to="/login"/>
          }
        />

        <Route

          path="/login"

          element={
            <Login/>
          }
        />

        {/* FORGOT PASSWORD */}

        <Route

          path="/forgot-password"

          element={
            <ForgotPassword/>
          }
        />

        {/* REGISTER */}

        <Route

          path="/register"

          element={
            <Register/>
          }
        />

        {/* CUSTOMER */}

        <Route

          path="/customer"

          element={

            <PrivateRoute
              role="customer"
            >

              <Customer/>

            </PrivateRoute>
          }
        />

        {/* RIDER */}

        <Route

          path="/rider"

          element={

            <PrivateRoute
              role="rider"
            >

              <Rider/>

            </PrivateRoute>
          }
        />

        {/* ADMIN */}

        <Route

          path="/admin"

          element={

            <PrivateRoute
              role="admin"
            >

              <Admin/>

            </PrivateRoute>
          }
        />

        {/* FALLBACK */}

        <Route

          path="*"

          element={
            <Navigate to="/login"/>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}