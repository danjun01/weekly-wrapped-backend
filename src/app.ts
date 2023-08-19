import express from 'express';
import sessionMiddleware from '../middleware/sessionMiddleware';
import userRoutes from '../routes/userRoutes';
import playlistRoutes from '../routes/playlistRoutes';
import spotifyRoutes from '../routes/spotifyRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session storage middleware
app.use(sessionMiddleware)

// user routes
app.use('/api/user', userRoutes);

// playlist routes
app.use('/api/playlist', playlistRoutes);

// spotify callback route
app.use('/spotify', spotifyRoutes);

// homepage
app.get('/', (req, res) => res.send('Server is ready'));


// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, 'frontend/dist')));

//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
// } else {
//   app.get('/', (req,res) => res.send('Server is ready'));
// }

export default app;