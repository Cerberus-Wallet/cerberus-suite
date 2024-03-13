import { ComponentType } from 'react';
import { Modal as CerberusModal, ModalProps as CerberusModalProps } from '@cerberus/components';
import { DefaultRenderer } from './DefaultRenderer';

export type ModalProps = CerberusModalProps & {
    renderer?: ComponentType<CerberusModalProps>;
};

export const Modal = ({ renderer: View = DefaultRenderer, ...props }: ModalProps) => (
    <View {...props} />
);

Modal.Header = CerberusModal.Header;
Modal.Body = CerberusModal.Body;
Modal.Description = CerberusModal.Description;
Modal.Content = CerberusModal.Content;
Modal.BottomBar = CerberusModal.BottomBar;
Modal.closeIconWidth = CerberusModal.closeIconWidth;
