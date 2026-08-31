import bc from "bcrypt"

class PasswordManager {
    /**
     * 
     * @param {string} password -This is the plain text 
     * @returns 
     */
    async passwordHasher(password: string): Promise<string> {
        const hasher = bc.hash(password, 10);
        return hasher
    }

    async passwordVerfier(password: string, passwordHashed: string): Promise<boolean> {
        return bc.compare(password, passwordHashed);
    }
};

export const passwordManager = new PasswordManager();
