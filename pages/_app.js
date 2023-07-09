import '../styles/globals.css';
import {useRouter} from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthContextProvider from '../context/AuthContext';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const noAuthRequired = ['/login', '/signup'];

export default function App({Component, pageProps: {session, ...pageProps}}) {
  const router = useRouter();
  return (
    <AuthContextProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthContextProvider>
  );
}
