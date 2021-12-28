import React, { useEffect, useRef } from 'react';
import {
  getBlockNodeByChildEle,
  getShadowRoot,
  TextStyle,
  useBlock,
  useEditorContext,
  useEditorProps,
  useFocusIdx,
} from 'easy-email-editor';
import { BasicType, getNodeIdxFromClassName, getNodeTypeFromClassName, getValueByIdx } from 'easy-email-core';
import { RichTextField } from '../components/Form/RichTextField';
import { PresetColorsProvider } from './components/provider/PresetColorsProvider';
import ReactDOM from 'react-dom';
import { BlockAttributeConfigurationManager } from './utils/BlockAttributeConfigurationManager';
import { Uploader, UploadItem } from './utils/Uploader';
import { Message } from '@arco-design/web-react';
import { previewLoadImage } from './utils/previewLoadImage';
import { get } from 'lodash';

export interface AttributePanelProps { }

export function AttributePanel() {
  const { values, focusBlock } = useBlock();
  const { onUploadImage } = useEditorProps();
  const { initialized, formHelpers: { change } } = useEditorContext();
  const { focusIdx } = useFocusIdx();
  const { current: uploader } = useRef(
    new Uploader(onUploadImage, {
      limit: 1,
      accept: 'image/*',
    })
  );

  const valuesRef = useRef(values);

  const value = getValueByIdx(values, focusIdx);

  const Com =
    focusBlock && BlockAttributeConfigurationManager.get(focusBlock.type);

  const shadowRoot = getShadowRoot();

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    if (initialized) {
      let isUpload = false;
      const onClick = (ev: Event) => {
        if (isUpload) return;
        if (ev.target instanceof HTMLElement) {
          const target = getBlockNodeByChildEle(ev.target);
          if (!target) return;
          const blockType = getNodeTypeFromClassName(target.classList);
          const idx = getNodeIdxFromClassName(target.classList)!;
          const srcName = idx + '.attributes.src';
          const imgUrl = get(valuesRef.current, srcName) as string | undefined;


          if (blockType === BasicType.IMAGE && idx && imgUrl == '') {

            const onUploading = () => {
              isUpload = true;
              Message.loading('Uploading');
            };
            const onUploadEnd = async (photos: UploadItem[]) => {

              const picture = photos
                .filter((item) => item.status === 'done')
                .map((item) => item.url)[0] || '';

              try {
                await previewLoadImage(picture);
                Message.clear();
                change(idx + '.attributes.src', picture);
                isUpload = false;
              } catch (error: any) {
                isUpload = false;
                Message.error(error?.message || error || 'Upload failed');
              }

              uploader.off('start', onUploading);
              uploader.off('end', onUploadEnd);
            };

            uploader.on('start', onUploading);
            uploader.on('end', onUploadEnd);
            uploader.chooseFile();
          }
        }
      };

      const onDrop = async (ev: any) => {

        if (isUpload) return;
        const target = getBlockNodeByChildEle(ev.target);

        if (!target) return;
        const blockType = getNodeTypeFromClassName(target.classList);
        const idx = getNodeIdxFromClassName(target.classList)!;
        const srcName = idx + '.attributes.src';
        const imgUrl = get(valuesRef.current, srcName) as string | undefined;


        if (blockType === BasicType.IMAGE && idx && imgUrl == '') {

          const blob = ev.dataTransfer.files[0];
          if (!blob) return;
          ev.preventDefault();

          try {
            isUpload = true;
            Message.loading('Uploading');
            const picture = await onUploadImage(blob);
            await previewLoadImage(picture);
            Message.clear();
            change(idx + '.attributes.src', picture);
            isUpload = false;
          } catch (error: any) {
            isUpload = false;
            Message.error(error?.message || error || 'Upload failed');
          };
        }

      };

      shadowRoot.addEventListener('click', onClick);
      shadowRoot.addEventListener('drop', onDrop);
      return () => {
        shadowRoot.removeEventListener('click', onClick);
        shadowRoot.removeEventListener('drop', onDrop);
      };
    }
  }, [initialized, onUploadImage]);


  if (!value || !initialized) return null;

  return (
    <PresetColorsProvider>
      {Com ? (
        <Com />
      ) : (
        <div style={{ marginTop: 200, padding: '0 50px' }}>
          <TextStyle size='extraLarge'>No matching components</TextStyle>
        </div>
      )}

      <div style={{ position: 'absolute' }}>
        <RichTextField idx={focusIdx} />
      </div>
      {shadowRoot &&
        ReactDOM.createPortal(
          <style>
            {`
              .email-block [contentEditable="true"],
              .email-block [contentEditable="true"] * {
                outline: none;
                cursor: text;
              }
              `}
          </style>,
          shadowRoot as any
        )}
    </PresetColorsProvider>
  );
}
