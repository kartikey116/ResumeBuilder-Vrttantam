import cluster from 'cluster';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`[Master] Primary process ${process.pid} is running`);
    console.log(`[Master] Forking ${numCPUs} workers...`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[Worker] worker ${worker.process.pid} died. Respawning...`);
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection.
    // In this case, it is an HTTP server.
    import('./server.js').catch(err => {
        console.error(`[Worker ${process.pid}] Failed to start server:`, err);
    });
    
    // Auto-start the background worker if you want it bound per-process
    // Alternatively, you can start ONE global worker outside the cluster, 
    // but BullMQ handles concurrent locking automatically so running it in the worker isn't fatal.
    // For now, we initialize our BullMQ worker.
    import('./workers/aiWorker.js').catch(err => {
        console.error(`[Worker ${process.pid}] Failed to start BullMQ worker:`, err);
    });

    console.log(`[Worker] Started process ${process.pid}`);
}
