import * as Util from '@/utils/common'
import Link from 'next/link'

export default function NavMenu({ name, href, current, icon, modal }) {
  if (modal) return modal

  return (
    <Link href={href} passHref>
      <a
        className={Util.concatClasses(
          "block px-4 py-2 mb-2 text-indigo-300 text-sm font-semibold focus:outline-none hover:bg-indigo-700 rounded-lg",
          current && "bg-indigo-700 text-indigo-100"
        )}
      >
        <div className="flex flex-row items-center">{icon} {name}</div>
      </a>
    </Link>
  )
}