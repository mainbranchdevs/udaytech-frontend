import api from './client';
import type {
  User, Address, Category, Product, ProductListItem,
  Service, Combo, Order, SupportTicket, Notification, Banner,
  AdminProductCreateInput, AdminProductUpdateInput,
  AdminServiceCreateInput, AdminServiceUpdateInput,
  AdminComboCreateInput, AdminComboUpdateInput,
  AdminBannerCreateInput, AdminBannerUpdateInput,
  AdminUsersQuery,
  AdminUserUpdateInput,
  ImageUploadResponse,
} from '../types';

// --- Auth ---
export const requestOtp = (email: string) => api.post('/auth/request-otp', { email });
export const verifyOtp = (email: string, otp: string) => api.post<{ message: string; role: string; is_new: boolean }>('/auth/verify-otp', { email, otp });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get<User>('/auth/me');

// --- Users ---
export const updateProfile = (data: { name?: string }) => api.patch<User>('/users/me', data);
export const getAddresses = () => api.get<Address[]>('/users/addresses');
export const createAddress = (data: Omit<Address, 'id'>) => api.post<Address>('/users/addresses', data);
export const updateAddress = (id: string, data: Partial<Address>) => api.patch<Address>(`/users/addresses/${id}`, data);

// --- Public catalog ---
export const getProducts = (params?: { search?: string; category_id?: number }) => api.get<ProductListItem[]>('/products', { params });
export const getProduct = (id: string) => api.get<Product>(`/products/${id}`);
export const getServices = () => api.get<Service[]>('/services');
export const getService = (id: string) => api.get<Service>(`/services/${id}`);
export const getCombos = () => api.get<Combo[]>('/combos');
export const getCombo = (id: string) => api.get<Combo>(`/combos/${id}`);
export const getCategories = () => api.get<Category[]>('/categories');
export const getBanners = () => api.get<Banner[]>('/banners');

// --- Orders ---
export const createOrder = (data: { address_id?: string; notes?: string; items: { item_type: string; item_id: string; quantity: number }[] }) => api.post<Order>('/orders', data);
export const getOrders = () => api.get<Order[]>('/orders');
export const getOrder = (id: string) => api.get<Order>(`/orders/${id}`);

// --- Wishlist ---
export const getWishlist = () => api.get<{ id: string; product_id: string; product: ProductListItem }[]>('/wishlist');
export const addToWishlist = (productId: string) => api.post('/wishlist', { product_id: productId });
export const removeFromWishlist = (id: string) => api.delete(`/wishlist/${id}`);

// --- Support ---
export const getTickets = () => api.get<SupportTicket[]>('/support/tickets');
export const createTicket = (data: { order_id?: string }) => api.post<SupportTicket>('/support/tickets', data);
export const sendMessage = (data: { ticket_id: string; message: string }) => api.post('/support/messages', data);
export const updateTicketStatus = (ticketId: string, data: { status: 'pending' | 'not_resolved' | 'completed' }) =>
  api.patch<SupportTicket>(`/support/tickets/${ticketId}/status`, data);

// --- Notifications ---
export const getNotifications = () => api.get<Notification[]>('/notifications');
export const markNotificationRead = (id: string) => api.patch<Notification>(`/notifications/${id}/read`);

// --- Admin ---
export const adminGetProducts = () => api.get<Product[]>('/admin/products');
export const adminCreateProduct = (data: AdminProductCreateInput) => api.post<Product>('/admin/products', data);
export const adminUpdateProduct = (id: string, data: AdminProductUpdateInput) => api.patch<Product>(`/admin/products/${id}`, data);
export const adminUploadProductImage = (id: string, file: File, isPrimary: boolean = false) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post<Product>(`/admin/products/${id}/images?is_primary=${isPrimary}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const adminGetServices = () => api.get<Service[]>('/admin/services');
export const adminCreateService = (data: AdminServiceCreateInput) => api.post<Service>('/admin/services', data);
export const adminUpdateService = (id: string, data: AdminServiceUpdateInput) => api.patch<Service>(`/admin/services/${id}`, data);
export const adminUploadServiceImage = (id: string, file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post<Service>(`/admin/services/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const adminGetCombos = () => api.get<Combo[]>('/admin/combos');
export const adminCreateCombo = (data: AdminComboCreateInput) => api.post<Combo>('/admin/combos', data);
export const adminUpdateCombo = (id: string, data: AdminComboUpdateInput) => api.patch<Combo>(`/admin/combos/${id}`, data);
export const adminUploadComboBanner = (id: string, file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post<Combo>(`/admin/combos/${id}/banner`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const adminGetOrders = () => api.get<Order[]>('/admin/orders');
export const adminUpdateOrderStatus = (id: string, data: { status: string; notes?: string }) => api.patch<Order>(`/admin/orders/${id}/status`, data);

export const adminGetBanners = () => api.get<Banner[]>('/admin/banners');
export const adminCreateBanner = (data: AdminBannerCreateInput) => api.post<Banner>('/admin/banners', data);
export const adminUpdateBanner = (id: string, data: AdminBannerUpdateInput) => api.patch<Banner>(`/admin/banners/${id}`, data);
export const adminUploadBannerImage = (file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post<ImageUploadResponse>('/admin/banners/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const adminGetCategories = () => api.get<Category[]>('/admin/categories');
export const adminCreateCategory = (data: { name: string; parent_id?: number }) => api.post<Category>('/admin/categories', data);
export const adminUpdateCategory = (id: number, data: Partial<Category>) => api.patch<Category>(`/admin/categories/${id}`, data);
export const adminGetUsers = (params?: AdminUsersQuery) => api.get<User[]>('/admin/users', { params });
export const adminUpdateUser = (id: string, data: AdminUserUpdateInput) => api.patch<User>(`/admin/users/${id}`, data);
