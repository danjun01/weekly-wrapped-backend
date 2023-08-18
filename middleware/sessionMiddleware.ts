import session from 'express-session'

const session_secret = process.env.SESSION_SECRET?.toString();

if (session_secret === undefined) {
  throw new Error("Session secret undefined")
}

const sessionMiddleware = session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
});

export default sessionMiddleware;