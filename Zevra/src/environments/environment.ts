export interface Environment {
    production: boolean;
    apiUrl: string;
    backendUrl: string;
    backendPort: number;
}

export const environment: Environment = {
    production: false,
    apiUrl: '/api',
    backendUrl: 'http://localhost:8080',
    backendPort: 8080
};
