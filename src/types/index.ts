export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'admin';
  is_verified: boolean;
  created_at: string;
  profile_image: string | null;
}

export interface Address {
  id: string;
  full_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductAttribute {
  id: string;
  attribute_name: string;
  attribute_value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category_id: number | null;
  base_price: number;
  discount_price: number | null;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  images: ProductImage[];
  attributes: ProductAttribute[];
}

export interface ProductListItem {
  id: string;
  name: string;
  base_price: number;
  discount_price: number | null;
  primary_image: string | null;
  category_id: number | null;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price: number;
  is_active: boolean;
  is_published: boolean;
}

export interface ComboItem {
  id: string;
  item_type: 'product' | 'service';
  item_id: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  description: string | null;
  price: number;
  banner_image: string | null;
  is_active: boolean;
  is_published: boolean;
  items: ComboItem[];
}

export interface OrderItem {
  id: string;
  item_type: 'product' | 'service';
  item_id: string;
  quantity: number;
  price_snapshot: number;
}

export interface StatusHistory {
  id: string;
  status: string;
  timestamp: string;
  notes: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_price: number;
  address_id: string | null;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
  status_history: StatusHistory[];
}

export interface SupportMessage {
  id: string;
  sender_id: string;
  message: string;
  message_type: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id: string | null;
  status: 'pending' | 'not_resolved' | 'completed' | 'open';
  created_at: string;
  messages: SupportMessage[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  redirect_type: string | null;
  redirect_id: string | null;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface ProductAttributeInput {
  attribute_name: string;
  attribute_value: string;
}

export interface ComboItemInput {
  item_type: 'product' | 'service';
  item_id: string;
  quantity: number;
}

export interface AdminProductCreateInput {
  name: string;
  description?: string | null;
  category_id?: number | null;
  base_price: number;
  discount_price?: number | null;
  is_published?: boolean;
  attributes?: ProductAttributeInput[];
}

export interface AdminProductUpdateInput {
  name?: string;
  description?: string | null;
  category_id?: number | null;
  base_price?: number;
  discount_price?: number | null;
  is_active?: boolean;
  is_published?: boolean;
  attributes?: ProductAttributeInput[];
}

export interface AdminServiceCreateInput {
  name: string;
  description?: string | null;
  image_url?: string | null;
  base_price: number;
  is_published?: boolean;
}

export interface AdminServiceUpdateInput {
  name?: string;
  description?: string | null;
  image_url?: string | null;
  base_price?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export interface AdminComboCreateInput {
  name: string;
  description?: string | null;
  price: number;
  is_published?: boolean;
  items?: ComboItemInput[];
}

export interface AdminComboUpdateInput {
  name?: string;
  description?: string | null;
  price?: number;
  is_active?: boolean;
  is_published?: boolean;
  items?: ComboItemInput[];
}

export interface AdminBannerCreateInput {
  title: string;
  image_url: string;
  redirect_type?: string | null;
  redirect_id?: string | null;
  priority?: number;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

export interface AdminBannerUpdateInput {
  title?: string;
  image_url?: string;
  redirect_type?: string | null;
  redirect_id?: string | null;
  priority?: number;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

export interface AdminUsersQuery {
  search?: string;
  role?: 'admin' | 'customer';
  is_verified?: boolean;
}

export interface AdminUserUpdateInput {
  name?: string | null;
  role?: 'admin' | 'customer';
  is_verified?: boolean;
}

export interface ImageUploadResponse {
  image_url: string;
}
