import { GalleryItem, ServiceItem, PackageItem } from '../types';
import { galleryApi, servicesApi, packagesApi } from './apiClient';

function mapGallery(g: any): GalleryItem {
  return {
    id: g.id,
    title: g.title || 'Sanctuary Scene',
    category: (g.category || 'Treatments') as any,
    imageUrl: g.imageUrl || g.image || '',
    description: g.description || g.desc || '',
    status: (g.status || 'Published') as any,
    dateAdded: typeof g.createdAt === 'string' ? g.createdAt.split('T')[0] : (g.dateAdded || new Date().toISOString().split('T')[0])
  };
}

function mapService(s: any): ServiceItem {
  return {
    id: s.id,
    name: s.name || s.title || '',
    category: (s.category || 'Massage Therapy') as any,
    duration: s.duration || '60 min',
    price: s.price ?? 0,
    imageUrl: s.imageUrl || s.image || '',
    status: (s.status || 'Active') as any,
    description: s.description || s.desc || ''
  };
}

function mapPackage(p: any): PackageItem {
  return {
    id: p.id,
    name: p.name || p.title || '',
    category: p.category || 'Wellness',
    servicesIncluded: Array.isArray(p.servicesIncluded)
      ? p.servicesIncluded.map((s: any) => typeof s === 'string' ? s : (s.serviceName || s.name || 'Service'))
      : [],
    sessions: p.sessions ?? 1,
    price: p.price ?? 0,
    originalPrice: p.originalPrice ?? p.price ?? 0,
    discount: p.discount ?? 0,
    imageUrl: p.imageUrl || p.image || '',
    status: (p.status || 'Active') as any,
    description: p.description || p.desc || ''
  };
}

export const websiteService = {
  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    try {
      const res = await galleryApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapGallery);
      }
    } catch (e) {
      console.error('[websiteService] Failed to fetch gallery', e);
    }
    return [];
  },
  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'dateAdded'>): Promise<GalleryItem> {
    try {
      const res = await galleryApi.add({
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        status: item.status
      });
      if (res.success && res.data) {
        return mapGallery(res.data);
      }
    } catch (e) {
      console.error('[websiteService] Failed to add gallery item', e);
    }
    throw new Error('Failed to add gallery item');
  },
  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const res = await galleryApi.delete(id);
      return res.success;
    } catch (e) {
      console.error('[websiteService] Failed to delete gallery item', e);
      return false;
    }
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    try {
      const res = await servicesApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapService);
      }
    } catch (e) {
      console.error('[websiteService] Failed to fetch services', e);
    }
    return [];
  },
  async addService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
    try {
      const res = await servicesApi.create({
        name: service.name,
        category: service.category,
        duration: service.duration,
        price: service.price,
        imageUrl: service.imageUrl,
        description: service.description,
        status: service.status
      });
      if (res.success && res.data) {
        return mapService(res.data);
      }
    } catch (e) {
      console.error('[websiteService] Failed to add service', e);
    }
    throw new Error('Failed to add service');
  },
  async deleteService(id: string): Promise<boolean> {
    try {
      const res = await servicesApi.delete(id);
      return res.success;
    } catch (e) {
      console.error('[websiteService] Failed to delete service', e);
      return false;
    }
  },

  // Packages
  async getPackages(): Promise<PackageItem[]> {
    try {
      const res = await packagesApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapPackage);
      }
    } catch (e) {
      console.error('[websiteService] Failed to fetch packages', e);
    }
    return [];
  },
  async addPackage(pkg: Omit<PackageItem, 'id'>): Promise<PackageItem> {
    try {
      const res = await packagesApi.create({
        name: pkg.name,
        category: pkg.category,
        description: pkg.description,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        discount: pkg.discount,
        sessions: pkg.sessions,
        servicesIncluded: pkg.servicesIncluded,
        imageUrl: pkg.imageUrl,
        status: pkg.status
      });
      if (res.success && res.data) {
        return mapPackage(res.data);
      }
    } catch (e) {
      console.error('[websiteService] Failed to add package', e);
    }
    throw new Error('Failed to add package');
  },
  async deletePackage(id: string): Promise<boolean> {
    try {
      const res = await packagesApi.delete(id);
      return res.success;
    } catch (e) {
      console.error('[websiteService] Failed to delete package', e);
      return false;
    }
  }
};
