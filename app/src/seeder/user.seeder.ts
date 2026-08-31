import sequelize from "../config/database.ts";
import User from "../models/user.model.ts";
import type { UserCreationDto } from "../dto/user.dto.ts";
import { passwordManager } from "../utils/bcrypt.util.ts";


/**
 * defautl users
 * toles admin and operator.
 */
const fixedUsers: UserCreationDto[] = [
    { name: "Luis Reyes", email: "luisreyescaro@gmail.com", password: "LuisDev2026!", role: "admin"},
    { name: "Demo User", email: "user@gmail.com",password: "DemoUser2026!", role: "operator" },
];

/**
 * Runs the user seeder.
 */
export async function runSeeder(): Promise<void> {
    await sequelize.authenticate();
    await sequelize.sync();

    for (const seed of fixedUsers) {
        const [user, created] = await User.findOrCreate({
            where: { name: seed.name },
            defaults: {
                name: seed.name,
                email: seed.email,
                password: await passwordManager.passwordHasher(seed.password),
                role: seed.role
            },
        });

        console.log(
        created
            ? `[seeder] usuario creado: ${user.name}`
            : `[seeder] usuario ya existente, se omite: ${user.name}`,
        );
    }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
    runSeeder()
        .then(async () => {
            console.log("[seeder] ejecución finalizada correctamente");
            await sequelize.close();
            process.exit(0);
        })
        .catch(async (error) => {
            console.error("[seeder] error ejecutando el seeder:", error);
            await sequelize.close();
            process.exit(1);
        });
}