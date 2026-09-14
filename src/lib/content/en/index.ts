export { common }    from './common';
export { auth }      from './auth';
export { patientHome } from './patientHome';
export { triage }    from './triage';
export { emergency } from './emergency';
export { facilities } from './facilities';
export { booking }   from './booking';
export { queue }     from './queue';
export { doctor }    from './doctor';
export { records }   from './records';
export { medicines } from './medicines';
export { pharmacist } from './pharmacist';
export { complaints } from './complaints';
export { profile }   from './profile';
export { admin }     from './admin';
export { states }    from './states';

import { common }    from './common';
import { auth }      from './auth';
import { patientHome } from './patientHome';
import { triage }    from './triage';
import { emergency } from './emergency';
import { facilities } from './facilities';
import { booking }   from './booking';
import { queue }     from './queue';
import { doctor }    from './doctor';
import { records }   from './records';
import { medicines } from './medicines';
import { pharmacist } from './pharmacist';
import { complaints } from './complaints';
import { profile }   from './profile';
import { admin }     from './admin';
import { states }    from './states';

export const en = {
  common,
  auth,
  patientHome,
  triage,
  emergency,
  facilities,
  booking,
  queue,
  doctor,
  records,
  medicines,
  pharmacist,
  complaints,
  profile,
  admin,
  states,
} as const;
