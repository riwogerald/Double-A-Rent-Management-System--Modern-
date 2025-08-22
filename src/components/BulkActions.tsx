import React, { useState } from 'react';
import { CheckSquare, Square, Download, Mail, Trash2, Edit } from 'lucide-react';

interface BulkActionsProps {
  selectedItems: any[];
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  onBulkDelete?: (items: any[]) => void;
  onBulkExport?: (items: any[]) => void;
  onBulkEmail?: (items: any[]) => void;
  totalItems: number;
  itemType: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkEmail,
  totalItems,
  itemType
}) => {
  const [showActions, setShowActions] = useState(false);
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const hasSelection = selectedItems.length > 0;

  const handleSelectAll = () => {
    onSelectAll(!isAllSelected);
  };

  const handleBulkAction = (action: () => void) => {
    action();
    setShowActions(false);
    onClearSelection();
  };

  if (!hasSelection && !showActions) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-800"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          Select All
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-sm font-medium text-primary-700"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {selectedItems.length} of {totalItems} selected
        </button>
      </div>

      <div className="flex items-center gap-2">
        {onBulkExport && (
          <button
            onClick={() => handleBulkAction(() => onBulkExport(selectedItems))}
            className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        )}

        {onBulkEmail && (
          <button
            onClick={() => handleBulkAction(() => onBulkEmail(selectedItems))}
            className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            Email
          </button>
        )}

        {onBulkDelete && (
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${selectedItems.length} ${itemType}(s)?`)) {
                handleBulkAction(() => onBulkDelete(selectedItems));
              }
            }}
            className="btn-error text-xs py-1 px-2 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}

        <button
          onClick={onClearSelection}
          className="text-xs text-secondary-500 hover:text-secondary-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActions;