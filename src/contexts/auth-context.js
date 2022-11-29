import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { auth, ENABLE_AUTH } from '../lib/auth';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  ESTADO_OK:'LOGUEADO',
  ESTADO_ERRO:'LOGUEADO',

};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  estaAutenticado:false
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;
    console.log('user--auto context 20:>> ', user);


    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user,
            estaAutenticado:true
          })
          : ({
            isLoading: false
          })
      )
    };
  },

  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;
    console.log('SIGN_IN--auto context 41:>> ', user.email);
    return {
      ...state,
      isAuthenticated: true,
      user,
      estaAutenticado:true
    };
  },

  [HANDLERS.ESTADO_OK]: (state, action) => {
    const user = action.payload;
    console.log('ESTADO_OK--auto context 51:>> ', user.email);
    return {
      ...state,
      isAuthenticated: true,
      user,
      estaAutenticado:true
    };
  },

  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      estaAutenticado:false
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const[emailx,setEmailx]=useState('ioooos');
  const[nomb,setNomb]=useState('');

  const initialize = async () => {

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    // Check if auth has been skipped
    // From sign-in page we may have set "skip-auth" to "true"
    //const authSkipped = globalThis.sessionStorage.getItem('skip-auth') === 'true';
    const authSkipped = globalThis.sessionStorage.getItem('skip-auth') === 'true';
    console.log('auth-context 106 :>> ', authSkipped);
    if (authSkipped) {
      const user = {};

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
      return;
      console.log('user 94 :>> ', user);
    }

    // Check if authentication with Zalter is enabled
    // If not, then set user as authenticated
    if (!ENABLE_AUTH) {
      const user = {};

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
      return;
    }

    try {
      // Check if user is authenticated
      const isAuthenticated = await auth.isAuthenticated();
        console.log('aut-context :--isAuthenticated> 133> ', isAuthenticated);
      if (isAuthenticated) {
        // Get user from your database
        const user = {};
        console.log('auth--context Get user from your database 134 :>> ', isAuthenticated);
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(() => {
    initialize().catch(console.error);
  }, []);

  const signIn = (user) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const estadoOk = (user) => {
    dispatch({
      type: HANDLERS.ESTADO_OK,
      payload: user
    });
  };
  

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };



  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        estadoOk,
        emailx,
        nomb,
        setNomb

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
