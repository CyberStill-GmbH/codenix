import { Link } from 'react-router-dom'
import logo from '@/assets/icons/logo.png'
import { authBrandContent } from '../constants/authContent'

export function AuthMobileBrand() {
  return (
    <div className="mb-8 flex justify-center lg:hidden">
      <Link
        to="/"
        className="inline-flex"
        aria-label={`Volver al inicio de ${authBrandContent.title}`}
      >
        <span className="flex h-16 w-16 items-center justify-center">
          <img
            src={logo}
            alt=""
            className="h-full w-full scale-[1.28] object-contain"
          />
        </span>
      </Link>
    </div>
  )
}
