// Este archivo es exactamente el que te pasé antes para la API.
// Lo incluyo de nuevo para que lo tengas todo junto.

import { promises as fs } from 'fs';
import path from 'path';

// Simulación de una base de datos con archivos JSON
const dbDirectory = path.join(process.cwd(), 'db');

async function readDbFile(filename) {
    const filePath = path.join(dbDirectory, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Si el archivo no existe, creamos la carpeta db y el archivo
            await fs.mkdir(dbDirectory, { recursive: true });
            await fs.writeFile(filePath, '[]', 'utf8');
            return [];
        }
        throw error;
    }
}

async function writeDbFile(filename, data) {
    const filePath = path.join(dbDirectory, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { nombre_empresa, email, contrasena } = req.body;
        if (!nombre_empresa || !email || !contrasena || contrasena.length < 6) {
            return res.status(400).json({ message: 'Datos inválidos. Asegúrate de que todos los campos estén completos y la contraseña tenga al menos 6 caracteres.' });
        }

        const empresas = await readDbFile('empresas.json');
        if (empresas.some(e => e.email === email)) {
            return res.status(409).json({ message: 'El email ya está en uso.' });
        }
        
        // En una app real, aquí se usaría bcrypt para hashear la contraseña
        // const hash_contrasena = await bcrypt.hash(contrasena, 10);

        const fecha_actual = new Date();
        const fecha_fin_prueba = new Date(fecha_actual.setDate(fecha_actual.getDate() + 5));

        const newEmpresa = {
            id: `empresa-${Date.now()}`,
            nombre_empresa,
            email,
            contrasena, // Guardamos en texto plano por simplicidad, NO HACER EN PRODUCCIÓN REAL
            rol: 'cliente',
            plan_activo: true,
            fecha_fin_plan: fecha_fin_prueba.toISOString(),
            limite_dispositivos: 1,
            fecha_registro: new Date().toISOString(),
        };

        empresas.push(newEmpresa);
        await writeDbFile('empresas.json', empresas);

        res.status(201).json({ message: 'Empresa registrada con éxito. ¡Disfruta de tu prueba de 5 días!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}
