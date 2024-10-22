export interface User {
    id: string;
    username: string; // Unique username
    email: string;
    firstName: string;
    password: string; // Hashed password
    subscribe?: boolean;
    aquariumIds?: string[]; // List of owned aquariums
    role?: 'admin' | 'user'; // User role
    createdAt: Date; // Account creation timestamp
    profilePictureUrl?: string; // Optional profile picture URL
    bio?: string; // Optional user biography
}