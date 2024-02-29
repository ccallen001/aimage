'use client';

import { TransformationFormProps, Transformations } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  aspectRatioOptions,
  defaultValues,
  transformationTypes
} from '@/constants';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomField } from './CustomField';
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@radix-ui/react-select';
import { useState, useTransition } from 'react';
import { updateCredits } from '@/lib/actions/user.actions';
import MediaUploader from './MediaUploader';
import TransformedImage from './TransformedImage';

export const formSchema = z.object({
  publicId: z.string(),
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional()
});

function TransformationForm({
  data = null,
  action,
  userId,
  type,
  creditBalance,
  config = null
}: TransformationFormProps) {
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPending, startTransition] = useTransition();

  const initialValues =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  });

  function onSelectFieldHandler(
    value: string,
    onChangeField: (value: string) => void
  ) {
    const { aspectRatio, width, height } =
      aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio,
      width,
      height
    }));

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  }

  function onInputChangeHandler(
    fieldName: string,
    value: string,
    type: string,
    fieldOnChange: (value: string) => void
  ) {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }));
    }, 1000);

    return fieldOnChange(value);
  }

  async function onTransformHandler() {
    setIsTransforming(true);

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );

    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, -1);
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          className="w-full"
          name="title"
          control={form.control}
          formLabel="Image Title"
          render={({ field }) => <Input className="input-field" {...field} />}
        />

        {type === 'fill' && (
          <CustomField
            className="w-full"
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>

                <SelectContent className="bg-white opacity-100 p-2 relative z-10 w-full shadow-lg">
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="select-item p-2 outline-none rounded-sm w-full"
                    >
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              className="w-full"
              control={form.control}
              name="prompt"
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              render={({ field }) => (
                <Input
                  className="input-field"
                  value={field.value}
                  onChange={({ target }) =>
                    onInputChangeHandler(
                      field.name,
                      target.value,
                      type,
                      field.onChange
                    )
                  }
                />
              )}
            />
          </div>
        )}

        {type === 'recolor' && (
          <CustomField
            className="w-full"
            control={form.control}
            name="color"
            formLabel="Replacement Color"
            render={({ field }) => <Input className="input-field" {...field} />}
          />
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex flex-col size-full"
            render={({ field }) => (
              <MediaUploader
                image={image}
                publicId={field.value}
                setImage={setImage}
                onValueChange={field.onChange}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            className="submit-button capitalize relative z-0"
            type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>

          <Button className="submit-button capitalize" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TransformationForm;
