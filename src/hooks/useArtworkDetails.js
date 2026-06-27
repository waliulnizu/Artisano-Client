import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";

export function useArtworkDetails(id) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const initPageData = async () => {
      try {
        // ১. কারেন্ট ইউজার ফেচ
        const userRes = await fetch(`${API_URL}/auth/me`, { method: "GET", credentials: "include" });
        let loggedInUser = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setCurrentUser(userData.user);
            loggedInUser = userData.user;
          }
        }

        // ২. আর্টওয়ার্ক স্পেসিফিকেশন ফেচ
        const artRes = await fetch(`${API_URL}/content/${id}`, { method: "GET", credentials: "include" });
        if (artRes.ok) {
          const artData = await artRes.json();
          if (artData.success) setArtwork(artData.data);
        }

        // 👑 ৩. পেমেন্ট সাকসেস হ্যান্ডলার (স্ট্রাইপ রিডাইরেক্ট ইন্টারসেপ্টর)
        if (typeof window !== "undefined" && loggedInUser) {
          const urlParams = new URLSearchParams(window.location.search);
          const isSuccess = urlParams.get("success") === "true";
          const stripeSessionId = urlParams.get("session_id");

          if (isSuccess && stripeSessionId) {
            const verifyToast = toast.loading("Securing your digital asset ownership... 🛡️");
            try {
              const verifyRes = await fetch(`${API_URL}/stripe/verify-single-purchase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId: stripeSessionId,
                  userId: loggedInUser.id || loggedInUser._id,
                  artworkId: id
                })
              });

              if (verifyRes.ok) {
                toast.success("Ownership Verified! Welcome to the Art Discussion ✨", { id: verifyToast });
                setHasPurchased(true);
                // ইউআরএল বার সাথে সাথে ক্লিন করা হলো যেন পরবর্তী রিফ্রেশে ডুপ্লিকেট রিকোয়েস্ট না যায়
                window.history.replaceState({}, document.title, window.location.pathname);
              } else {
                toast.dismiss(verifyToast);
              }
            } catch (err) {
              console.error("Verification hook drop:", err);
              toast.dismiss(verifyToast);
            }
          }
        }

        // ৪. ওনারশিপ গ্লোবাল চেক (ডাটাবেস লাইভ সিঙ্ক)
        if (loggedInUser) {
          const checkRes = await fetch(`${API_URL}/stripe/check-ownership?userId=${loggedInUser.id || loggedInUser._id}&artworkId=${id}`, {
            method: "GET",
            credentials: "include"
          });
          const checkData = await checkRes.json();
          if (checkData.success && checkData.hasPurchased) {
            setHasPurchased(true);
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

    setBuyLoading(true);
    const stripeToast = toast.loading("Connecting secure checkout pipeline... 💳");
    
    try {
      const res = await fetch(`${API_URL}/stripe/create-single-purchase-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId: artwork._id,
          price: artwork.price,
          title: artwork.title,
          userId: currentUser?.id || currentUser?._id
        })
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
    handleBuyArtwork
  };
}