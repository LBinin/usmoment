import React from "react";
import { Image, Text, View } from "@tarojs/components";
import { PlusIcon } from "@usmoment/icon/taro";
import clsx from "clsx";
import "./image-upload-action.css";

const DEFAULT_IMAGE_UPLOAD_ACTION_PLACEHOLDER = "点击添加图片";
const DEFAULT_IMAGE_UPLOAD_ACTION_REPLACE_LABEL = "点击替换图片";

type ChooseImageResult = {
  tempFilePaths: string[];
};

type ChooseImageApi = (options: {
  count: 1;
  sourceType: ["camera", "album"];
}) => Promise<ChooseImageResult>;

type ImageUploadActionHost = typeof globalThis & {
  Taro?: {
    chooseImage?: ChooseImageApi;
  };
  wx?: {
    chooseImage?: ChooseImageApi;
  };
};

export type ImageUploadActionProps = {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  replaceLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function ImageUploadAction(props: ImageUploadActionProps) {
  const imageSrc = props.value?.trim();
  const chooseImage = async () => {
    if (props.disabled) return;
    const chooseImageApi = resolveChooseImageApi();

    if (!chooseImageApi) return;

    try {
      const result = await chooseImageApi({
        count: 1,
        sourceType: ["camera", "album"],
      });
      const nextImageSrc = result.tempFilePaths[0];

      if (nextImageSrc) {
        props.onChange?.(nextImageSrc);
      }
    } catch {
      // User cancellation is surfaced as a rejected platform promise.
    }
  };

  return (
    <View
      className={clsx(
        "usm-accounting-calculator-image-upload-action",
        props.disabled &&
          "usm-accounting-calculator-image-upload-action--disabled",
        props.className,
      )}
    >
      <View
        aria-disabled={props.disabled}
        className="usm-accounting-calculator-image-upload-action__surface"
        onClick={chooseImage}
        role="button"
      >
        {imageSrc ? (
          <View className="usm-accounting-calculator-image-upload-action__preview">
            <Image
              className="usm-accounting-calculator-image-upload-action__image"
              mode="aspectFill"
              src={imageSrc}
            />
            <Text className="usm-accounting-calculator-image-upload-action__replace-label">
              {props.replaceLabel ?? DEFAULT_IMAGE_UPLOAD_ACTION_REPLACE_LABEL}
            </Text>
          </View>
        ) : (
          <View className="usm-accounting-calculator-image-upload-action__empty">
            <PlusIcon
              className="usm-accounting-calculator-image-upload-action__plus"
              renderMode="mask"
              size="132rpx"
            />
            <Text className="usm-accounting-calculator-image-upload-action__placeholder">
              {props.placeholder ?? DEFAULT_IMAGE_UPLOAD_ACTION_PLACEHOLDER}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function resolveChooseImageApi(): ChooseImageApi | undefined {
  const host = globalThis as ImageUploadActionHost;

  return host.Taro?.chooseImage ?? host.wx?.chooseImage;
}
