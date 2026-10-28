// 1. User & Authentication Interfaces

export interface IUser {
  _id: string;
  username: string;
  displayName: string;
  status: number;
  privatePrice: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
  refreshToken: string;
  phone?: string;
  email?: string;
  role?: string;
}

export interface ILoginRequest {
  phone: string;
  password: string;
}

export interface IRegisterRequest {
  phone: string;
  password: string;
  displayName: string;
}

export interface IVerifyOtpRequest {
  phone: string;
  code: string;
}

export interface IResetPasswordRequest {
  phone: string;
  code: string;
  newPassword: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user?: IUser;
  data?: IUser;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface ILoginErrorFeedback {
  title: string;
  message: string;
}

// 2. Catalog & Products Interfaces

export interface Product {
  _id: string;
  name: string;
  price: number;
  priceAfterDiscount?: number;
  priceAfterdiscound?: number;   // typo في الـ API — موجود بالاتنين
  images?: string[];
  imageCover?: string;
  brand?: { name: string; _id?: string };
  slug?: string;
  description?: string;
  quantity?: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  // ── fields زيادة من الـ API ──
  classification?: string | Classification;
  subClass?: string | SubClass;
  category?: string[] | Category[];
  subcategories?: string;
  available?: boolean;
  newArriv?: boolean;
  bestSeller?: boolean;
  trusted?: boolean;
  howToUse?: string;
  warning?: string;
  components?: string[];
  for?: string[];           // ["Women", "Men"]
  Skin?: string[];          // skin types
  hair?: string[];          // hair types
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
  description?: string;
  active?: boolean;
  productCount?: number;
}

export interface Classification {
  _id: string;
  name: string;
  image: string;
  active?: boolean;
  productCount?: number; // returned by /classification/withCounts
}

// SubClass belongs to a Classification
// API: GET /api/v1/subclass  |  POST body: { name, classification }
export interface SubClass {
  _id: string;
  name: string;
  classification: string | Classification; // populated أو ID فقط
  productCount?: number; // returned by /subclass/withProductCount
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  image?: string;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  next?: number;
}

export interface ApiResponse<T> {
  results?: number;
  paginationResult?: PaginationResult;
  data: T;
  message?: string;
  status?: string;
}

// 3. Home & Landing Page Interfaces

export interface HeroSlide {
  image: string;
  link: string;
  title: string;
  priority?: 'high' | 'auto';
}

export interface FeatureItem {
  icon?: string;
  text: string;
}

export interface PromoBanner {
  eyebrow: string;
  title: string;
  highlight: string;
  desc: string;
  cta: string;
  link: string;
  theme: 'navy' | 'bronze';
}

// 4. Layout & Navigation Interfaces

export interface SidebarItem {
  labelAr: string;
  route?: string;
  icon: string; // icon key → rendered via ngSwitch in template
  children?: { labelAr: string; route: string }[];
}

export interface SidebarSection {
  titleAr?: string; // optional section header
  items: SidebarItem[];
}

export interface NavItem {
  label: string;
  labelAr: string;
  route?: string;
  children?: { label: string; labelAr: string; route: string }[];
}

export interface SidebarNavItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarNavItem[];
  section?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface DisplayProduct extends Product {
  imageUrl: string;
  isWishlisted: boolean;
  isLimited: boolean;
  hasDiscount: boolean;
  finalPrice: number;
}

// 5. Reviews & Ratings
// API: POST /api/v1/reviews  — body: { product, name, details, ratings }
export interface Review {
  _id: string;
  product: string;
  user?: { _id: string; name?: string; profileImg?: string };
  name: string;           // عنوان الريفيو
  details?: string;       // تفاصيل
  ratings: number;        // 1–5
  createdAt?: string;
}

// 6. Cart (local state — مفيش Cart API، بنخزنه في localStorage)
export interface CartItem {
  product: Product;
  quantity: number;
  price: number;          // السعر وقت الإضافة (بعد الخصم لو موجود)
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;     // عدد الأصناف
  totalQuantity: number;  // إجمالي القطع
  subtotal: number;       // إجمالي السعر قبل الشحن
}
