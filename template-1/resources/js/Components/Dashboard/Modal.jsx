import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IconX } from '@tabler/icons-react';

export default function Modal({ children, title, show = false, maxWidth = '2xl', closeable = true, type = 'modal', onClose = () => { } }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        full: 'sm:max-w-full',
    }[maxWidth];

    if (type === 'slide-over') {
        return (
            <Transition show={show} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className={`pointer-events-auto w-screen ${maxWidthClass}`}>
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
                                            <div className="px-4 py-6 sm:px-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100">
                                                        {title}
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-transparent text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                            onClick={close}
                                                        >
                                                            <span className="sr-only">Tutup panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex-1 px-4 py-6 sm:px-6">
                                                {children}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-75"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`mb-6 bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-xl transform transition-all w-full sm:mx-auto ${maxWidthClass}`}
                    >
                        <div className={'border-b px-4 py-3 font-semibold text-base flex items-center justify-between gap-2 text-gray-700 dark:border-gray-900 dark:text-gray-300'}>
                            <Dialog.Title>
                                {title}
                            </Dialog.Title>
                            <button
                                type="button"
                                className="rounded-md bg-transparent text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                onClick={close}
                            >
                                <span className="sr-only">Tutup modal</span>
                                <IconX className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className='p-4'>
                            {children}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
