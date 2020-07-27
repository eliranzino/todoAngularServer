import {sql} from './sql';
import { User } from './models/user';
import {compare, hash} from 'bcrypt';

export async function checkUserExists(userName: string): Promise<boolean> {
    const [users] = await sql.execute('SELECT ID FROM users WHERE userName = ?', [userName]);
    return users.length > 0;
}


export async function register(username: string, password: string): Promise<number | null> {
    const [users] = await sql.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
        return null;
    }

    const hashedPassword = await hash(password, 10);
    const [{insertId: userId}] = await sql.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return userId;
}


export async function login(username: string, password: string): Promise<number | null> {
    const [users] = await sql.execute('SELECT id, password FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
        return null;
    }
    
    const {id, password: hashedPasswordInDb} = users[0];
    const isPasswordCorrect = await compare(password, hashedPasswordInDb);
    if (!isPasswordCorrect) {
        return null;
    }
    return id;    
}