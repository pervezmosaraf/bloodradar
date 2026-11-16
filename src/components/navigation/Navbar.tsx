"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Activity, Menu, X, ShieldAlert, Heart, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface NavbarProps {
  user?: {
    email: string;
    role: "donor" | "requester" | "admin";
    fullName: string;
  } | null;
  onSignOut?: () => void;
}

export function Navbar({ user: propUser, onSignOut: propSignOut }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [activeUser, setActiveUser] = useState<NavbarProps["user"]>(propUser || null);

  useEffect(() => {
    if (propUser !== undefined) {
      setActiveUser(propUser);
      return;
    }

    // Auto-detect session from Supabase client
    async function checkAuth() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const userMeta = authData.user.user_metadata || {};

          // Query profile for role confirmation
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", authData.user.id)
            .single();

          setActiveUser({
            email: authData.user.email || "",
            role: (profile?.role || userMeta.role || "requester") as any,
            fullName: profile?.full_name || userMeta.full_name || authData.user.email?.split("@")[0] || "User",
          });
        } else {
          setActiveUser(null);
        }
      } catch {
        setActiveUser(null);
      }
    }

    checkAuth();

    // Listen to auth state transitions
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setActiveUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [propUser, supabase]);

  const handleSignOut = async () => {
    if (propSignOut) {
      propSignOut();
      return;
    }
    await supabase.auth.signOut();
    setActiveUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Find Donors", href: "/find-donors" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const getDashboardHref = () => {
    if (!activeUser) return "/login";
    if (activeUser.role === "donor") return "/dashboard/donor";
    if (activeUser.role === "admin") return "/dashboard/admin";
    return "/dashboard/requester";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:bg-brand-700 transition-colors">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Blood<span className="text-brand-600">Radar</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                Emergency Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-600",
                  pathname === link.href ? "text-brand-600 font-semibold" : "text-slate-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/emergency-request">
              <Button
                variant="danger"
                size="sm"
                className="gap-1.5 font-bold animate-pulse hover:animate-none shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency SOS
              </Button>
            </Link>

            {activeUser ? (
              <div className="flex items-center gap-2">
                <Link href={getDashboardHref()}>
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>{activeUser.fullName}</span>
                    <Badge variant="default" size="sm" className="ml-1 capitalize text-[10px]">
                      {activeUser.role}
                    </Badge>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/become-a-donor">
                  <Button variant="outline" size="sm" className="gap-1.5 border-brand-200 text-brand-600 hover:bg-brand-50 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
                    Become a Donor
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/emergency-request">
              <Button variant="danger" size="sm" className="px-2.5 py-1 text-xs font-bold">
                SOS
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-brand-50 text-brand-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {activeUser ? (
              <>
                <Link href={getDashboardHref()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth className="gap-2">
                    <User className="w-4 h-4 text-brand-600" />
                    Dashboard ({activeUser.fullName})
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-red-600 hover:bg-red-50 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/become-a-donor" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth className="gap-2">
                    <Heart className="w-4 h-4 fill-white" />
                    Register as Donor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
