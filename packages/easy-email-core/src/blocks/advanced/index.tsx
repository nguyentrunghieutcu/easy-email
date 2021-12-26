import { AdvancedType } from '@core/constants';
import { AdvancedText, AdvancedButton, AdvancedImage, AdvancedDivider, AdvancedSpacer, AdvancedNavbar, AdvancedAccordion, AdvancedCarousel, AdvancedRow } from './blocks';
import { IRow } from './blocks/Row';

export const advancedBlocks = {
  [AdvancedType.TEXT]: AdvancedText,
  [AdvancedType.BUTTON]: AdvancedButton,
  [AdvancedType.IMAGE]: AdvancedImage,
  [AdvancedType.DIVIDER]: AdvancedDivider,
  [AdvancedType.SPACER]: AdvancedSpacer,
  [AdvancedType.NAVBAR]: AdvancedNavbar,
  [AdvancedType.ACCORDION]: AdvancedAccordion,
  [AdvancedType.CAROUSEL]: AdvancedCarousel,
  [AdvancedType.CAROUSEL]: AdvancedCarousel,
  //
  [AdvancedType.ROW]: AdvancedRow,
};


export type {
  IRow
};