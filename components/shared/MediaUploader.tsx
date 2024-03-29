'use client';

import { useToast } from '@/components/ui/use-toast';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { dataUrl, getImageSize } from '@/lib/utils';
import Image from 'next/image';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import { IImage } from '@/lib/database/models/image.model';

interface MediaUploaderProps {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  image: IImage | null;
  publicId: string;
  type: string;
}

function MediaUploader({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) {
  const { toast } = useToast();

  function onUploadSuccessHandler(response: any) {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: response?.info?.public_id,
      width: response?.info?.width,
      height: response?.info?.height,
      secureURL: response?.info?.secure_url
    }));

    onValueChange(response?.info?.public_id);

    toast({
      className: 'success-toast',
      title: 'Image uploaded successfully!',
      description: '1 credit was deducted from your account',
      duration: 5000
    });
  }

  function onUploadErrorHandler(response: any) {
    toast({
      className: 'error-toast',
      title: 'Something went wrong while uploading...',
      description: 'Please try again',
      duration: 5000
    });
  }

  return (
    <CldUploadWidget
      uploadPreset="aimage"
      options={{ multiple: false, resourceType: 'image' }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>

          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, 'width')}
                height={getImageSize(type, image, 'height')}
                src={publicId}
                alt="Image"
                sizes={`(max-width: 767px) 100vw, 50vw`}
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add image"
                  width={24}
                  height={24}
                />
              </div>

              <p className="p-14-medium">Click to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}

export default MediaUploader;
