"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarComponent } from './calendar';
import { cn } from '@shared/utils';

interface DatePickerWithRangeProps {
  className?: string;
  placeholder?: string;
}

export function DatePickerWithRange({ 
  className, 
  placeholder = "选择日期范围" 
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !placeholder && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

