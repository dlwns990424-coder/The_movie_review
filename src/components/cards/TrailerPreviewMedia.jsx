import { useEffect, useRef, useState } from "react";
import { ORIGINAL_URL } from "../../constants/imageUrl";
import { getVideos } from "../../api/videoApi";
import { CLIP_PRIORITY } from "../../constants/videoPriority";

let youtubeApiPromise = null;

const videoCache = new Map();

const loadYouTubeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");

      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      script.onerror = () => {
        youtubeApiPromise = null;
        reject(new Error("YouTube API를 불러오지 못했습니다."));
      };

      document.body.appendChild(script);
    }
  });

  return youtubeApiPromise;
};

const findVideo = (videos, videoPriority) => {
  const youtubeVideos = videos.filter(
    (video) => video.site === "YouTube" && video.key && video.size >= 720,
  );

  // 1순위: 이름에 Official Trailer가 들어간 공식 영상
  const officialTrailer = youtubeVideos.find(
    (video) =>
      video.official &&
      video.type === "Trailer" &&
      video.name?.toLowerCase().includes("official trailer"),
  );

  if (officialTrailer) {
    return officialTrailer;
  }

  // 2순위부터는 전달받은 우선순위 배열대로 찾기
  for (const type of videoPriority) {
    const officialVideo = youtubeVideos.find(
      (video) =>
        video.type === type &&
        video.official &&
        !video.name?.toLowerCase().includes("short"),
    );

    if (officialVideo) {
      return officialVideo;
    }

    const normalVideo = youtubeVideos.find(
      (video) =>
        video.type === type && !video.name?.toLowerCase().includes("short"),
    );

    if (normalVideo) {
      return normalVideo;
    }
  }

  return null;
};

export default function TrailerPreviewMedia({
  itemId,
  mediaType,
  backdropPath,
  title,
  isActive = false,
  videoPriority = CLIP_PRIORITY,
}) {
  const playerElementRef = useRef(null);
  const playerRef = useRef(null);

  const [videoKey, setVideoKey] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isActive || !itemId || !mediaType) {
      return;
    }

    let isMounted = true;

    const fetchVideo = async () => {
      const priorityKey = videoPriority.join("-");
      const cacheKey = `${mediaType}-${itemId}-${priorityKey}`;

      setIsVideoLoading(true);
      setIsPlayerReady(false);
      setHasError(false);

      try {
        let selectedVideo = videoCache.get(cacheKey);

        if (selectedVideo === undefined) {
          const data = await getVideos(mediaType, itemId);

          selectedVideo = findVideo(data.results || [], videoPriority);

          videoCache.set(cacheKey, selectedVideo ?? null);
        }

        if (!isMounted) return;

        setVideoKey(selectedVideo?.key ?? null);
      } catch (error) {
        if (!isMounted) return;

        console.error("영상 데이터 요청 실패:", error);
        setVideoKey(null);
        setHasError(true);
      } finally {
        if (isMounted) {
          setIsVideoLoading(false);
        }
      }
    };

    fetchVideo();

    return () => {
      isMounted = false;
    };
  }, [itemId, mediaType, isActive, videoPriority]);

  useEffect(() => {
    if (!isActive || !videoKey || hasError || !playerElementRef.current) {
      return;
    }

    let isMounted = true;

    const createPlayer = async () => {
      try {
        const YT = await loadYouTubeApi();

        if (!isMounted || !playerElementRef.current) return;

        playerRef.current = new YT.Player(playerElementRef.current, {
          videoId: videoKey,

          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            mute: 1,
            playsinline: 1,
            rel: 0,
            playlist: videoKey,
          },

          events: {
            onReady: (event) => {
              if (!isMounted) return;

              event.target.mute();
              event.target.playVideo();

              setIsPlayerReady(true);
            },

            onError: () => {
              if (!isMounted) return;

              setHasError(true);
              setIsPlayerReady(false);
            },
          },
        });
      } catch (error) {
        if (!isMounted) return;

        console.error("YouTube 플레이어 생성 실패:", error);
        setHasError(true);
      }
    };

    createPlayer();

    return () => {
      isMounted = false;
      setIsPlayerReady(false);

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = null;
    };
  }, [videoKey, isActive, hasError]);

  useEffect(() => {
    if (isActive) return;

    setVideoKey(null);
    setIsVideoLoading(false);
    setIsPlayerReady(false);
    setHasError(false);
  }, [isActive]);

  const showVideo = isActive && videoKey && isPlayerReady && !hasError;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {backdropPath ? (
        <img
          src={`${ORIGINAL_URL}${backdropPath}`}
          alt={`${title} 배경 이미지`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-zinc-800 transition-opacity duration-500 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-sm text-white/50">이미지 없음</span>
        </div>
      )}

      {videoKey && !hasError && (
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={playerElementRef} className="h-full w-full" />
        </div>
      )}

      {isActive &&
        (isVideoLoading || (videoKey && !isPlayerReady)) &&
        !hasError && (
          <div className="pointer-events-none absolute bottom-3 right-3">
            <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
              영상 로딩 중
            </span>
          </div>
        )}
    </div>
  );
}
