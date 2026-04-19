import { Map } from '@/src/components/map';
import AppLayout from '@/src/components/layout/AppLayout';

export default function Page() {
  return (
    <AppLayout>
      <div className="w-full h-full">
        <Map />
      </div>
    </AppLayout>
  );
}