import { Button, Modal } from '@arco-design/web-react';
import { Stack, TextStyle } from 'easy-email-editor';
import { isString } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './index.module.scss';

type ReactCropProps = ReactCrop['props'];
export interface ImageCropProps extends Omit<ReactCropProps, 'crop'> {
  visible: boolean;
  crop?: Crop;
  onCancel: () => void;
  onOk: () => void;
}

function ImageCrop(props: ImageCropProps) {
  const [crop, setCrop] = useState<ReactCrop['props']['crop']>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  return (
    <Modal
      className={styles.imageCrop}
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        background: 'transparent',
      }}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={props.onOk}
      footer={null}
      closeIcon={null}
      title={
        <Stack distribution='equalSpacing'>
          <TextStyle variation='strong' size='large'>
            Html
          </TextStyle>
          <Stack>
            <Button onClick={props.onOk}>Cancel</Button>
            <Button type='primary' onClick={props.onOk}>
              Save
            </Button>
          </Stack>
        </Stack>
      }
    >
      <div
        style={{
          maxWidth: '80vh',
          maxHeight: '80vh',
        }}
      >
        <ReactCrop
          style={{ width: '100%' }}
          imageStyle={{ width: '100%' }}
          crop={crop}
          {...props}
          onChange={setCrop}
        />
      </div>
    </Modal>
  );
}

function useImageCrop() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState('');
  const [cropData, setCropData] = useState<Blob | null>(null);
  const onCompleteRef = useRef<null | ((data: Blob) => void)>(null);

  const openModal = useCallback(
    (src: Blob | File, onComplete: (data: Blob) => void) => {
      onCompleteRef.current = onComplete;
      setSrc(isString(src) ? src : URL.createObjectURL(src));
      setVisible(true);
    },
    []
  );

  const onComplete = async (crop: Crop) => {
    if (crop.width && crop.height && imgRef.current) {
      const croppedFile = await getCroppedImg(imgRef.current, crop);
      setCropData(croppedFile);
    }
  };

  const onOk = () => {
    if (onCompleteRef.current && cropData) {
      onCompleteRef.current(cropData);
      setVisible(false);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onImageLoaded: ReactCropProps['onImageLoaded'] = (
    image: HTMLImageElement
  ) => {
    imgRef.current = image;
  };

  return {
    visible,
    openModal,
    onComplete,
    src,
    onOk,
    onCancel,
    onImageLoaded,
  };
}

function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: Crop
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width!;
  canvas.height = pixelCrop.height!;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width!,
    pixelCrop.height!,
    0,
    0,
    pixelCrop.width!,
    pixelCrop.height!
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject('error');
      }
    });
  });
}

export { ImageCrop, useImageCrop };
