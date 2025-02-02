import { Link, LinkProps } from '@cerberus/components';
import { useExternalLink } from 'src/hooks/suite';

export const CerberusLink = (props: LinkProps) => {
    const url = useExternalLink(props.href);

    return <Link {...props} href={url} />;
};
