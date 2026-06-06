import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Lock } from 'lucide-react';
import { Button, Card, Input, Modal } from '../../design-system/components';
import { BottomSheet } from '../../design-system/components/BottomSheet';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { Category } from '../../types';
import { generateId } from '../../lib/utils';
import { useToast } from '../../design-system/components/Toast';
import { ProUpgradeModal } from '../settings/ProUpgradeModal';

const AVAILABLE_COLORS = [
  '#16653A', '#9B3121', '#92560E', '#1E40AF', '#9333EA',
  '#DC2626', '#EA580C', '#CA8A04', '#65A30D', '#0891B2',
];

export function Categories(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', colour: AVAILABLE_COLORS[0] });
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const settings = await settingsRepository.get();
    setIsPro(settings?.isPro || false);
    const allCategories = await categoriesRepository.getAll();
    setCategories(allCategories);
  };

  const handleAdd = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    setEditingCategory(null);
    setFormData({ name: '', colour: AVAILABLE_COLORS[0] });
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    if (category.isSystem) {
      toast.warning('System categories cannot be edited');
      return;
    }
    setEditingCategory(category);
    setFormData({ name: category.name, colour: category.colour });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoriesRepository.update(editingCategory.id, {
          name: formData.name,
          colour: formData.colour,
        });
        toast.success('Category updated');
      } else {
        const newCategory: Category = {
          id: generateId(),
          name: formData.name,
          type: 'expense',
          icon: 'Tag',
          colour: formData.colour,
          isSystem: false,
          isCustom: true,
        };
        await categoriesRepository.create(newCategory);
        toast.success('Category created');
      }
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save category');
      console.error('Category save error:', error);
    }
  };

  const handleDelete = async (category: Category) => {
    const transactions = await transactionsRepository.getByCategoryId(category.id);
    if (transactions.length > 0) {
      toast.error(`Cannot delete. ${transactions.length} transactions use this category.`);
      setDeleteConfirm(null);
      return;
    }

    try {
      await categoriesRepository.delete(category.id);
      toast.success('Category deleted');
      setDeleteConfirm(null);
      loadData();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Category deletion error:', error);
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mc-text-1">Categories</h1>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add Custom
        </Button>
      </div>

      {!isPro && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-info">
          <div className="flex items-start gap-3">
            <Lock className="text-mc-info" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Custom categories are a Pro feature</p>
              <p className="text-xs text-mc-text-2">Upgrade to create your own categories</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-mc-text-1">Income Categories</h2>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <Card key={category.id} variant="default">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{ backgroundColor: category.colour + '20' }}
                    >
                      <div
                        className="flex h-full w-full items-center justify-center text-xs font-bold"
                        style={{ color: category.colour }}
                      >
                        {category.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-mc-text-1">{category.name}</p>
                      {category.isSystem && (
                        <p className="text-xs text-mc-text-3">System category</p>
                      )}
                      {category.isCustom && (
                        <p className="text-xs text-mc-accent">Custom</p>
                      )}
                    </div>
                  </div>
                  {category.isCustom && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded-mc-sm p-1 text-mc-text-2 hover:bg-mc-bg-subtle hover:text-mc-text-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        className="rounded-mc-sm p-1 text-mc-text-2 hover:bg-mc-bg-subtle hover:text-mc-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-mc-text-1">Expense Categories</h2>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <Card key={category.id} variant="default">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{ backgroundColor: category.colour + '20' }}
                    >
                      <div
                        className="flex h-full w-full items-center justify-center text-xs font-bold"
                        style={{ color: category.colour }}
                      >
                        {category.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-mc-text-1">{category.name}</p>
                      {category.isSystem && (
                        <p className="text-xs text-mc-text-3">System category</p>
                      )}
                      {category.isCustom && (
                        <p className="text-xs text-mc-accent">Custom</p>
                      )}
                    </div>
                  </div>
                  {category.isCustom && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded-mc-sm p-1 text-mc-text-2 hover:bg-mc-bg-subtle hover:text-mc-text-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        className="rounded-mc-sm p-1 text-mc-text-2 hover:bg-mc-bg-subtle hover:text-mc-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <BottomSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Custom Category'}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Pet Care"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-mc-text-1">
              Colour
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, colour: color })}
                  className={`h-12 w-12 rounded-full border-2 transition-all ${
                    formData.colour === color ? 'border-mc-accent scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleSave}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-mc-text-2">
          Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
        </p>
      </Modal>

      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature="Custom Categories"
        benefits={[
          'Create unlimited custom categories',
          'Choose custom colours for categories',
          'Edit category names and colours',
          'Organise expenses your way',
        ]}
      />
    </div>
  );
}
