import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Bienvenido a CritoBots</title>
        <meta name="description" content="Plataforma de rastreo y monitoreo." />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold text-center">Plataforma de Rastreo CritoBots</h1>
        <p className="mt-4 text-lg text-center text-gray-300">Tu proyecto está desplegado y funcionando correctamente.</p>
        <div className="mt-8 space-x-4">
          <Link href="/login" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 font-semibold">
            Registrarse
          </Link>
        </div>
      </div>
    </>
  );
}
