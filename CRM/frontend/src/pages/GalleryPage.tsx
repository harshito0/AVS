import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, Filter, Check, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { websiteService } from '../services/websiteService';
import { EmptyState } from '../components/ui/EmptyState';
import { GalleryItem } from '../types';
import { useToast } from '../hooks/useToast';

export const GalleryPage: React.FC = () => {
  const { success, info } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Lounge' | 'Treatments' | 'Spa Suites' | 'Products'>('Treatments');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const data = await websiteService.getGallery();
    setItems(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = await websiteService.addGalleryItem({
      title,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      description,
      status: 'Published'
    });

    setItems((prev) => [newItem, ...prev]);
    success('Image Added', `"${newItem.title}" added to the public gallery.`);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    await websiteService.deleteGalleryItem(itemToDelete.id);
    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    success('Image Deleted', 'Item removed from gallery state.');
    setItemToDelete(null);
  };

  const filteredItems = items.filter(
    (it) => activeCategory === 'All' || it.category === activeCategory
  );

  const categories = ['All', 'Lounge', 'Treatments', 'Spa Suites', 'Products'];

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-forest-850 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Gallery Item
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="crm-card p-12 text-center bg-white border border-[#E3EAE5]">
          <EmptyState
            title="No gallery items"
            description="Upload clinical spa interiors and hydrotherapy suite photography."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Gallery Photo
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
          <div
            key={item.id}
            className="crm-card overflow-hidden group hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            <div className="relative h-52 bg-slate-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0F291E]/80 backdrop-blur-xs text-white border border-white/20">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <StatusBadge status={item.status} />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">Added on {item.dateAdded}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Public Display</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setItemToDelete(item)}
                  className="text-rose-600 hover:bg-rose-50 h-8 px-2 text-xs"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Modal with Local File Preview */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setDescription('');
          setTitle('');
          setImageUrl('');
        }}
        title="Add Gallery Image"
        subtitle="Upload luxury interior or therapy treatment photography"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setIsAddModalOpen(false);
              setDescription('');
              setTitle('');
              setImageUrl('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddItem}>
              Add to Gallery
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <Input
            label="Image Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Zen Hydrotherapy Room"
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'Lounge', label: 'Lounge' },
              { value: 'Treatments', label: 'Treatments' },
              { value: 'Spa Suites', label: 'Spa Suites' },
              { value: 'Products', label: 'Products' }
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the atmosphere, equipment, therapy benefits, or sanctuary experience..."
              className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-xs rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-850 hover:file:bg-forest-100 cursor-pointer"
            />
          </div>

          <Input
            label="Or Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          {imageUrl && (
            <div className="rounded-xl overflow-hidden h-36 border border-slate-200">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title="Remove Gallery Image"
        message={`Are you sure you want to delete "${itemToDelete?.title}" from the gallery?`}
        confirmText="Delete"
        isDanger
      />
    </div>
  );
};
