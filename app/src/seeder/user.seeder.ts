import sequelize from "../config/database.ts";
import User from "../models/user.model.ts";
import type { UserCreationDto } from "../dto/user.dto.ts";
import { passwordManager } from "../utils/bcrypt.util.ts";


/**
 * Usuarios fijos, siempre presentes (útiles para probar login,
 * roles, admin panel, etc. con credenciales conocidas).
 */
const fixedUsers: UserCreationDto[] = [
    { name: "Admin", email: "admin@admin.com", password: "Admin123!", role:"admin"},
    { name: "Luis Reyes", email: "luisreyescaro@gmail.com", password: "LuisDev2026!", role: "develop"},
    { name: "QA tester", email: "qatester@gmail.com" ,password: "QaTest2026!", role: "qa" },
    { name: "Demo User", email: "user@gmail.com",password: "DemoUser2026!", role: "user" },
];

/**
 * Ejecuta el seeder de usuarios.
 * Es idempotente: si el usuario ya existe (por "name") no lo vuelve
 * a crear, así se puede ejecutar cada vez que levanta el contenedor
 * sin generar duplicados ni errores.
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