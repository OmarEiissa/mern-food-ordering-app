import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useFormContext } from "react-hook-form";

const ImageSection = () => {
  const { control, formState, watch } = useFormContext();
  const hasError = !!formState.errors.imageFile;
  const existingImageUrl = watch("imageUrl");

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Image</h2>

        <FormDescription>
          Add an image that will displayed on your restaurant listing in the
          search results. Adding a new image will overwrite the existing one.
        </FormDescription>
      </div>

      <div className="flex flex-col gap-8 w-[50%]">
        <FormField
          control={control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <FormLabel
                    htmlFor="imageFile"
                    className="cursor-pointer relative block w-full group"
                  >
                    <img
                      src={
                        field.value
                          ? URL.createObjectURL(field.value)
                          : existingImageUrl
                          ? existingImageUrl
                          : hasError
                          ? `https://placehold.co/50/red/white?text=${formState.errors.imageFile?.message}`
                          : "https://placehold.co/200?text=Select+Image"
                      }
                      alt="Restaurant"
                      className="size-full max-h-150 aspect-video object-cover rounded-md transition-all duration-300 group-hover:blur-sm group-hover:brightness-75"
                    />

                    {/* overlay icons */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 rounded-full p-3">
                        <Edit className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </FormLabel>

                  <Input
                    id="imageFile"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    className="hidden"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ImageSection;
