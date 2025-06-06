import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
    const [status, setStatus] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('Registrando...');

        const formData = {
            nombre_empresa: event.target.nombre_empresa.value,
            email: event.target.email.value,
            contrasena: event.target.contrasena.value,
        };

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            setStatus('¡Registro exitoso! Redirigiendo...');
            setTimeout(() => router.push('/login'), 2000);
        } else {
            setStatus(`Error: ${result.message}`);
        }
    };

    return (
        <>
            <Head>
                <title>Registro - CritoBots</title>
            </Head>
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">Crear Cuenta de Empresa</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="nombre_empresa">Nombre de la Empresa</label>
                            <input className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" name="nombre_empresa" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                            <input className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="email" name="email" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2" htmlFor="contrasena">Contraseña</label>
                            <input className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="password" name="contrasena" minLength="6" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Crear Cuenta y Iniciar Prueba Gratuita
                        </button>
                        {status && <p className="text-center text-gray-300 mt-4">{status}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}
