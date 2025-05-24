import { cn } from '@/utils/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/molecule/dropdown-menu';
import { CircleEllipsis } from 'lucide-react';
import React from 'react';

interface InfoCardProps {
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}
export const InfoCard: React.FC<InfoCardProps> = (props) => {
  return (
    <div
      className={cn(
        'rounded-[10px] flex flex-col h-[140px] text-white justify-center text-left py-5 px-10 bg-primary',
        props.className,
      )}
    >
      <span className={cn('text-[40px] font-semibold mb-1', props.titleClassName)}>
        {props.title}
      </span>
      <span className={cn('text-xl', props.descriptionClassName)}>{props.description}</span>
    </div>
  );
};

interface ListCardProps {
  title: string | React.ReactNode;
  ActionIcon?: string | React.ReactNode;
  actions?: {
    text: string | React.ReactNode;
    className?: string;
    onClick?: () => void;
  }[];
  onAction?: (action?: any) => void;
  className?: string;
  titleClassName?: string;
}
export const ListCard: React.FC<ListCardProps> = (props) => {
  return (
    <div
      className={cn(
        'shadow-lg rounded-lg h-[70px] flex items-center justify-between my-3 px-4 py-4',
        props.className,
      )}
    >
      <span className={cn('truncate', props.titleClassName)}>{props.title}</span>
      {props.actions && props.actions.length && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[50px] outline outline-0 flex justify-end">
            {props.ActionIcon || <CircleEllipsis />}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {props.actions?.map((action, index) => (
              <DropdownMenuItem
                key={index}
                className={action.className}
                onClick={() => {
                  action?.onClick?.();
                  props.onAction?.({ action, data: props });
                }}
              >
                {action.text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
