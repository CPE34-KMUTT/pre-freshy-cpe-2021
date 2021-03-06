import { useState } from 'react'
import { Switch } from '@headlessui/react'
import Modal from '@/components/common/Modal'
import { XIcon } from '@heroicons/react/outline'
import * as Util from '@/utils/common'

export default function NewsModal({ img, title, content, category }) {
  const [isThai, setThai] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => { setIsOpen(false); setThai(false); }

  return (
    <>
      <button
        className={Util.concatClasses(
          "py-1 w-full font-bold text-center rounded-xl text-light text-white text-lg focus:outline-none",
          category.toUpperCase() == 'DAILY' && 'bg-yellow-500 hover:bg-yellow-600',
          category.toUpperCase() == 'DISASTER' && 'bg-red-500 hover:bg-red-600',
        )}
        onClick={openModal}
      >
        READ
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-8 lg:px-12 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="absolute top-0 left-0 m-5 flex items-center justify-center scale-75 md:scale-100">
            <span className="mr-2 text-sm font-medium text-gray-700">EN</span>
            <Switch
              checked={isThai}
              onChange={setThai}
              className={Util.concatClasses(
                'inline-flex items-center h-6 rounded-full w-11 focus:outline-none transform',
                isThai ? 'bg-green-400' : 'bg-gray-300'
              )}
            >
              <span
                className={`${isThai ? 'translate-x-6' : 'translate-x-1'
                  } pointer-events-none inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-300`}
              />
            </Switch>
            <span className="ml-2 text-sm font-medium text-gray-700">TH</span>
          </div>

          <div className="flex flex-col justify-center w-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 md:-translate-y-20 mx-auto w-24 h-24 md:w-32 md:h-32 z-20">
              {img}
            </div>

            <div className="bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 md:-translate-y-20 w-24 h-24 md:w-32 md:h-32 z-10" />

            <div className="flex flex-col justify-center text-center mt-5 mb-3 z-20">
              <h3 
                className={Util.concatClasses(
                  'font-semibold text-xl md:text-2xl mt-2 mb-3 md:mb-4 uppercase tracking-wide decoration-clone bg-clip-text bg-gradient-to-b text-transparent',
                  (category.toUpperCase() == 'DAILY') && 'from-yellow-500 to-red-500',
                  (category.toUpperCase() == 'DISASTER') && 'from-red-400 to-red-600'
                )}
              >
                {title}
              </h3>

              <p className="text-base md:text-xl text-gray-600 mb-4">{isThai ? content[0] : content[1]}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}