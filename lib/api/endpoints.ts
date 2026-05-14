export interface EndPointApi {
  // Auth
  adminLogin: string;
  register: string;
  logout: string;
  profile: string;

  // Cart
  cart: string;
  cartAdd: string;
  cartUpdate: string;
  cartRemove: string;
  cartClear: string;

  // Wishlist
  wishlist: string;
  wishlistAdd: string;
  wishlistRemove: string;
  wishlistClear: string;
  wishlistCheck: string;

  // Categories
  adminCategories: string;
  adminCategoryCreate: string;
  adminCategoryUpdate: string;
  adminCategoryDelete: string;

  // Subcategories
  adminSubcategories: string;
  adminSubcategoryCreate: string;
  adminSubcategoryUpdate: string;
  adminSubcategoryDelete: string;

  // Products
  adminProducts: string;
  adminProductCreate: string;
  adminProductUpdate: string;
  adminProductDelete: string;

  // Collections
  collections: string;
  adminCollections: string;
  adminCollectionCreate: string;
  adminCollectionUpdate: string;
  adminCollectionDelete: string;

  // Gallery
  adminGallery: string;
  adminGalleryCreate: string;
  adminGalleryUpdate: string;
  adminGalleryDelete: string;

  // Filter Options
  adminFilterOptions: string;
  adminFilterOptionCreate: string;
  adminFilterOptionUpdate: string;
  adminFilterOptionDelete: string;

  // Projects
  adminProjects: string;
  adminProjectCreate: string;
  adminProjectUpdate: string;
  adminProjectDelete: string;

  // Process Steps
  adminProcessSteps: string;
  adminProcessStepCreate: string;
  adminProcessStepUpdate: string;
  adminProcessStepDelete: string;

  // Testimonials
  adminTestimonials: string;
  adminTestimonialCreate: string;
  adminTestimonialUpdate: string;
  adminTestimonialDelete: string;

  // Services
  adminServices: string;
  adminServiceCreate: string;
  adminServiceUpdate: string;
  adminServiceDelete: string;

  // Inquiries/Quotations
  adminInquiries: string;
  adminInquiryDelete: string;
  adminInquiryUpdateStatus: string;
  submitInquiry: string;

  // Calculator
  calculatorData: string;
  calculatorItems: string;
  calculatorBrands: string;
  calculatorServices: string;
  calculatorInteriorServices: string;
  calculatorHomeServices: string;
  calculatorDownloadPdf: string;

  // Cost Guide
  costGuide: string;
  costGuideAdmin: string;
  costGuideSort: string;

  // Coupons
  coupons: string;
  couponValidate: string;

  // Hero & Features
  decorHero: string;
  interiorHero: string;
  decorFeatures: string;

  // About & Why Choose
  about: string;
  aboutAdmin: string;
  aboutByType: string;
  whyChoose: string;
  whyChooseAdmin: string;

  // Offers
  offers: string;

  // Interior Projects & Categories
  interiorCategories: string;
  interiorProjects: string;

  // Legacy Projects
  legacyProjects: string;
  legacyProjectSettings: string;

  // Orders
  orders: string;
  myOrders: string;

  // Upload
  adminUpload: string;
}

const endPointApi: EndPointApi = {
  // Auth
  adminLogin: 'auth/login',
  register: 'auth/register',
  logout: 'auth/logout',
  profile: 'auth/profile',

  // Cart
  cart: 'cart',
  cartAdd: 'cart/add',
  cartUpdate: 'cart/update',
  cartRemove: 'cart/remove',
  cartClear: 'cart/clear',

  // Wishlist
  wishlist: 'wishlist',
  wishlistAdd: 'wishlist/add',
  wishlistRemove: 'wishlist/remove',
  wishlistClear: 'wishlist/clear',
  wishlistCheck: 'wishlist/check',

  // Categories
  adminCategories: 'categories',
  adminCategoryCreate: 'categories',
  adminCategoryUpdate: 'categories',
  adminCategoryDelete: 'categories',

  // Subcategories
  adminSubcategories: 'subcategories',
  adminSubcategoryCreate: 'subcategories',
  adminSubcategoryUpdate: 'subcategories',
  adminSubcategoryDelete: 'subcategories',

  // Products
  adminProducts: 'products',
  adminProductCreate: 'products',
  adminProductUpdate: 'products',
  adminProductDelete: 'products',

  // Collections
  collections: 'collections',
  adminCollections: 'collections',
  adminCollectionCreate: 'collections',
  adminCollectionUpdate: 'collections',
  adminCollectionDelete: 'collections',

  // Gallery
  adminGallery: 'gallery',
  adminGalleryCreate: 'gallery',
  adminGalleryUpdate: 'gallery',
  adminGalleryDelete: 'gallery',

  // Filter Options
  adminFilterOptions: 'filter-options',
  adminFilterOptionCreate: 'filter-options',
  adminFilterOptionUpdate: 'filter-options',
  adminFilterOptionDelete: 'filter-options',

  // Projects
  adminProjects: 'projects',
  adminProjectCreate: 'projects',
  adminProjectUpdate: 'projects',
  adminProjectDelete: 'projects',

  // Process Steps
  adminProcessSteps: 'process-steps',
  adminProcessStepCreate: 'process-steps',
  adminProcessStepUpdate: 'process-steps',
  adminProcessStepDelete: 'process-steps',

  // Testimonials
  adminTestimonials: 'testimonials',
  adminTestimonialCreate: 'testimonials',
  adminTestimonialUpdate: 'testimonials',
  adminTestimonialDelete: 'testimonials',

  // Services
  adminServices: 'services',
  adminServiceCreate: 'services',
  adminServiceUpdate: 'services',
  adminServiceDelete: 'services',

  // Inquiries/Quotations
  adminInquiries: 'inquiries',
  adminInquiryDelete: 'inquiries',
  adminInquiryUpdateStatus: 'inquiries/status',
  submitInquiry: 'inquiries',

  // Calculator
  calculatorData: 'calculator/data',
  calculatorItems: 'calculator/items',
  calculatorBrands: 'calculator/brands',
  calculatorServices: 'calculator/services',
  calculatorInteriorServices: 'calculator/interior-services',
  calculatorHomeServices: 'calculator/home-services',
  calculatorDownloadPdf: 'calculator/download-pdf',

  // Cost Guide
  costGuide: 'cost-guide',
  costGuideAdmin: 'cost-guide/admin/all',
  costGuideSort: 'cost-guide/sort/order',

  // Coupons
  coupons: 'coupons',
  couponValidate: 'coupons/validate',

  // Hero & Features
  decorHero: 'decor-hero',
  interiorHero: 'interior-hero',
  decorFeatures: 'decor-features',

  // About & Why Choose
  about: 'about',
  aboutAdmin: 'about/admin/all',
  aboutByType: 'about/type',
  whyChoose: 'why-choose',
  whyChooseAdmin: 'why-choose/admin/all',

  // Offers
  offers: 'offers',

  // Interior Projects & Categories
  interiorCategories: 'interior-categories',
  interiorProjects: 'interior-projects',

  // Legacy Projects
  legacyProjects: 'legacy-projects',
  legacyProjectSettings: 'legacy-projects/settings',

  // Orders
  orders: 'orders',
  myOrders: 'orders/my-orders',

  // Upload
  adminUpload: 'upload',
};

export default endPointApi;
