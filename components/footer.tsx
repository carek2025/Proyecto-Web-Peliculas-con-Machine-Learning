"use client"

import Link from "next/link"
import { Film, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black/90 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
                Ilegalmovie
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              La mejor plataforma de streaming con miles de películas y series. Disfruta del mejor entretenimiento.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Juegos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Acción
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Drama
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Comedia
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terror
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ciencia Ficción
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@ilegalmovie.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Movie Street, Hollywood, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Ilegalmovie. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Términos de Servicio
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
