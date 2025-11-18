export enum OrderStatus {
    CREADA = 'Creada',
    PREPARANDO = 'Preparando',
    EN_CAMINO = 'En camino',
    COMPLETADA = 'Completada',
    CANCELADA = 'Cancelada', 
    ENTREGA_FALLIDA = 'Entrega fallida', //Fallida por el domiciliario
    ELIMINADA = 'Eliminada' //Soft delete
}