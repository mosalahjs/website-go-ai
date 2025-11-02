export type ContentSection = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
};

export type Hero = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export type CMHome = {
  hero: Hero;
  sections: ContentSection[];
};

export type CMAbout = {
  hero: Hero;
  sections: ContentSection[];
};

export type CMContact = {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
};

export type CMProject = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
};
