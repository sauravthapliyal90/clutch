import argon2 from "argon2";


export async function hashPassword(plainPassword: string): Promise<string>{
    return argon2.hash(plainPassword, {type: argon2.argon2id});
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>{
    return argon2.verify(hashedPassword, plainPassword);
} 