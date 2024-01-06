import DeleteItemModal from '@/components/common/Modals/deleteItemModal';
import EditItemModal from '@/components/common/Modals/editItemModal';
import { localDate } from '@/lib/common';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { MouseEvent, useState } from 'react';
import { IListItem } from '../../../../../types';
import { Checkbox } from './checkbox';
import DropdownMenu from './dropdownMenu';

interface IItemCardProps {
  item: IListItem;
  onToggleCompletion: any;
}

export function ItemCard({ item, onToggleCompletion }: IItemCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div
        className={`bg-zinc-800 shadow rounded-lg cursor-pointer mx-auto py-4 w-full ${
          item.is_completed ? '!bg-neutral-800' : ''
        }`}
      >
        <div className="flex items-center space-x-4 w-11/12 mx-auto relative">
          <li
            key={item.id}
            className="w-11/12 mx-auto flex items-center space-x-4"
            onClick={() => onToggleCompletion(item.id)}
          >
            <Checkbox postId={item.id} selected={item.is_completed} />
            <div>
              <h3
                className={`text-lg font-medium text-gray-100 ${
                  item.is_completed ? 'line-through !text-gray-400' : ''
                }`}
              >
                {item.description}
              </h3>
              <small className="text-gray-400">
                {localDate(item.modified_date)}
              </small>
            </div>
          </li>
          <div className="flex gap-2">
            <div className="rounded border border-gray-500 px-2 py-1 flex justify-between items-center space-x-1">
              <span className="text-gray-400 leading-none">
                {item.quantity}
              </span>
            </div>
            <button
              className="rounded-fullhover:bg-zinc-600 cursor-pointer block"
              type="button"
              onClick={handleDropdown}
            >
              <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <DropdownMenu
            open={showDropdown}
            setOpen={setShowDropdown}
            setShowEditModal={setShowEditModal}
            setShowDeleteModal={setShowDeleteModal}
            item={item}
          />
          <EditItemModal
            item={item}
            setShowModal={setShowEditModal}
            showModal={showEditModal}
          />
          <DeleteItemModal
            item={item}
            setShowModal={setShowDeleteModal}
            showModal={showDeleteModal}
          />
        </div>
      </div>
    </>
  );
}
