/**
 * Clears database. Use it to avoid persistence between tests
 *
 * @example cy.resetDb()
 */
export const resetDb = () => {
    const request = indexedDB.deleteDatabase('cerberus-suite');

    request.onerror = function () {
        return cy;
    };

    request.onsuccess = function () {
        return cy;
    };
};
