import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './EntryRow.module.scss';
import PhotoAlbum, { PhotoProps } from 'react-photo-album';
import YetAnotherLightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { AspectRatio, Box, BoxProps, useBreakpointValue } from '@chakra-ui/react';
import { AspectAttachedVideo } from './AspectAttachedVideo';
import { useInView } from 'react-intersection-observer';
import { ObservedImage } from './ObservedImage';
import { AttachedFile, Entry } from '../../../../services/models/entry';
import { getAttachedFileFullPath } from './utils';

interface Props {
  e: Entry;
  onOpenImageCarousel: (images: AttachedFile[], currentImageIndex: number) => void;
}

export const EntryRowMedia = ({ e, onOpenImageCarousel, ...rest }: Props & BoxProps) => {
  const isMobileDevice = useBreakpointValue({ base: true, sm: false });
  const onOpenImageLightbox = useCallback(
    (photoIndex: number) => {
      onOpenImageCarousel(e.media.images, photoIndex);
    },
    [e],
  );
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '400px',
  });

  return (
    <Box ref={ref} {...rest}>
      {e.media.images.length > 0 && isMobileDevice ? (
        <MobileSlideShow e={e} inView={inView} />
      ) : e.media.images.length > 0 ? (
        <DesktopPhotoAlbum e={e} onOpenImageLightbox={onOpenImageLightbox} />
      ) : (
        e.media.videos.length > 0 && <VideoPlayer e={e} inView={inView} />
      )}
    </Box>
  );
};

const DesktopPhotoAlbum = ({
  e,
  onOpenImageLightbox,
}: Pick<Props, 'e'> & { onOpenImageLightbox: (imageIndex: number) => void }) => {
  const photos = useMemo(() => {
    return e.media.images.map((i, index) => {
      const modulus = index % 2 === 1;
      return {
        src: getAttachedFileFullPath(i),
        width: i.width ?? (modulus ? 600 : 400),
        height: i.height ?? (modulus ? 400 : 600),
      };
    });
  }, [e]);

  const wrapperRef = useRef<HTMLDivElement>();
  const dimension = useCompDimensions(wrapperRef);
  const { numberOfColumns, wrapperWidth } = useMemo(() => {
    let numberOfColumns = 4;
    let wrapperWidth = '100%';
    if (dimension.width < 550) {
      numberOfColumns = 2;
      if (photos.length === 1) {
        wrapperWidth = '50%';
      }
    } else if (dimension.width < 800) {
      numberOfColumns = 3;
      if (photos.length === 2) {
        wrapperWidth = '67%';
      } else if (photos.length === 1) {
        wrapperWidth = '33%';
      }
    } else {
      if (photos.length === 3) {
        wrapperWidth = '75%';
      } else if (photos.length === 2) {
        wrapperWidth = '50%';
      } else if (photos.length === 1) {
        wrapperWidth = '25%';
      }
    }
    return {
      numberOfColumns,
      wrapperWidth,
    };
  }, [dimension.width]);

  return (
    <Box ref={wrapperRef} className={styles.wrapper} w={'100%'}>
      <Box w={wrapperWidth}>
        <PhotoAlbum
          layout={'masonry'}
          photos={photos}
          columns={() => numberOfColumns}
          onClick={(a, b, photoIndex) => onOpenImageLightbox(photoIndex)}
          renderPhoto={RenderPhotoAlbumImage}
        />
      </Box>
    </Box>
  );
};

const RenderPhotoAlbumImage = ({
  photo,
  imageProps,
  wrapperProps,
}: PhotoProps & {
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const { width, height } = photo;
  const { src, alt, title, style, sizes, className, onClick } = imageProps;
  const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

  return (
    <div
      style={{
        width: style.width,
        padding: style.padding,
        marginBottom: style.marginBottom,
        ...wrapperStyle,
      }}
      {...restWrapperProps}
    >
      <ObservedImage
        wrapperProps={
          {
            as: AspectRatio,
            ratio: width / height,
          } as any
        }
        src={src}
        alt={alt}
        title={title}
        sizes={sizes}
        width={width}
        height={height}
        className={className}
        onClick={onClick}
      />
    </div>
  );
};

const MobileSlideShow = ({ e, inView }: Pick<Props, 'e'> & { inView: boolean }) =>
  inView && (
    <YetAnotherLightbox
      slides={e.media.images.map((i) => ({ src: getAttachedFileFullPath(i) }))}
      inline={{
        style: { width: '100%', maxWidth: 'calc(100vw - 2rem)', aspectRatio: '5/6' },
      }}
      plugins={[Inline, Fullscreen, Thumbnails]}
      carousel={{ finite: e.media.images.length <= 5 }}
    />
  );

const VideoPlayer = ({ e, inView }: Pick<Props, 'e'> & { inView: boolean }) =>
  inView && <AspectAttachedVideo src={getAttachedFileFullPath(e.media.videos[0])} />;

function useCompDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: -1, height: -1 });
  useEffect(() => {
    const remeasure = () => {
      if (ref.current) {
        const boundingRect = ref.current.getBoundingClientRect();
        const { width, height } = boundingRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    };
    remeasure();
    window.addEventListener('resize', remeasure);
    return () => {
      window.removeEventListener('resize', remeasure);
    };
  }, [ref.current]);
  return dimensions;
}
