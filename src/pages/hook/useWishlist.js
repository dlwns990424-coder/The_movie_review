import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

export const useWishlist = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, isLoggedIn } = useAuth();

  const [wishlist, setWishlist] = useState([]);

  const wishlistKey =
    isLoggedIn && currentUser?.id ? `wishlist-${currentUser.id}` : null;

  // 현재 로그인 사용자의 찜 목록 불러오기
  const loadWishlist = useCallback(() => {
    if (!wishlistKey) {
      setWishlist([]);
      return;
    }

    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem(wishlistKey) || "[]",
      );

      setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
    } catch (error) {
      console.log("찜 목록 불러오기 실패:", error);
      setWishlist([]);
    }
  }, [wishlistKey]);

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistChanged", loadWishlist);

    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistChanged", loadWishlist);

      window.removeEventListener("storage", loadWishlist);
    };
  }, [loadWishlist]);

  // 특정 콘텐츠가 찜되어 있는지 확인
  const isWishlisted = useCallback(
    (itemId, mediaType) => {
      return wishlist.some(
        (item) => item.id === itemId && item.media_type === mediaType,
      );
    },
    [wishlist],
  );

  // 찜 추가 및 삭제
  const toggleWishlist = useCallback(
    (event, item, mediaType) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!isLoggedIn || !currentUser?.id) {
        navigate("/login", {
          state: {
            from: `${location.pathname}${location.search}`,
          },
        });

        return;
      }

      const wishlistItem = {
        ...item,
        media_type: mediaType,
        addedAt: new Date().toISOString(),
      };

      const alreadyWishlisted = wishlist.some(
        (savedItem) =>
          savedItem.id === wishlistItem.id &&
          savedItem.media_type === wishlistItem.media_type,
      );

      const nextWishlist = alreadyWishlisted
        ? wishlist.filter(
            (savedItem) =>
              !(
                savedItem.id === wishlistItem.id &&
                savedItem.media_type === wishlistItem.media_type
              ),
          )
        : [wishlistItem, ...wishlist];

      try {
        localStorage.setItem(wishlistKey, JSON.stringify(nextWishlist));

        setWishlist(nextWishlist);

        window.dispatchEvent(new CustomEvent("wishlistChanged"));

        if (alreadyWishlisted) {
          toast("찜 목록에서 제거되었습니다.");
        } else {
          toast.success("찜 목록에 추가되었습니다.");
        }
      } catch (error) {
        console.log("찜 목록 변경 실패:", error);
        toast.error("찜 목록을 변경하지 못했습니다.");
      }
    },
    [
      currentUser,
      isLoggedIn,
      location.pathname,
      location.search,
      navigate,
      wishlist,
      wishlistKey,
    ],
  );

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  return {
    wishlist,
    wishlistCount,
    isWishlisted,
    toggleWishlist,
    reloadWishlist: loadWishlist,
  };
};
