import { Fragment, type ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[100]">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0"
            style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(4px)' }}
          />
        </TransitionChild>

        <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-8 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-8 md:translate-y-0 md:scale-95"
          >
            <DialogPanel
              className={`w-full ${sizeMap[size]} flex flex-col max-h-[90vh]`}
              style={{
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div
                className="md:hidden w-10 h-1 mx-auto mt-2 rounded-full"
                style={{ background: 'var(--border-default)' }}
              />

              {title && (
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <DialogTitle
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: 'var(--text-xl)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {title}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-9 h-9 transition-colors"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--surface-sunken)',
                      color: 'var(--text-secondary)',
                    }}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

              {footer && (
                <div
                  className="flex items-center justify-end gap-3 px-5 py-4"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                  {footer}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
