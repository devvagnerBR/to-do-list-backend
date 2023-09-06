import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export class HashManager {


    createHash = async ( password: string ): Promise<string> => {

        const cost = Number( process.env.BCRYPT_COST );
        const salt = await bcrypt.genSalt( cost );

        return bcrypt.hash( password, salt );

    };

    compareHash = ( password: string, hashedPassword: string ): Promise<boolean> => {

        return bcrypt.compare( password, hashedPassword );
    };
}