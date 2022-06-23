
//import { jwt } from 'jsonwebtoken';

import { sign, SignOptions, verify, TokenPayload} from 'jsonwebtoken';

export const crearToken = (id, clave, tiempo='8h') => {

    const payload = {
        id
    }
    const token = sign(
        payload,
        clave,
        {
            expiresIn: tiempo
        }
    )
    return token;                     
}

export const verificarToken = async(token,clave) =>{
    //await verify(token, clave)

    return new Promise((resolve, reject) => {
        verify(token, clave, (error, decoded: TokenPayload) => {
          if (error) return reject(error);
    
          resolve(decoded);
        })
      });
}
