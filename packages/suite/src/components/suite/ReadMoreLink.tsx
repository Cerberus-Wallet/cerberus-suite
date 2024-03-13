import * as URLS from '@cerberus/urls';
import { Translation, CerberusLink } from 'src/components/suite';
import { ExtendedMessageDescriptor } from 'src/types/suite';

interface ReadMoreLinkProps {
    url: keyof Omit<typeof URLS, 'TOR_URLS'>;
    linkLabel?: ExtendedMessageDescriptor['id'];
    message?: ExtendedMessageDescriptor['id'];
}

// common component used in various places
// displays Translation with TR_LEARN_MORE value (Link) or standalone Link
export const ReadMoreLink = ({ url, message, linkLabel }: ReadMoreLinkProps) =>
    message ? (
        <Translation
            id={message}
            values={{
                TR_LEARN_MORE: (
                    <CerberusLink variant="nostyle" href={URLS[url]}>
                        <Translation id={linkLabel || 'TR_LEARN_MORE'} />
                    </CerberusLink>
                ),
            }}
        />
    ) : (
        <CerberusLink href={URLS[url]}>
            <Translation id={linkLabel || 'TR_LEARN_MORE'} />
        </CerberusLink>
    );
