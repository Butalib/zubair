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
  priceAfterdiscound?: number;
  images?: string[];
  imageCover?: string;
  brand?: { name: string; _id?: string };
  slug?: string;
  description?: string;
  quantity?: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

export interface Classification {
  _id: string;
  name: string;
  image: string;
  active: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  image?: string;
}

 // 3. Home & Landing Page Interfaces
 
export interface HeroSlide {
  image: string;
  link: string;
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
