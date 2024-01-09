import { cn } from '@/lib/utils';
import Image from 'next/image';

interface EmptyProps {
    label: string;
    imgSrc: string;
    opacity?: number;
}

const Empty = ({label, imgSrc, opacity}: EmptyProps ) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44 flex flex-col gap-6">
            <div className='h-full'>
              <Image
                className={cn('opacity-100', 'opacity-' + opacity)}
                src={imgSrc}
                alt="Empty"
                fill
                style={{objectFit:"cover"}}
              />
            </div>
        </div>

        <div><p className='text-muted-foreground text-sm text-center'>{label}</p></div>
    </div>
  )
}

export default Empty;