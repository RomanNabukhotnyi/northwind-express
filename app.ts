import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './src/routes';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
