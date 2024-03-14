import { CerberusdNode } from './http';

const cerberusdNode = new CerberusdNode({ port: 21425, api: 'usb' });

cerberusdNode.start();
