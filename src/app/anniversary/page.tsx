import { redirect } from 'next/navigation';

// The campaign page moved: the event is World Physiotherapy Day week (Sep 6-14),
// not a clinic anniversary (the clinic opened Aug 3). Permanent redirect.
export default function AnniversaryRedirect() {
  redirect('/physiotherapy-day');
}
