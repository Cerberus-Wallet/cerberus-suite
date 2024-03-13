import { getWeakRandomId } from '@cerberus/utils';

/**
 * Generate code_challenge for Oauth2
 * Authorization code with PKCE flow
 */
export const getCodeChallenge = () => getWeakRandomId(128);
