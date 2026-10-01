import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../hooks/useToast';
import { ReviewItem } from '../types';
import { reviewService } from '../services/websiteService';

export const ReviewsPage: React.FC = () => {
  const { success, error: toastError, info } = useToast();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'All' | number>('All');

  // Modals state
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newService, setNewService] = useState('Registered Massage Therapy');
  const [newRating, setNewRating] = useState(5);
  const [newQuote, setNewQuote] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
      toastError('Failed to load reviews', 'Could not fetch client testimonials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await reviewService.deleteReview(reviewToDelete.id);
      if (ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
        success('Review Deleted', `Review by ${reviewToDelete.author} was removed from the website.`);
        setReviewToDelete(null);
        if (selectedReview?.id === reviewToDelete.id) {
          setSelectedReview(null);
        }
      } else {
        toastError('Delete Failed', 'Could not remove review from the server.');
      }
    } catch (e: any) {
      toastError('Delete Failed', e.message || 'Error occurred while deleting review.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newQuote.trim()) {
      toastError('Validation Error', 'Author name and review quote are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await reviewService.addReview({
        author: newAuthor.trim(),
        service: newService.trim(),
        rating: Number(newRating) || 5,
        quote: newQuote.trim()
      });
      setReviews((prev) => [created, ...prev]);
      success('Review Published', `New testimonial by ${created.author} is now live on the website.`);
      setIsAddModalOpen(false);
      setNewAuthor('');
      setNewQuote('');
      setNewRating(5);
    } catch (e: any) {
      toastError('Creation Failed', e.message || 'Could not add review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return reviews.filter((r) => {
      const matchesRating = ratingFilter === 'All' || r.rating === ratingFilter;
      const matchesQuery =
        !q ||
        r.author.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q) ||
        (r.service && r.service.toLowerCase().includes(q));
      return matchesRating && matchesQuery;
    });
  }, [reviews, searchQuery, ratingFilter]);

  // Metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Reviews</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalReviews}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Live on public website</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-850">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{avgRating}</span>
              <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 mt-0.5 text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-gold-600">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">5-Star Excellence</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{fiveStarCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {totalReviews > 0 ? `${Math.round((fiveStarCount / totalReviews) * 100)}% of total ratings` : '100% positive'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website Sync</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">Active</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time sync enabled</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        {/* Search & Rating Filter */}
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by author, service, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#D9E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-forest-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Rating filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {(['All', 5, 4, 3] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  ratingFilter === r
                    ? 'bg-white text-forest-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'All' ? 'All' : `${r} ★`}
              </button>
            ))}
          </div>

          <button
            onClick={loadReviews}
            title="Refresh Reviews"
            className="p-2 rounded-lg border border-[#D9E2DC] text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Right action button */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="crm-card p-12 text-center bg-white border border-[#E3EAE5] rounded-2xl">
          <EmptyState
            title="No reviews found"
            description={
              searchQuery || ratingFilter !== 'All'
                ? 'Try adjusting your search query or rating filter.'
                : 'Customer reviews submitted on the public website will automatically appear here.'
            }
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Testimonial
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#E3EAE5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Header: Avatar, Name, Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F5B47] to-[#07241A] text-gold-400 font-bold text-xs flex items-center justify-center shrink-0 border border-gold-400/30 shadow-xs">
                      {rev.avatar || rev.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{rev.author}</h4>
                      <p className="text-[11px] text-forest-700 font-medium truncate">
                        {rev.service || 'Holistic Wellness Care'}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-gold-500 shrink-0 bg-gold-50/60 px-2 py-1 rounded-lg border border-gold-200/50">
                    <span className="text-xs font-bold text-slate-800 mr-1">{rev.rating}.0</span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'fill-gold-500 text-gold-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-3.5 relative">
                  <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-4">
                    "{rev.quote}"
                  </p>
                </div>
              </div>

              {/* Bottom footer: date & action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  {rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent')}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReview(rev)}
                    className="h-7 px-2.5 text-xs text-slate-600 hover:text-forest-900 hover:border-forest-200"
                    icon={<Eye className="w-3 h-3" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReviewToDelete(rev)}
                    className="h-7 px-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    title="Delete Review"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Review Details Modal */}
      {selectedReview && (
        <Modal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title="Review Details"
          subtitle={`Client testimonial by ${selectedReview.author}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setReviewToDelete(selectedReview);
                }}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReview(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-forest-50/60 border border-forest-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F5B47] to-[#07241A] text-gold-400 font-bold text-sm flex items-center justify-center shrink-0 border border-gold-400/30">
                {selectedReview.avatar || selectedReview.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedReview.author}</h4>
                <p className="text-xs text-forest-800 font-semibold">{selectedReview.service || 'Holistic Wellness Care'}</p>
                <div className="flex items-center gap-1 mt-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < selectedReview.rating ? 'fill-gold-500 text-gold-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{selectedReview.rating}.0 / 5.0</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Client Testimonial
              </label>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                "{selectedReview.quote}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Submitted Date</span>
                <span className="font-semibold text-slate-800">
                  {selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleString() : selectedReview.date || 'Recent'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Website Visibility</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active on Live Site
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <Modal
          isOpen={Boolean(reviewToDelete)}
          onClose={() => setReviewToDelete(null)}
          title="Delete Review"
          subtitle="This action cannot be undone"
          maxWidth="sm"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete from Website
              </Button>
            </div>
          }
        >
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <p className="font-bold">Are you sure you want to delete this review?</p>
              <p className="mt-1 text-rose-700">
                The review by <strong>{reviewToDelete.author}</strong> will be permanently removed from both the CRM portal and the live public website testimonials slider.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Testimonial Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Verified Testimonial"
          subtitle="Publish a guest review to the public website"
          maxWidth="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="Client Name"
              placeholder="e.g. Priya M. or Rahul Verma"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Service Experience
              </label>
              <select
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2.5 focus:ring-1 focus:ring-forest-800"
              >
                <option value="Registered Massage Therapy">Registered Massage Therapy</option>
                <option value="Aesthetic & Skin Therapy">Aesthetic & Skin Therapy</option>
                <option value="Custom Orthotics Care">Custom Orthotics Care</option>
                <option value="Luxury 24K Gold Facial">Luxury 24K Gold Facial</option>
                <option value="Hair Spa & Head Massage">Hair Spa & Head Massage</option>
                <option value="Body Polishing Ritual">Body Polishing Ritual</option>
                <option value="Holistic Wellness Care">Holistic Wellness Care</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-gold-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'fill-gold-500 text-gold-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{newRating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Review Quote / Feedback
              </label>
              <textarea
                rows={3}
                placeholder="Share the guest's feedback about their treatment..."
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2.5 resize-none focus:ring-1 focus:ring-forest-800"
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                isLoading={isSubmitting}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Publish Review
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ReviewsPage;
