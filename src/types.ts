export enum ServiceStatus {
    up = 'up',
    down = 'down'
}

export interface ServiceStatusResponse {
    status: ServiceStatus
}
