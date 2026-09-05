import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Eye,
  X,
  ChevronLeft,
  Search,
  Tag,
  AlertCircle
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { StaggerChildren } from '../components/Animate';
import {
  fetchInstagramMedia,
  isEventMedia,
  formatInstagramDate,
  extractHashtags,
  INSTAGRAM_CONFIG,
  type InstagramMediaItem,
} from '../lib/instagram';

// Inline Reel Player Component
function InlineReelPlayer({
  item,
  onOpenModal,
}: {
  item: InstagramMediaItem;
  onOpenModal: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showControls, setShowControls] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setProgress((current / total) * 100);

    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    setCurrentTime(formatTime(current));
    if (videoRef.current.duration) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
  };

  return (
    <div
      className="relative w-full aspect-[4/5] bg-black group overflow-hidden cursor-pointer select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={item.media_url}
        poster={item.thumbnail_url || undefined}
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />

      {/* Reel Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold border border-white/10 shadow-sm pointer-events-none">
        <Film size={12} className="text-pink-400" />
        <span>Reel</span>
      </div>

      {/* Expand / Lightbox Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal();
        }}
        aria-label="Expand video"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <Maximize2 size={13} />
      </button>

      {/* Center Play/Pause Overlay Animation */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          isPlaying && !showControls ? 'opacity-0' : 'opacity-100 bg-black/25'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-amber-500 text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
          {isPlaying ? (
            <Pause size={24} className="fill-white" />
          ) : (
            <Play size={24} className="fill-white translate-x-0.5" />
          )}
        </div>
      </div>

      {/* Bottom Video Controls Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 transition-opacity duration-300 z-10 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber / Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/30 rounded-full mb-2.5 cursor-pointer relative overflow-hidden group/bar"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="hover:text-amber-400 transition-colors p-1"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={toggleMute}
              className="hover:text-amber-400 transition-colors p-1 flex items-center gap-1"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX size={16} className="text-gray-300" /> : <Volume2 size={16} className="text-green-400" />}
            </button>
            <span className="text-[11px] text-gray-300 font-mono">
              {currentTime} / {duration}
            </span>
          </div>

          <button
            onClick={onOpenModal}
            className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white flex items-center gap-1 transition-colors"
          >
            <Eye size={12} /> Fullview
          </button>
        </div>
      </div>
    </div>
  );
}

// Multi-Image Carousel Component
function CarouselViewer({
  item,
  onOpenModal,
}: {
  item: InstagramMediaItem;
  onOpenModal: () => void;
}) {
  const images =
    item.children && item.children.data && item.children.data.length > 0
      ? item.children.data
      : [{ id: item.id, media_type: 'IMAGE' as const, media_url: item.media_url }];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = images[currentIndex];

  return (
    <div
      className="relative w-full aspect-[4/5] bg-gray-900 group overflow-hidden cursor-pointer select-none"
      onClick={onOpenModal}
    >
      <img
        src={currentMedia.media_url}
        alt={item.caption?.slice(0, 50) || 'Instagram post'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Album Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold border border-white/10 shadow-sm pointer-events-none">
        <Layers size={12} className="text-blue-400" />
        <span>
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Expand Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal();
        }}
        aria-label="Expand image"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <Maximize2 size={13} />
      </button>

      {/* Navigation Arrows for multi-item carousel */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Single Image Component
function SingleImageViewer({
  item,
  onOpenModal,
}: {
  item: InstagramMediaItem;
  onOpenModal: () => void;
}) {
  return (
    <div
      className="relative w-full aspect-[4/5] bg-gray-900 group overflow-hidden cursor-pointer select-none"
      onClick={onOpenModal}
    >
      <img
        src={item.media_url}
        alt={item.caption?.slice(0, 50) || 'Instagram post'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Photo Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold border border-white/10 shadow-sm pointer-events-none">
        <ImageIcon size={12} className="text-emerald-400" />
        <span>Photo</span>
      </div>

      {/* Expand Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal();
        }}
        aria-label="Expand image"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <Maximize2 size={13} />
      </button>

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Eye size={13} /> Click to View
        </div>
      </div>
    </div>
  );
}

// Caption Text Formatter Component
function FormattedCaption({ caption }: { caption?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!caption) return <p className="text-gray-400 text-xs italic">No caption provided.</p>;

  const isLong = caption.length > 130;
  const displayText = !expanded && isLong ? caption.slice(0, 130) + '...' : caption;

  // Split into words to style hashtags
  const words = displayText.split(/(\s+)/);

  return (
    <div className="text-xs text-gray-700 leading-relaxed">
      <span className="font-bold text-gray-900 mr-1.5 text-xs">{INSTAGRAM_CONFIG.handle}</span>
      {words.map((word, index) => {
        if (/#events?\b/i.test(word)) {
          return (
            <span
              key={index}
              className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-[11px] border border-emerald-200/60"
            >
              {word}
            </span>
          );
        } else if (word.startsWith('#')) {
          return (
            <span key={index} className="text-primary-700 font-medium hover:underline cursor-pointer">
              {word}
            </span>
          );
        } else if (word.startsWith('@')) {
          return (
            <span key={index} className="text-pink-600 font-semibold hover:underline cursor-pointer">
              {word}
            </span>
          );
        }
        return <span key={index}>{word}</span>;
      })}

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors"
        >
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </div>
  );
}

// Fullscreen Modal for Lightbox / Expanded View
function InstagramModal({
  item,
  onClose,
}: {
  item: InstagramMediaItem | null;
  onClose: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const isVideo = item.media_type === 'VIDEO';
  const isCarousel = item.media_type === 'CAROUSEL_ALBUM';
  const slides =
    isCarousel && item.children && item.children.data.length > 0
      ? item.children.data
      : [{ id: item.id, media_type: item.media_type, media_url: item.media_url }];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-lg"
      >
        <X size={20} />
      </button>

      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row border border-gray-100/20 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Column */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          {isVideo ? (
            <video
              src={item.media_url}
              poster={item.thumbnail_url}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[75vh] w-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={slides[activeSlide]?.media_url || item.media_url}
                alt="Instagram expanded view"
                className="max-h-[75vh] w-full object-contain"
              />

              {slides.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
                    {slides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info / Caption Column */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto max-h-[45vh] md:max-h-[75vh]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img
                      src="/mahalakshmi_nursing_logo.png"
                      alt="Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                    <span>{INSTAGRAM_CONFIG.handle}</span>
                    <CheckCircle2 size={14} className="text-blue-500 fill-blue-500" />
                  </div>
                  <p className="text-[11px] text-gray-500">{INSTAGRAM_CONFIG.name}</p>
                </div>
              </div>

              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                {formatInstagramDate(item.timestamp)}
              </span>
            </div>

            {/* Caption */}
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mb-6 font-sans">
              <FormattedCaption caption={item.caption} />
            </div>

            {/* Hashtag Cloud */}
            {item.caption && extractHashtags(item.caption).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {extractHashtags(item.caption).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      /#events?\b/i.test(tag)
                        ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Direct CTA */}
          <div className="pt-4 border-t border-gray-100">
            <a
              href={item.permalink || INSTAGRAM_CONFIG.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Instagram size={17} /> View Post on Instagram
              <ExternalLink size={14} className="ml-auto opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [mediaList, setMediaList] = useState<InstagramMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'events' | 'all' | 'reels' | 'photos'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<InstagramMediaItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeed = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchInstagramMedia(force);
      setMediaList(data);
    } catch (err: any) {
      console.error('Failed to load Instagram feed:', err);
      setErrorMessage('Unable to load latest Instagram updates. Showing campus profile link.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed(false);
  }, []);

  // Filter items
  const eventItems = mediaList.filter(isEventMedia);
  const hasEventPosts = eventItems.length > 0;

  const filteredItems = mediaList.filter((item) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = item.caption?.toLowerCase().includes(q);
      if (!matchCaption) return false;
    }

    // 2. Tab Filter
    if (filterType === 'events') {
      // If there are event items, strictly filter. If none exist in the 8 posts, fallback to all so page is lively
      if (hasEventPosts) {
        return isEventMedia(item);
      }
      return true; // fallback when no #events tagged yet
    }
    if (filterType === 'reels') {
      return item.media_type === 'VIDEO';
    }
    if (filterType === 'photos') {
      return item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM';
    }
    return true; // 'all'
  });

  const reelsCount = mediaList.filter((m) => m.media_type === 'VIDEO').length;
  const photosCount = mediaList.filter((m) => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM').length;

  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      <SEO
        title="Mahalakshmi College of Nursing | Campus Events, Reels & Instagram Feed"
        description="Explore live campus events, clinical workshops, student reels, and daily activities from the official Instagram page @mahalakshmicollegeofnursing in Trichy."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/events"
        keywords={[
          'Mahalakshmi College of Nursing Events',
          'Nursing College Trichy Instagram',
          'Nursing Student Reels',
          'Clinical Workshops Mahalakshmi',
          'Mahalakshmi Nursing Campus Life',
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 text-white overflow-hidden bg-primary-900">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-300 mb-6 font-medium">
            <Link to="/" className="hover:text-green-300 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-gray-500" />
            <span className="text-green-300">Events & Instagram Feed</span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-green-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles size={13} className="text-yellow-300" /> Live Campus Stream
            </div>

            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight mb-4 leading-tight">
              Campus Events & <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">Instagram Reels</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Catch up on student activities, clinical simulation workshops, campus celebrations, and real-time video reels straight from our official handle.
            </p>

            {/* Official Instagram Profile Header Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2.5px] shadow-lg flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <img
                      src="/mahalakshmi_nursing_logo.png"
                      alt={INSTAGRAM_CONFIG.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-white text-base">
                      {INSTAGRAM_CONFIG.handle}
                    </span>
                    <CheckCircle2 size={16} className="text-blue-400 fill-blue-400" />
                  </div>
                  <p className="text-xs text-gray-300">{INSTAGRAM_CONFIG.name}</p>
                  <p className="text-[11px] text-green-300 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping inline-block" />
                    Official Instagram Channel
                  </p>
                </div>
              </div>

              <a
                href={INSTAGRAM_CONFIG.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Instagram size={16} /> Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Controls Bar: Filter Tabs + Search + Refresh */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-3 sm:p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterType('events')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                filterType === 'events'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              <Sparkles size={13} className={filterType === 'events' ? 'text-yellow-300' : 'text-emerald-600'} />
              #Events Feed
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterType === 'events' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {hasEventPosts ? eventItems.length : mediaList.length}
              </span>
            </button>

            <button
              onClick={() => setFilterType('reels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'reels'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/20 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              <Film size={13} className={filterType === 'reels' ? 'text-white' : 'text-pink-600'} />
              Playable Reels ({reelsCount})
            </button>

            <button
              onClick={() => setFilterType('photos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'photos'
                  ? 'bg-primary-700 text-white shadow-primary-500/20 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              <ImageIcon size={13} />
              Photos ({photosCount})
            </button>

            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'all'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              All Updates ({mediaList.length})
            </button>
          </div>

          {/* Search and Refresh */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search caption or #tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              onClick={() => loadFeed(true)}
              disabled={refreshing || loading}
              title="Refresh Instagram Feed"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
              aria-label="Refresh feed"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin text-primary-600' : ''} />
            </button>
          </div>
        </div>

        {/* Notice if #events tag is active and showing all recent posts fallback */}
        {filterType === 'events' && !hasEventPosts && mediaList.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-600 text-white flex-shrink-0 mt-0.5">
              <Tag size={16} />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-emerald-950 text-sm mb-0.5">
                Displaying Recent Campus Posts & Playable Reels
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Posts tagged with <strong className="text-emerald-950 font-semibold">#events</strong> on Instagram will be automatically featured right here in the dedicated events stream. You can also play the video reels inline below!
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <p className="flex-1">{errorMessage}</p>
            <button
              onClick={() => loadFeed(true)}
              className="font-bold text-amber-700 underline hover:text-amber-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-2 w-16 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="w-full aspect-[4/5] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-4/5 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] mx-auto mb-4 flex items-center justify-center shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-600">
                <Instagram size={28} />
              </div>
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">No Matching Instagram Posts</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
              {searchQuery
                ? `No posts found matching "${searchQuery}". Try a different keyword.`
                : 'No posts available under this filter. Check our official Instagram profile for more updates.'}
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              className="bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Show All Updates
            </button>
          </div>
        ) : (
          /* Grid of Instagram Media Cards */
          <StaggerChildren
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            staggerDelay={80}
            baseDelay={40}
          >
            {filteredItems.map((item) => {
              const isVideo = item.media_type === 'VIDEO';
              const isCarousel = item.media_type === 'CAROUSEL_ALBUM';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group/card"
                >
                  {/* Card Top Header */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.8px] flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                          <img
                            src="/mahalakshmi_nursing_logo.png"
                            alt="College Logo"
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-1 truncate">
                          <span>{INSTAGRAM_CONFIG.handle}</span>
                          <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 flex-shrink-0" />
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {formatInstagramDate(item.timestamp)}
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.permalink || INSTAGRAM_CONFIG.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-600 transition-colors p-1"
                      title="Open on Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  </div>

                  {/* Media Content Box (Reel Player / Carousel / Photo) */}
                  <div className="relative">
                    {isVideo ? (
                      <InlineReelPlayer
                        item={item}
                        onOpenModal={() => setActiveModalItem(item)}
                      />
                    ) : isCarousel ? (
                      <CarouselViewer
                        item={item}
                        onOpenModal={() => setActiveModalItem(item)}
                      />
                    ) : (
                      <SingleImageViewer
                        item={item}
                        onOpenModal={() => setActiveModalItem(item)}
                      />
                    )}
                  </div>

                  {/* Caption & Actions */}
                  <div className="p-4 flex flex-col flex-1 justify-between bg-white border-t border-gray-50">
                    <div className="mb-3">
                      <FormattedCaption caption={item.caption} />
                    </div>

                    {/* Footer link to Instagram */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setActiveModalItem(item)}
                        className="text-gray-500 hover:text-primary-700 font-medium flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Eye size={13} /> View details
                      </button>

                      <a
                        href={item.permalink || INSTAGRAM_CONFIG.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1 text-[11px] hover:underline"
                      >
                        <span>Instagram</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        )}
      </section>

      {/* Lightbox / Reel Modal */}
      <InstagramModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}
