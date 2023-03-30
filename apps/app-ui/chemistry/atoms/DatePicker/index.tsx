import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { forwardRef } from 'react';
import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { MdClear } from 'react-icons/md';

interface Props {
  selectedDate: Date | null;
  onChange: (newDate: Date) => void;
  onClear?: () => void;
}

export const DatePicker = ({ selectedDate, onChange, onClear }: Props) => (
  // @ts-ignore
  <ReactDatePicker
    selected={selectedDate}
    onChange={onChange}
    // @ts-ignore
    customInput={<CustomInput onClear={onClear} />}
  />
);

const CustomInput = forwardRef<
  HTMLInputElement,
  { value: string; onClick: () => void; onClear?: () => void }
>(
  (
    {
      value,
      onClick,
      onClear,
    }: { value: string; onClick: () => void; onClear?: () => void },
    ref,
  ) => (
    <InputGroup size={'sm'}>
      <Input
        onClick={onClick}
        ref={ref}
        value={value}
        onChange={() => {}}
        pr={value && onClear != null ? '2.5rem' : undefined}
      />
      {value && onClear != null && (
        <InputRightElement width={'2.5rem'}>
          <IconButton
            variant={'ghost'}
            h={'1.5rem'}
            size={'sm'}
            onClick={onClear}
            px={0}
            aria-label={'Clear Input'}
            icon={<MdClear />}
          />
        </InputRightElement>
      )}
    </InputGroup>
  ),
);
