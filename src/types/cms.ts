export interface FeatureTile {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CategoryTile {
  id: number;
  name: string;
  image: string;
  icon: string;
  color: string;
}

// Category from product-service API
export interface CategoryFromAPI {
  id: string; // UUID
  name: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  subCategoryCount: number;
  productCount: number;
  propertyCount: number;
}

export interface GetCategoriesResponse {
  categories: CategoryFromAPI[];
}

export interface HeroSection {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface FooterContent {
  shopName: string;
  shopDescription: string;
  customerServiceHours: string[];
  customerServicePhone: string;
  socialMedia: SocialMedia;
  copyrightText: string;
}

export interface ContactPageContent {
  pageTitle: string;
  pageSubtitle: string;
  sectionTitle: string;
  phone: string;
  phoneHours: string;
  email: string;
  emailDescription: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  expanded?: boolean;
}

export interface FaqPageContent {
  pageTitle: string;
  pageSubtitle: string;
  faqItems: FaqItem[];
}

export interface HomePageContent {
  hero: HeroSection;
  features: FeatureTile[];
  categories: CategoryTile[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  footer: FooterContent;
  headerShopName: string;
  selectedCategoryIds?: string[]; // IDs of categories to display from API
}

export interface GlobalSettings {
  hero: HeroSection;
  features: FeatureTile[];
  categories: CategoryTile[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  footer: FooterContent;
  headerShopName: string;
  contactPage: ContactPageContent;
  faqPage?: FaqPageContent;
  selectedCategoryIds?: string[]; // IDs of categories to display from API
}

export interface TextStyle {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  textAlign?: string;
}
