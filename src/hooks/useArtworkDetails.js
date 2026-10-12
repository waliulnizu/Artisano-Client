import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";

export function useArtworkDetails(id) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [totalPurchasedArtworks, setTotalPurchasedArtworks] = useState(0);
  const [quotaLimit, setQuotaLimit] = useState(3);
  const [quotaUnlimited, setQuotaUnlimited] = useState(false);
  const [quotaResetAt, setQuotaResetAt] = useState(null);
  const [tierLabel, setTierLabel] = useState("Starter Spark");

  useEffect(() => {
    const initPageData = async () => {
      try {
        // Legacy checkouts created before the dedicated confirmation page still
        // redirect here with ?success=true — forward them to the new flow.
        if (typeof window !== "undefined") {
          const legacyParams = new URLSearchParams(window.location.search);
          if (legacyParams.get("success") === "true" && legacyParams.get("session_id")) {
            window.location.replace(`/purchase/success?session_id=${legacyParams.get("session_id")}`);
            return;
          }
        }

        const userRes = await fetch(`${API_URL}/auth/me`, { method: "GET", credentials: "include" });
        let loggedInUser = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
            loggedInUser = userData.user;
          }
        }

        const artRes = await fetch(`${API_URL}/content/${id}`, { method: "GET", credentials: "include" });
        if (artRes.ok) {
          const artData = await artRes.json();
          // `data` also carries `collectorCount` — how many collectors own this edition.
          if (artData.success) setArtwork(artData.data);
        }

        // Payment verification now lives on /purchase/success (Stripe redirects there),
        // so this page only has to ask the ledger whether the viewer already owns the work.
        if (loggedInUser) {
          const checkRes = await fetch(`${API_URL}/stripe/check-ownership?artworkId=${id}`, {
            method: "GET",
            credentials: "include"
          });
          const checkData = await checkRes.json();
          if (checkData.success) {
            setHasPurchased(Boolean(checkData.hasPurchased));
            // Quota is a *monthly* window — lifetime ownership is shown separately.
            setTotalPurchasedArtworks(checkData.quotaUsed ?? checkData.totalPurchasedArtworks ?? 0);
            if (checkData.quotaLimit) setQuotaLimit(checkData.quotaLimit);
            setQuotaUnlimited(Boolean(checkData.quotaUnlimited));
            if (checkData.quotaResetAt) setQuotaResetAt(checkData.quotaResetAt);
            if (checkData.tierLabel) setTierLabel(checkData.tierLabel);
          }
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        toast.error("Failed to load artwork specifications.");
      } finally {
        setLoading(false);
      }
    };

    if (id) initPageData();
  }, [id]);

  const handleBuyArtwork = async () => {
    if (currentUser && artwork && artwork.author?._id === currentUser._id) {
      toast.error("Security Block: You cannot purchase your own uploaded artwork!");
      return;
    }

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setBuyLoading(true);
    const stripeToast = toast.loading("Connecting secure checkout pipeline... 💳");

    try {
      // Only the artwork id travels to the server — price, title and thumbnail are
      // read from the database, so a tampered payload can't change the amount.
      const res = await fetch(`${API_URL}/stripe/create-single-purchase-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: artwork._id })
      });

      const responseData = await res.json();
      if (res.ok && responseData.success && responseData.url) {
        toast.success("Redirecting to Stripe security vault... ✨", { id: stripeToast });
        window.location.href = responseData.url;
      } else {
        toast.error(responseData.message || "Checkout execution route failed.", { id: stripeToast });
      }
    } catch (error) {
      console.error("Purchase Error:", error);
      toast.error("Payment gateway communication failed.", { id: stripeToast });
    } finally {
      setBuyLoading(false);
    }
  };

  const isAuthor = currentUser && artwork?.author?._id === currentUser._id;
  const canComment = artwork?.price === 0 || artwork?.isFree || isAuthor || hasPurchased;

  return {
    artwork,
    loading,
    buyLoading,
    isAuthor,
    canComment,
    handleBuyArtwork,
    currentUser,
    hasPurchased,
    // Monthly quota state (reset every month) — not lifetime ownership.
    totalPurchasedArtworks,
    quotaLimit,
    quotaUnlimited,
    quotaResetAt,
    tierLabel
  };
}
