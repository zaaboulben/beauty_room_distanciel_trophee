// import Scene from '@/component/Scene';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/component/Scene'), { ssr: false })

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-between ">
        <Scene/>
    </main>
  );
}
