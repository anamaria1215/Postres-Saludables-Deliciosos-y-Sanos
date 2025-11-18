export enum DeliveryStatus {
    ENVIADO = 'Enviado',
    EN_CAMINO = 'En camino',
    ENTREGADO = 'Entregado',
    ENTREGA_FALLIDA = 'Entrega fallida', //Si la entrega falla por parte del domiciliario y regresa a la tienda
}