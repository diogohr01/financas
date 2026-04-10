import app from './app';
import { env } from './config/env';

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${env.NODE_ENV}`);
});

export default app;
