import { EntityRepository, Repository } from 'typeorm';
import { OrderDetail } from '../entities/orderDetail.entity';

@EntityRepository(OrderDetail)
export class OrderDetailRepository extends Repository<OrderDetail> {}
