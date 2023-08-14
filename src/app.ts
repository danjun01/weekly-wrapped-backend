import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from '../routes/userRoutes';
app.use('/api/user', userRoutes);

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, 'frontend/dist')));

//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
// } else {
//   app.get('/', (req,res) => res.send('Server is ready'));
// }

export default app;