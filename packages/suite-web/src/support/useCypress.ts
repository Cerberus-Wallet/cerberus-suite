import { useEffect } from 'react';
import CerberusConnect from '@cerberus/connect';
import { useStore } from 'react-redux';

/**
 * Utility for running tests in Cypress.
 * Used to augment window object with redux store and CerberusConnect instance to make it accessible in tests
 */
export const useCypress = () => {
    const store = useStore();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Cypress) {
            window.store = store;
            window.CerberusConnect = CerberusConnect;

            return () => {
                delete window.store;
                delete window.CerberusConnect;
            };
        }
    }, [store]);
};
