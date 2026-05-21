export { siteConfig } from './site-config';
export { services } from './services';
export { servicesExtended } from './services-extended';
export { servicesExtended2 } from './services-extended2';
export { servicesExtended3 } from './services-extended3';
export { servicesOnline } from './services-online';
export { serviceAreas } from './service-areas';
export { blogPosts } from './blog';

// Combined services export for convenience
import { services } from './services';
import { servicesExtended } from './services-extended';
import { servicesExtended2 } from './services-extended2';
import { servicesExtended3 } from './services-extended3';
import { servicesOnline } from './services-online';

export const allServices = [
  ...services,
  ...servicesExtended,
  ...servicesExtended2,
  ...servicesExtended3,
  ...servicesOnline,
];
