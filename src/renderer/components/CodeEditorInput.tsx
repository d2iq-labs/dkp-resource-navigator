import * as React from 'react';
import { Flex, PrimaryButton, SecondaryButton, SpacingBox } from '@d2iq/ui-kit';
import FormFieldWrapper from '@d2iq/ui-kit/dist/packages/shared/components/FormFieldWrapper';
import { InputAppearance } from '@d2iq/ui-kit/dist/packages/shared/types/inputAppearance';
import { renderLabel } from '@d2iq/ui-kit/dist/packages/utilities/label';
import { SystemIcons } from '@d2iq/ui-kit/dist/packages/icons/dist/system-icons-enum';
import AceEditor, { IAceEditorProps } from 'react-ace';
import nextId from 'react-id-generator';
import { css } from '@emotion/css';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';
import 'ace-builds/src-noconflict/theme-dawn';
import 'ace-builds/src-min-noconflict/ext-language_tools';

const hidden = css`
  display: none;
`;

// extend this constant as more modes are used
export const fileTypeInfo = {
  yaml: {
    uploadTypes: '.txt,.yaml,.yml,application/x-yaml,text/plain,.conf',
    downloadType: 'application/x-yaml',
  },
};

export interface CodeEditorInputProps extends IAceEditorProps {
  /**
   * Unique identifier used for the form textarea element
   */
  id: string;
  /**
   * Sets the current appearance of the component. This defaults to InputAppearance.Standard, but supports `InputAppearance.Error` & `InputAppearance.Success` appearances as well.
   */
  appearance: InputAppearance;
  /**
   * Sets the contents of the label. This can be a `string` or any `ReactNode`.
   */
  inputLabel: React.ReactNode;
  /**
   * Defaults to `true`, but can be set to `false` to visibly hide the `Textarea`'s label. The `inputLabel` should still be set even when hidden for accessibility support.
   */
  showInputLabel: boolean;
  /**
   * Text or a ReactNode that is displayed directly under the textarea with additional information about the expected input.
   */
  hintContent?: React.ReactNode;
  /**
   * Sets the contents for validation errors. This will be displayed below the textarea element. Errors are only visible when the `Textarea` appearance is also set to `InputAppearance.Error`.
   */
  errors?: React.ReactNode[];
  /**
   * Sets the text content for the tooltip that can be displayed above the input.
   */
  tooltipContent?: React.ReactNode;
  /**
   * Sets red asterisk on input label, forces truthy value on submit
   */
  required?: boolean;
  /**
   *
   */
  disabled?: boolean;
  subtitle?: React.ReactNode;
  uploadButtonContent?: React.ReactNode;
  allowDownload?: boolean;
  onUploadError?: (message: string) => void;
}

const CodeEditorInput = ({
  id: propId,
  appearance,
  inputLabel,
  showInputLabel,
  subtitle,
  hintContent,
  errors,
  tooltipContent,
  required,
  disabled,
  value,
  allowDownload,
  onUploadError,
  onChange,
  uploadButtonContent,
  ...aceProps
}: CodeEditorInputProps) => {
  /**
   * Defines ACE editor mode as well as file types for upload/download
   */
  const mode = 'yaml';
  const id = propId ?? nextId('codeeditor-');
  const hasError =
    appearance === InputAppearance.Error || (errors?.length ?? 0) > 0;
  const inputAppearance = disabled
    ? 'disabled'
    : hasError
    ? InputAppearance.Error
    : appearance;
  const parentDataCy = `codeeditor codeeditor.${inputAppearance}`;
  const textareaDataCy = `codeeditor-extra codeeditor-extra.${inputAppearance}`;

  const fileInput = React.useRef<HTMLInputElement>(null);

  const handleApplyClick = () => {
    console.log("apply click");
    console.log(value);
    // TODO: convert value string to K8sObject and patch

  };

  const handleFileUpload = (fileEvent: React.FormEvent<HTMLInputElement>) => {
    const file = fileEvent.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024 && onUploadError) {
      const msg = `The file that you tried to upload is too large or uses an invalid format. Upload a yaml-formatted kubeconfig less than 1MB in size.`;
      return onUploadError(msg);
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (onChange) {
        onChange(fileReader.result as string);
      }
    };
    fileReader.onerror = () => {
      if (onUploadError) {
        onUploadError(`File upload failed. ${fileReader.error}`);
      }
    };
    fileReader.readAsText(file);
  };

  const handleDownload = () => {
    if (value) {
      const element = document.createElement('a');
      const file = new Blob([value], {
        type: fileTypeInfo[mode].downloadType,
      });
      element.href = URL.createObjectURL(file);
      element.download = `${propId}.yml`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  return (
    <FormFieldWrapper id={id} errors={errors} hintContent={hintContent}>
      {({ getValidationErrors, getHintContent }) => (
        <div data-cy={parentDataCy}>
          {renderLabel({
            appearance: inputAppearance,
            hidden: !showInputLabel,
            id,
            label: inputLabel,
            required,
            tooltipContent,
          })}
          <SpacingBox side="bottom">{subtitle}</SpacingBox>
          <Flex gutterSize="m" align="center">
            <input
              className={hidden}
              accept={fileTypeInfo[mode].uploadTypes}
              ref={fileInput}
              onChange={handleFileUpload}
              type="file"
            />
            <PrimaryButton
              onClick={handleApplyClick}
            >
              Apply
            </PrimaryButton>
            {allowDownload && (
              <SecondaryButton
                iconStart={SystemIcons.Download}
                onClick={handleDownload}
                disabled={!value}
              >
                Download File
              </SecondaryButton>
            )}
          </Flex>
          <SpacingBox side="bottom" data-cy={textareaDataCy}>
            {getHintContent}
            {hasError ? getValidationErrors : null}
          </SpacingBox>
          <AceEditor
            {...aceProps}
            value={value}
            mode={mode}
            name={aceProps.name ?? id}
            onChange={onChange}
          />
        </div>
      )}
    </FormFieldWrapper>
  );
};

const defaultProps: Partial<CodeEditorInputProps> = {
  appearance: InputAppearance.Standard,
  showInputLabel: true,
  required: false,
  disabled: false,
  theme: 'pastel_on_dark',
  width: '100%',
  setOptions: {
    tabSize: 2,
  },
  showPrintMargin: false,
  allowDownload: false,
};

CodeEditorInput.defaultProps = defaultProps;

export default CodeEditorInput;
