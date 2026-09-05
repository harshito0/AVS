import React, { useState, useEffect } from 'react';
import { Package, Plus, Check, Trash2, Edit2, Sparkles, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { EmptyState } from '../components/ui/EmptyState';
import { websiteService } from '../services/websiteService';
import { PackageItem } from '../types';
import { useToast } from '../hooks/useToast';

export const PackagesPage: React.FC = () => {
  const { success, info } = useToast();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pkgToDelete, setPkgToDelete] = useState<PackageItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Wellness Immersion');
  const [servicesIncluded, setServicesIncluded] = useState('');
  const [sessions, setSessions] = useState<number>(3);
  const [price, setPrice] = useState<number>(399);
  const [originalPrice, setOriginalPrice] = useState<number>(480);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const data = await websiteService.getPackages();
    setPackages(data);
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discount = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const newPkg = await websiteService.addPackage({
      name,
      category,
      servicesIncluded: servicesIncluded.split(',').map((s) => s.trim()).filter(Boolean),
      sessions,
      price,
      originalPrice,
      discount,
      status: 'Active',
      description,
      imageUrl: imageUrl || '/hero_relaxation.webp'
    });

    setPackages((prev) => [...prev, newPkg]);
    success('Package Added', `"${newPkg.name}" bundle published.`);
    setIsAddModalOpen(false);
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleDeletePackage = async () => {
    if (!pkgToDelete) return;
    await websiteService.deletePackage(pkgToDelete.id);
    setPackages((prev) => prev.filter((p) => p.id !== pkgToDelete.id));
    success('Package Removed', `${pkgToDelete.name} deleted.`);
    setPkgToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Treatment Packages & Bundles</h3>
          <p className="text-xs text-slate-500">Multi-session offerings and promotional care packages</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Package
        </Button>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="crm-card p-12 text-center bg-white border border-[#E3EAE5]">
          <EmptyState
            title="No treatment packages configured"
            description="Bundle clinical wellness sessions and create promotional programs."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Create Package
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="crm-card p-6 flex flex-col justify-between border-[#DDE5E0] hover:border-[#CAD8CE] hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              {pkg.imageUrl && (
                <div className="h-36 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100">
                  <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
              )}
              {/* Top Accent Strip */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-forest-850 uppercase">
                      {pkg.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">{pkg.name}</h4>
                  </div>
                  <StatusBadge status={pkg.status} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Inclusions List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Services Included ({pkg.sessions} {pkg.sessions > 1 ? 'Sessions' : 'Session'}):
                  </p>
                  <div className="space-y-1.5">
                    {pkg.servicesIncluded.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-forest-900">${pkg.price.toFixed(2)}</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${pkg.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {pkg.discount > 0 && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-full">
                        SAVE {pkg.discount}%
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Taxes calculated at invoice generation</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => info('Package Details', `Reviewing ${pkg.name}`)}
                    className="text-xs"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPkgToDelete(pkg)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 h-8 w-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Package Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setImageUrl('');
          setName('');
          setDescription('');
        }}
        title="Create Treatment Package"
        subtitle="Bundle treatments into a high-value wellness journey"
        maxWidth="lg"
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
            <Button variant="primary" size="sm" onClick={handleAddPackage}>
              Create Package
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddPackage} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Package Title *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Serenity Trio"
              required
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Bridal Care"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Total Sessions"
              type="number"
              min="1"
              value={sessions}
              onChange={(e) => setSessions(parseInt(e.target.value) || 1)}
            />
            <Input
              label="Package Price ($) *"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Regular Value ($)"
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <Input
            label="Package Cover Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g. /hero_relaxation.webp or https://images.unsplash.com/..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Services Included (comma separated)
            </label>
            <textarea
              rows={2}
              value={servicesIncluded}
              onChange={(e) => setServicesIncluded(e.target.value)}
              placeholder="60 min RMT Massage, 24K Gold Facial, Aromatherapy Scalp Treatment"
              className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A curated spa package designed for..."
              className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
            />
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(pkgToDelete)}
        onClose={() => setPkgToDelete(null)}
        onConfirm={handleDeletePackage}
        title="Remove Package"
        message={`Are you sure you want to delete "${pkgToDelete?.name}"?`}
        confirmText="Delete"
        isDanger
      />
    </div>
  );
};
