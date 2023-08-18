import express from 'express';
import sessionMiddleware from '../middleware/sessionMiddleware';
import userRoutes from '../routes/userRoutes';
import playlistRoutes from '../routes/playlistRoutes';
import callbackRoutes from '../routes/callbackRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware)

app.use('/api/user', userRoutes);

app.use('/api/playlist', playlistRoutes);

app.use('/callback', callbackRoutes);

app.get('/', (req, res) => res.send('Server is ready'));


// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, 'frontend/dist')));

//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
// } else {
//   app.get('/', (req,res) => res.send('Server is ready'));
// }

export default app;