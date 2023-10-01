import { Router } from 'express';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { encryptText, decryptText } from '../../../utils/encrypt';

const mainRouter: Router = Router();

mainRouter
    .route('/')
    .get(async (req, res) => {
        const text = 'bulbasaur'
        const encryptedText = await encryptText(text);
        const decryptedText = await decryptText(encryptedText);
        res.send({
            encryptedText,
            decryptedText,
        });

    });

export default mainRouter;