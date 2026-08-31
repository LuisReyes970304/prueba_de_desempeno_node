/**
 * Data used to crecate the user.
 */
export interface UserCreationDto {
    name: string;
    email: string;
    password: string;    
    role: string;
}

/**
 * Data needed to update an user.
 */
export interface UserUpdateDto {
    name?: string;
    password?: string;
}

/**
 * This is a DTO that will be needed to update from user to admin or another role. 
 */
export interface UpdateToAdmin {
    name: string;
    password: string;
    role: "admin";
}