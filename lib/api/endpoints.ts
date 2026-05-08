export interface EndPointApi {
  // Auth
  adminLogin: string;
  logout: string;

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

  // Upload
  adminUpload: string;
}

const endPointApi: EndPointApi = {
  // Auth
  adminLogin: 'auth/login',
  logout: 'auth/logout',

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

  // Upload
  adminUpload: 'upload',
};

export default endPointApi;
