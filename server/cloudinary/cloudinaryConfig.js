import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: "dsupdus2u",
  api_key: "272854694195438",
  api_secret: "gHXTcQnlSrAwTNUbX58LyFOhjZA",
});

export default cloudinary;

