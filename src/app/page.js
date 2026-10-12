"use client";

import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import HomeSkeleton from "@/components/HomeSkeleton";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import CategorySection from "@/components/home/CategorySection";
import AssetSection from "@/components/home/AssetSection";
import VipCtaSection from "@/components/home/VipCtaSection";
import ArtistSection from "@/components/home/ArtistSection";
import ArtistsOfMonthSection from "@/components/home/ArtistsOfMonthSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ScrollAnimator from "@/components/ScrollAnimator";
import RecentUploadsSection from "@/components/home/RecentUploadsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import ArtistJoinSection from "@/components/home/ArtistJoinSection";

function PaymentVerificationHandler({ currentUser, setCurrentUser }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentSuccess = searchParams.get("payment_success");
  const router = useRouter();

  const verificationFired = useRef(false);

  useEffect(() => {
    if (paymentSuccess && sessionId && currentUser && !verificationFired.current) {
      verificationFired.current = true;

      axios.post(`${API_URL}/stripe/verify-payment`, {
        sessionId,
        userId: currentUser._id || currentUser.id,
        tierName: "VIP Premium Pro"
      })
      .then(() => {
        toast.success("VIP Membership Activated! Enjoy Premium Assets.");

        setCurrentUser(prev => ({
          ...prev,
          isPremium: true,
          subscriptionTier: "pro"
        }));

        router.replace("/");
      })
      .catch(() => toast.error("Verification pending."));
    }
  }, [paymentSuccess, sessionId, currentUser, setCurrentUser, router]);

  return null;
}

export default function PublicHomepage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const router = useRouter();

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userPromise = axios.get(`${API_URL}/auth/me`, { withCredentials: true }).catch(() => null);
        const dataPromise = axios.get(`${API_URL}/content/public-data`, { withCredentials: true });
        const usersPromise = axios.get(`${API_URL}/auth/public-users`).catch(() => null);

        const [userRes, response, usersRes] = await Promise.all([userPromise, dataPromise, usersPromise]);

        if (userRes && userRes.data.success) {
          setCurrentUser(userRes.data.user);
        }

        if (response.data.success) {
          setContent(response.data.data);
        }

        if (usersRes && usersRes.data.success) {
          setArtists(usersRes.data.data || []);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setCurrentUser(null);
        } else {
          console.error("Error loading public gallery:", error);
          toast.error("Failed to load global art gallery.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const derived = useMemo(() => {
    const list = Array.isArray(content) ? content : [];
    const free = list.filter((i) => !i.isPremiumOnly);
    const premium = list.filter((i) => i.isPremiumOnly);

    const catMap = {};
    list.forEach((i) => {
      const c = (i.category || "general").toLowerCase();
      catMap[c] = (catMap[c] || 0) + 1;
    });
    const categories = Object.entries(catMap).map(([name, count]) => ({ name, count }));

    return {
      free,
      premium,
      categories,
      stats: {
        total: list.length,
        free: free.length,
        premium: premium.length,
        categories: categories.length,
      },
    };
  }, [content]);

  const handleResourceAccess = async (item) => {
    if (!item) return;

    const authorId = item.author && typeof item.author === 'object' ? (item.author._id || item.author.id) : item.author;
    const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;

    const isIdMatched = authorId && currentUserId && (String(authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase());
    const isNameMatched = item.author?.name && currentUser?.name && (item.author.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase());

    const isOwnAsset = isIdMatched || isNameMatched;

    if (!item.isPremiumOnly || isOwnAsset) {
      if (item.resourceLink) {
        window.open(item.resourceLink, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No download link attached for this free resource.");
      }
      return;
    }

    setActionLoadingId(item._id);
    try {
      const checkRes = await axios.get(`${API_URL}/content/premium-data`, { withCredentials: true });
      if (checkRes.status === 200) {
        if (item.resourceLink) {
          toast.success("VIP Access Granted! Opening resource...");
          window.open(item.resourceLink, "_blank", "noopener,noreferrer");
        } else {
          toast.error("No download link attached to this premium asset.");
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toast(error.response.status === 401 ? "Please login to access Premium resources!" : "This exclusive resource is for Premium Pro members only!", {
          duration: 5500,
          position: "top-center",
          style: {
            background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A',
            fontWeight: 'bold', fontSize: '13px', marginTop: '40px', padding: '12px 24px', borderRadius: '12px'
          }
        });
        setTimeout(() => {
          if (error.response.status === 401) {
            router.push("/login");
          } else {
            router.push("/premium");
          }
        }, 1500);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#e9f0dc] dark:bg-zinc-950 transition-colors duration-300">
      <Suspense fallback={null}>
        <PaymentVerificationHandler currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </Suspense>
      <ScrollAnimator />

      <HeroSection totalAssets={derived.stats.total} totalArtists={artists.length} currentUser={currentUser} />
      <StatsBar stats={derived.stats} />
      <CategorySection categories={derived.categories} />
      <AssetSection
        title="Premium Highlights"
        subtitle="Exclusive, high-value assets from top-rated creators."
        items={derived.premium.slice(0, 6)}
        currentUser={currentUser}
        actionLoadingId={actionLoadingId}
        onResourceAccess={handleResourceAccess}
        emptyText="No premium assets available yet."
        variant="premium"
      />
      <VipCtaSection />
      <AssetSection
        title="Free Resources"
        subtitle="Open-access brushes, textures, and tutorials for everyone."
        items={derived.free.slice(0, 6)}
        currentUser={currentUser}
        actionLoadingId={actionLoadingId}
        onResourceAccess={handleResourceAccess}
        emptyText="No free resources available yet."
        variant="free"
      />
      <ArtistsOfMonthSection artists={artists} />
      <ArtistSection artists={artists} />
      <RecentUploadsSection items={[...(content || [])].slice(-4).reverse()} />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <ArtistJoinSection />
      <NewsletterSection />
    </div>
  );
}
