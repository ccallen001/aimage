import { TransformedImageProps } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CldImage } from 'next-cloudinary';
import { dataUrl, debounce, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

function TransformedImage({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false
}: TransformedImageProps) {
  function downloadHandler() {}

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <Button className="download-btn" onClick={downloadHandler}>
            <Image
              className="pb-[6px]"
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
            />
          </Button>
        )}
      </div>

      {image?.pbulciId && transformationConfig ? (
        <div className="relative">
          <CldImage
            className="transformed-image"
            width={getImageSize(type, image, 'width')}
            height={getImageSize(type, image, 'height')}
            src={image?.publicId}
            alt="Image"
            sizes={`(max-width: 767px) 100vw, 50vw`}
            placeholder={dataUrl as PlaceholderValue}
            onLoad={() => setIsTransforming?.(false)}
            onError={() =>
              debounce(() => {
                setIsTransforming?.(false);
              }, 8000)
            }
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                alt="Transforming"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
}

export default TransformedImage;
