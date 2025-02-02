import { useDocs } from '../hooks/useDocs';

export const Changelog = () => {
    const docs = useDocs(
        `https://raw.githubusercontent.com/cerberus/cerberus-suite/${process.env.COMMIT_HASH}/packages/connect/CHANGELOG.md`,
    );

    return (
        <section>
            <a href="https://www.npmjs.org/package/@cerberus/connect-web" rel="nofollow">
                <img
                    src="https://img.shields.io/npm/v/%40cerberus/connect-web/latest?label=connect-web"
                    alt="NPM"
                />
            </a>
            &nbsp;
            <a href="https://www.npmjs.org/package/@cerberus/connect" rel="nofollow">
                <img
                    src="https://img.shields.io/npm/v/%40cerberus/connect/latest?label=connect"
                    alt="NPM"
                />
            </a>
            <div dangerouslySetInnerHTML={{ __html: docs! }} className="docs-container" />
        </section>
    );
};
