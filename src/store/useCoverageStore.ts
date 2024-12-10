import { create } from 'zustand';
import { CoverageItem } from '../types/coverage';

interface CoverageStore {
  inclusions: CoverageItem[];
  exclusions: CoverageItem[];
  addItem: (item: Omit<CoverageItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<CoverageItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemStatus: (id: string) => void;
  bulkUpdateItems: (items: CoverageItem[]) => void;
  bulkDeleteItems: (ids: string[]) => void;
}

export const useCoverageStore = create<CoverageStore>((set) => ({
  inclusions: [
    {
      id: 'inc-1',
      name: 'Liability Coverage',
      description: 'Basic third-party liability coverage as required by law',
      category: 'inclusion',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more initial inclusions...
  ],
  
  exclusions: [
    {
      id: 'exc-1',
      name: 'Intentional Damage',
      description: 'Damage caused intentionally by the insured or authorized drivers',
      category: 'exclusion',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more initial exclusions...
  ],

  addItem: (item) => {
    const newItem: CoverageItem = {
      id: `${item.category}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...item,
    };

    set((state) => ({
      [item.category === 'inclusion' ? 'inclusions' : 'exclusions']: [
        ...state[item.category === 'inclusion' ? 'inclusions' : 'exclusions'],
        newItem,
      ],
    }));
  },

  updateItem: (id, updates) => {
    set((state) => {
      const updateList = (items: CoverageItem[]) =>
        items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
        );

      return {
        inclusions: updateList(state.inclusions),
        exclusions: updateList(state.exclusions),
      };
    });
  },

  deleteItem: (id) => {
    set((state) => ({
      inclusions: state.inclusions.filter((item) => item.id !== id),
      exclusions: state.exclusions.filter((item) => item.id !== id),
    }));
  },

  toggleItemStatus: (id) => {
    set((state) => {
      const updateList = (items: CoverageItem[]) =>
        items.map((item) =>
          item.id === id
            ? { ...item, isActive: !item.isActive, updatedAt: new Date() }
            : item
        );

      return {
        inclusions: updateList(state.inclusions),
        exclusions: updateList(state.exclusions),
      };
    });
  },

  bulkUpdateItems: (items) => {
    set((state) => {
      const newInclusions = [...state.inclusions];
      const newExclusions = [...state.exclusions];

      items.forEach((item) => {
        const list = item.category === 'inclusion' ? newInclusions : newExclusions;
        const index = list.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          list[index] = { ...item, updatedAt: new Date() };
        }
      });

      return {
        inclusions: newInclusions,
        exclusions: newExclusions,
      };
    });
  },

  bulkDeleteItems: (ids) => {
    set((state) => ({
      inclusions: state.inclusions.filter((item) => !ids.includes(item.id)),
      exclusions: state.exclusions.filter((item) => !ids.includes(item.id)),
    }));
  },
}));