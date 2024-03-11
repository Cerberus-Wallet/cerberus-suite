import React from 'react';

import type { NextraThemeLayoutProps, PageMapItem } from 'nextra';
import Link from 'next/link';

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
    const { title, pageMap } = pageOpts;

    const renderNav = (pageMap: PageMapItem[]) => {
        return pageMap.map(item => {
            if (item.kind === 'MdxPage') {
                return (
                    <li key={item.name}>
                        <Link href={item.route}>{item.name}</Link>
                    </li>
                );
            } else if (item.kind === 'Folder') {
                return (
                    <li key={item.name}>
                        {item.name}
                        <ul>{renderNav(item.children)}</ul>
                    </li>
                );
            }

            return null;
        });
    };

    return (
        <div>
            <ul>{renderNav(pageMap)}</ul>
            <h1>{title}</h1>
            <div style={{ border: '1px solid' }}>{children}</div>
        </div>
    );
}
