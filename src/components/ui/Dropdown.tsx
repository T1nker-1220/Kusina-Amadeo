"use client";

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: 'auto' | 'w-48' | 'w-56' | 'w-64';
}

const Dropdown = ({
  trigger,
  items,
  align = 'right',
  width = 'w-48'
}: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items
          className={clsx(
            'absolute z-10 mt-2 origin-top-right rounded-lg bg-white dark:bg-gray-800',
            'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            width,
            {
              'right-0': align === 'right',
              'left-0': align === 'left'
            }
          )}
        >
          <div className="p-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={clsx(
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2',
                      {
                        'bg-gray-100 dark:bg-gray-700': active,
                        'text-gray-900 dark:text-gray-100': !item.danger,
                        'text-red-600 dark:text-red-400': item.danger,
                        'opacity-50 cursor-not-allowed': item.disabled
                      }
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
