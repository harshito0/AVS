import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit2, Clock, DollarSign, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { websiteService } from '../services/websiteService';
import { ServiceItem } from '../types';
import { useToast } from '../hooks/useToast';

export const ServicesPage: React.FC = () => {
  const { success } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('Massage Therapy');
  const [duration, setDuration] = useState('60 min');
  const [price, setPrice] = useState<number>(120);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await websiteService.getServices();
    setServices(data);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSvc = await websiteService.addService({
      name,
      category,
      duration,
      price,
      status: 'Active',
      description,
      imageUrl: imageUrl || '/hero_massage.webp'
    });

    setServices((prev) => [...prev, newSvc]);
    success('Service Created', `${newSvc.name} added to treatments catalog.`);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    await websiteService.deleteService(serviceToDelete.id);
    setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
    success('Service Deleted', `${serviceToDelete.name} has been removed.`);
    setServiceToDelete(null);
  };

  const categories = [
    'All',
    'Massage Therapy',
    'Facial & Skincare',
    'Hair Spa',
    'Nail Care',
    'Body Rituals',
    'Laser & Waxing'
  ];

  const filteredServices = services.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
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

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="crm-card p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 space-y-4 overflow-hidden"
          >
            {service.imageUrl && (
              <div className="h-32 -mx-5 -mt-5 mb-1 overflow-hidden bg-slate-100">
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold tracking-wider text-forest-850 uppercase">
                  {service.category}
                </span>
                <StatusBadge status={service.status} />
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-1">{service.name}</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {service.duration}
                </span>
                <span className="font-extrabold text-forest-900 text-sm">
                  ${service.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setServiceToDelete(service)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 h-8 w-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setImageUrl('');
          setName('');
          setDescription('');
        }}
        title="Add Treatment Service"
        subtitle="Introduce a new spa therapy or medical aesthetics service"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setIsAddModalOpen(false);
              setImageUrl('');
              setName('');
              setDescription('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddService}>
              Save Service
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddService} className="space-y-4">
          <Input
            label="Service Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Herbal Scalp & Foot Ritual"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'Massage Therapy', label: 'Massage Therapy' },
                { value: 'Facial & Skincare', label: 'Facial & Skincare' },
                { value: 'Hair Spa', label: 'Hair Spa' },
                { value: 'Nail Care', label: 'Nail Care' },
                { value: 'Body Rituals', label: 'Body Rituals' },
                { value: 'Laser & Waxing', label: 'Laser & Waxing' }
              ]}
            />
            <Input
              label="Standard Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60 min"
            />
          </div>

          <Input
            label="Price ($ CAD) *"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            required
          />

          <Input
            label="Service Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g. /hero_massage.webp or https://images.unsplash.com/..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical treatment details, benefits, and organic ingredients used..."
              className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
            />
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Remove Service"
        message={`Are you sure you want to remove "${serviceToDelete?.name}"?`}
        confirmText="Delete"
        isDanger
      />
    </div>
  );
};
