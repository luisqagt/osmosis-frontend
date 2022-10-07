import { FunctionComponent } from "react";
import Image from "next/image";
import classNames from "classnames";
import React from "react";

export interface ToStringWise {
  toString: () => string;
}

export type MenuDropdownIconProps<T extends ToStringWise> = {
  value: T;
  display: string;
  currentValue: T;
  image: string;
  index: number;
  optionLength: number;
  onSelect: ({ value }: { value: T }) => void;
};
export const MenuDropdownIcon: FunctionComponent<
  MenuDropdownIconProps<ToStringWise>
> = ({
  value,
  display,
  image,
  onSelect,
  index,
  currentValue,
  optionLength,
}) => {
  return (
    <button
      className={classNames(
        "px-[1rem] py-[0.5rem] cursor-pointer hover:bg-osmoverse-700 flex items-center ",
        {
          "text-rust-200": value === currentValue,
          "rounded-b-xlinset": index === optionLength - 1,
          "rounded-t-xlinset": index === 0,
        }
      )}
      key={value.toString()}
      onClick={() => onSelect({ value })}
    >
      <div className="flex items-center justify-center min-w-[24px]">
        <Image src={image} width={24} height={24} alt={`${display}`} />
      </div>
      <p className="ml-[0.75rem]">{display.toString()}</p>
    </button>
  );
};
