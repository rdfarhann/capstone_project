"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LibraryBig, Mail, Lock, GraduationCap } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="shadow-2xl bg-white rounded-2xl overflow-hidden">

        {/* Header Biru */}
        <div className="bg-linear-to-br from-blue-700 to-blue-500 px-8 py-8 text-white text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-3 rounded-full">
              <LibraryBig className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-wide uppercase">Perpustakaan Digital</h1>
          <p className="text-blue-200 text-sm mt-1 font-medium">SMK Negeri 1 Gunung Agung</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-blue-100 text-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Portal Siswa dan Guru</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-5">

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@smkn1gunungagung.sch.id"
                    required
                    className="pl-10 h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium hover:underline underline-offset-4 transition-colors"
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                    className="pl-10 h-11 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-1"
              >
                Masuk
              </Button>

              {/* Footer text */}
              <p className="text-center text-xs text-gray-500">
                Belum punya akun?{" "}
                <a
                  href="#"
                  className="text-blue-700 font-semibold hover:underline underline-offset-4"
                >
                  Hubungi Administrator
                </a>
              </p>

            </div>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-white/70">
        &copy; 2025 SMK Negeri 1 Gunung Agung. All rights reserved.
      </p>
    </div>
  )
}