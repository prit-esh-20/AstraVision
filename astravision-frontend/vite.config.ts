import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Simple mock backend plugin to simulate /api/auth/verify for dev
const mockBackend = () => ({
  name: 'mock-backend',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/auth/verify' && req.method === 'GET') {
        const auth = req.headers.authorization;
        if (auth && auth.includes('mock_')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ valid: true, message: 'Token verified successfully' }));
          return;
        }
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ valid: false, message: 'Invalid or expired token' }));
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mockBackend()],
})
