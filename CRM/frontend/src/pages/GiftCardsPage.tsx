import React, { useState, useEffect, useMemo } from 'react';
import {
  Gift,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Plus,
  Download,
  Filter,
  Eye,
  CreditCard,
  Trash2,
  Calendar
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionMenu, ActionMenuItem } from '../components/ui/ActionMenu';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { CreateGiftCardModal } from '../sections/giftCards/CreateGiftCardModal';
import { RedeemGiftCardModal } from '../sections/giftCards/RedeemGiftCardModal';
import { GiftCardDetailsDrawer } from '../sections/giftCards/GiftCardDetailsDrawer';
import { giftCardService } from '../services/giftCardService';
import { GiftCard, GiftCardStatus } from '../types';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const GiftCardsPage: React.FC = () => {
  const { currentLocation, searchQuery } = useCrmContext();
  const { success, info } = useToast();

  const [cards, setCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | GiftCardStatus>('All');

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemInitialCard, setRedeemInitialCard] = useState('');
  const [selectedCardForDrawer, setSelectedCardForDrawer] = useState<GiftCard | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    setIsLoading(true);
    try {
      const data = await giftCardService.getGiftCards();
      setCards(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGiftCard = async (data: any) => {
    const newCard = await giftCardService.createGiftCard(data);
    setCards((prev) => [newCard, ...prev]);
    success('Gift Card Issued', `Certificate ${newCard.cardNumber} for ${newCard.recipient} created.`);
  };

  const handleRedeemSuccess = (updatedCard: GiftCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
    if (selectedCardForDrawer?.id === updatedCard.id) {
      setSelectedCardForDrawer(updatedCard);
    }
  };

  const filteredCards = useMemo(() => {
    const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

    return cards.filter((c) => {
      if (currentLocation !== 'All Locations' && c.location !== currentLocation) {
        return false;
      }
      if (statusFilter !== 'All' && c.status !== statusFilter) {
        return false;
      }
      if (effectiveSearch) {
        const matchNum = c.cardNumber.toLowerCase().includes(effectiveSearch);
        const matchRecip = c.recipient.toLowerCase().includes(effectiveSearch);
        const matchBuyer = c.buyer.toLowerCase().includes(effectiveSearch);
        if (!matchNum && !matchRecip && !matchBuyer) return false;
      }
      return true;
    });
  }, [cards, currentLocation, searchQuery, localSearch, statusFilter]);

  const sortedCards = useMemo(() => {
    const list = [...filteredCards];
    list.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredCards, sortField, sortDirection]);

  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedCards.slice(startIndex, startIndex + pageSize);
  }, [sortedCards, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCards.length / pageSize) || 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getActionMenuItems = (card: GiftCard): ActionMenuItem[] => [
    {
      label: 'View History & Details',
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: () => setSelectedCardForDrawer(card)
    },
    {
      label: 'Redeem Against Treatment',
      icon: <CreditCard className="w-3.5 h-3.5 text-forest-850" />,
      onClick: () => {
        setRedeemInitialCard(card.cardNumber);
        setIsRedeemModalOpen(true);
      }
    }
  ];

  const columns: Column<GiftCard>[] = [
    {
      key: 'cardNumber',
      header: 'GIFT CARD NO.',
      sortable: true,
      render: (card) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          {card.cardNumber}
        </span>
      )
    },
    {
      key: 'recipient',
      header: 'RECIPIENT',
      sortable: true,
      render: (card) => (
        <div>
          <p className="font-bold text-slate-900">{card.recipient}</p>
          <p className="text-[11px] text-slate-400">{card.location} Centre</p>
        </div>
      )
    },
    {
      key: 'buyer',
      header: 'BUYER',
      sortable: true,
      render: (card) => <span className="text-slate-700 font-medium">{card.buyer}</span>
    },
    {
      key: 'value',
      header: 'VALUE',
      sortable: true,
      align: 'right',
      render: (card) => (
        <span className="text-slate-700 font-semibold">${card.value.toFixed(2)}</span>
      )
    },
    {
      key: 'balance',
      header: 'BALANCE',
      sortable: true,
      align: 'right',
      render: (card) => (
        <span className={`font-bold ${card.balance > 0 ? 'text-forest-900' : 'text-slate-400'}`}>
          ${card.balance.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      sortable: true,
      render: (card) => <StatusBadge status={card.status} />
    },
    {
      key: 'expiryDate',
      header: 'EXPIRY DATE',
      sortable: true,
      render: (card) => <span className="text-slate-600 text-xs">{card.expiryDate}</span>
    },
    {
      key: 'createdOn',
      header: 'CREATED ON',
      sortable: true,
      render: (card) => <span className="text-slate-600 text-xs">{card.createdOn}</span>
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (card) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCardForDrawer(card)}
            className="text-xs px-2.5 py-1 h-7"
          >
            View
          </Button>
          {card.balance > 0 && card.status !== 'Expired' && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                setRedeemInitialCard(card.cardNumber);
                setIsRedeemModalOpen(true);
              }}
              className="text-xs px-2.5 py-1 h-7"
            >
              Redeem
            </Button>
          )}
          <ActionMenu items={getActionMenuItems(card)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="TOTAL GIFT CARDS"
          value={cards.length}
          comparisonText="issued to date"
          icon={<Gift className="w-5 h-5" />}
        />
        <StatCard
          label="TOTAL VALUE"
          value={`$${cards.reduce((s: number, c: GiftCard) => s + (c.value || 0), 0).toFixed(2)}`}
          comparisonText="gross issuance"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="REDEEMED"
          value={cards.filter((c: GiftCard) => c.status === 'Redeemed').length}
          comparisonText="completed visits"
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="EXPIRED"
          value={cards.filter((c: GiftCard) => c.status === 'Expired').length}
          comparisonText="unclaimed value"
          icon={<AlertCircle className="w-5 h-5 text-slate-400" />}
        />
        <StatCard
          label="ACTIVE"
          value={cards.filter((c: GiftCard) => c.status === 'Active' || c.status === 'Partially Used').length}
          comparisonText="ready for redemption"
          icon={<Sparkles className="w-5 h-5 text-gold-600" />}
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Create Gift Card
          </Button>

          {/* Prominent Redeem Flow Trigger */}
          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              setRedeemInitialCard('GC-AVS-100124');
              setIsRedeemModalOpen(true);
            }}
            icon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Redeem Gift Card
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Export', 'Exporting Gift Card ledger...')}
            icon={<Download className="w-3.5 h-3.5 text-slate-400" />}
          >
            Export
          </Button>

          {/* Status Quick Filters */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            {(['All', 'Active', 'Partially Used', 'Redeemed', 'Expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-forest-850 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search gift cards by #, recipient, buyer..."
          />
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="space-y-3">
        <Table
          columns={columns}
          data={paginatedCards}
          keyExtractor={(c) => c.id}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable
          selectedIds={selectedIds}
          onSelectAll={() => {
            if (selectedIds.length === paginatedCards.length) setSelectedIds([]);
            else setSelectedIds(paginatedCards.map((c) => c.id));
          }}
          onSelectRow={(id) => {
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          isLoading={isLoading}
          onRowClick={(c) => setSelectedCardForDrawer(c)}
          emptyTitle="No gift cards found"
          emptyDescription="Try adjusting status or card number search."
          emptyAction={
            <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Issue Gift Card
            </Button>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedCards.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Create Gift Card Modal */}
      <CreateGiftCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGiftCard={handleCreateGiftCard}
      />

      {/* 4-Step Redeem Gift Card Modal */}
      <RedeemGiftCardModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        initialCardNumber={redeemInitialCard}
        onSuccess={handleRedeemSuccess}
      />

      {/* Gift Card Details & History Drawer */}
      <GiftCardDetailsDrawer
        card={selectedCardForDrawer}
        isOpen={Boolean(selectedCardForDrawer)}
        onClose={() => setSelectedCardForDrawer(null)}
        onRedeem={(c) => {
          setRedeemInitialCard(c.cardNumber);
          setIsRedeemModalOpen(true);
        }}
      />
    </div>
  );
};
