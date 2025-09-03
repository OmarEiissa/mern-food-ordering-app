import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type Props = {
  cuisine: string;
  field: ControllerRenderProps<FieldValues, "cuisines">;
};

const CuisineCheckbox = ({ cuisine, field }: Props) => {
  return (
    <FormItem className="flex flex-row items-center space-x-1 space-y-0 mt-2">
      <FormControl>
        <Checkbox
          className="bg-white cursor-pointer"
          checked={Array.isArray(field.value) && field.value.includes(cuisine)}
          onCheckedChange={(checked) => {
            const currentValue = Array.isArray(field.value) ? field.value : [];

            if (checked) {
              field.onChange([...field.value, cuisine]);
            } else {
              field.onChange(
                currentValue.filter((value: string) => value !== cuisine)
              );
            }
          }}
        />
      </FormControl>
      <FormLabel className="text-sm font-normal cursor-pointer">
        {cuisine}
      </FormLabel>
    </FormItem>
  );
};

export default CuisineCheckbox;
