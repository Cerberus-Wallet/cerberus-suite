import { CerberusdNode } from './http';

const cerberusdNode = new CerberusdNode({ port: 21325, api: 'usb' });

cerberusdNode.start();
