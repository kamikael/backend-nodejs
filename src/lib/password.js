import argon2 from 'argon2';

export const hash = async (password) => {
    try {
        return await argon2.hash(password);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

export const verify = async (hash, password) => {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        return false;
    }
};
