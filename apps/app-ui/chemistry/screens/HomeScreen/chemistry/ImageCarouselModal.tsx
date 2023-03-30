import React, { useEffect } from 'react';
import YetAnotherLightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { getAttachedFileFullPath } from './utils';
import { AttachedFile } from '../../../../services/models/entry';

interface ImageCarouselModalProps {
  currentIndex: number;
  images: AttachedFile[];
  onClose: () => void;
}

export const ImageCarouselModal = ({
  currentIndex,
  images,
  onClose,
}: ImageCarouselModalProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  });

  return (
    <YetAnotherLightbox
      slides={images.map((i) => ({ src: getAttachedFileFullPath(i) }))}
      open={true}
      index={currentIndex}
      close={onClose}
      plugins={[Fullscreen, Slideshow, Thumbnails]}
      carousel={{ finite: images.length <= 5 }}
    />
  );
};
