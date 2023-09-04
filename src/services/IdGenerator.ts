import { v4 } from 'uuid';

// export class IdGenerator {
//     generate = () => v4();
// }

export const IdGenerator = () => {
    return v4();
}