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

export interface HeroSection {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface FooterContent {
  shopName: string;
  shopDescription: string;
  customerServiceHours: string[];
  customerServicePhone: string;
}

export interface GlobalSettings {
  hero: HeroSection;
  features: FeatureTile[];
  categories: CategoryTile[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  footer: FooterContent;
}

export interface TextStyle {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  textAlign?: string;
}
