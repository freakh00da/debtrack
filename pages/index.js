import Head from 'next/head';
import {useAuth} from '../context/AuthContext';
import Dashboard from './dashboard';

export default function Home() {
  const {user} = useAuth();

  return (
    <div>
      <Head>
        <title>Welcome {user.email.split('@')[0]}</title>
        <meta name="description" content="created by @realtouseef on GitHub" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </div>
  );
}
