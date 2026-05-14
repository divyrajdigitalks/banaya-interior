import api from '../axios';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
  personalization?: {
    name?: string;
    description?: string;
    image?: string;
  };
}

export interface Order {
  _id: string;
  user: any;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: string;
}

class OrderService {
  async createOrder(data: { shippingAddress: any; totalAmount: number }) {
    const res = await api.post('/orders', data);
    return res.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get('/orders/my-orders');
    return res.data.data;
  }

  async getAllOrders(): Promise<Order[]> {
    const res = await api.get('/orders');
    return res.data.data;
  }

  async updateOrderStatus(id: string, status: string) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  }
}

export const orderService = new OrderService();
